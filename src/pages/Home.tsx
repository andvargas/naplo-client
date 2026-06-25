import ActivitySelector from "@/components/ActivitySelector/ActivitySelector";
import { useEffect, useState } from "react";
import { getProjects, type Project } from "@/api/projects";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/Modal/Modal";
import AddProjectForm from "@/components/Projects/AddProjectForm";
import { addProject } from "@/api/projects";
import { addTimelog, updateTimelog, getTimelogs } from "@/api/timelogs";
import type { Timelog } from "@/types";
import TodaySummary from "@/components/Timelogs/TodaySummary";
import TodayLog from "@/components/Timelogs/TodayLog";
import { addDiaryEntry } from "@/api/diaryentries";
import { updateUserActivityTypes } from "@/api/user";

export default function Home() {
  const { user, updateActivityTypes } = useAuth();
  const [activityType, setActivityType] = useState("");
  const [project, setProject] = useState("");
  const [customer, setCustomer] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const projectNames = projects.map((p) => p.projectName);

  const customers = [...new Set(projects.map((p) => p.customer))];

  const [activeLog, setActiveLog] = useState<Timelog | null>(null);
  const [stage, setStage] = useState<"Idle" | "Started" | "Paused" | "Finished">("Idle");
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const [todayTotalMs, setTodayTotalMs] = useState(0);
  const [lastSessionMs, setLastSessionMs] = useState(0);
  const [todayTasks, setTodayTasks] = useState<string[]>([]);

  const [todayLogs, setTodayLogs] = useState<Timelog[]>([]);
  const [pauseStartedAt, setPauseStartedAt] = useState<Date | null>(null);
  const [lunchBreakMs, setLunchBreakMs] = useState(0);
  const [lunchBreakApplied, setLunchBreakApplied] = useState(false);
  const [grossMs, setGrossMs] = useState(0);

  const loadTodaySummary = async () => {
    if (!user) return;

    const response = await getTimelogs();

    const today = new Date().toDateString();

    const todaysLogs = response.data.filter((log) => log.username === user.username && new Date(log.startDate).toDateString() === today);

    const totalMs = todaysLogs.reduce((sum, log) => sum + log.duration, 0);

    const tasks = [...new Set(todaysLogs.map((log) => log.project))];

    const completedLogs = todaysLogs.filter((log) => log.duration > 0);

    const lastSession = completedLogs.length > 0 ? completedLogs[completedLogs.length - 1].duration : 0;

    const lunchBreakMs = todaysLogs.reduce((sum, log) => sum + (log.totalDailyMinutes || 0), 0);
    const grossMs = totalMs - lunchBreakMs;

    setTodayTotalMs(totalMs);
    setTodayTasks(tasks);
    setLastSessionMs(lastSession);
    setTodayLogs(todaysLogs);
    setGrossMs(grossMs);
    setLunchBreakMs(lunchBreakMs);
  };


  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const data = await getProjects();

      const filtered = data.filter((p) => p.statusActive && p.username === user.username);

      setProjects(filtered);
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadActiveLog = async () => {
      try {
        const response = await getTimelogs();

        const activeLogs = response.data.filter((log) => log.username === user.username && log.duration === 0);

        if (activeLogs.length === 0) return;

        const latestActive = activeLogs.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

        setActiveLog(latestActive);
        setStage("Started");
      } catch (err) {
        console.error(err);
      }
    };

    loadActiveLog();
  }, [user]);

  useEffect(() => {
    if (!activeLog) return;

    const update = () => {
      const elapsed = Date.now() - new Date(activeLog.startDate).getTime();

      setElapsedMinutes(Math.round(elapsed / 60000));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [activeLog]);

  useEffect(() => {
    loadTodaySummary();
  }, [user]);

  const handleAddProject = async (data: { projectName: string; customer: string; description: string }) => {
    try {
      await addProject({ ...data, username: user?.username });

      setShowAddProjectModal(false);

      // Reload projects
      const refreshed = await getProjects();

      const filtered = refreshed.filter((p) => p.statusActive && p.username === user?.username);

      setProjects(filtered);
    } catch (err: any) {
      alert(err.response?.data || "Failed to create project");
    }
  };

  const handleAddActivityType = async (newType: string) => {
    if (!user) return;

    try {
      const currentTypes = user.activityTypes ?? [];
      const updatedTypes = [...currentTypes, newType];

      // Send both username and the new array to the backend route
      await updateUserActivityTypes(user.username, updatedTypes);

      // Update local global auth context state so changes reflect instantly in dropdown
      updateActivityTypes(updatedTypes);

      // Automatically select the newly created type for convenience
      setActivityType(newType);
    } catch (err: any) {
      console.error("Failed to add activity type:", err);
      alert(err.response?.data || "Failed to save the new activity type to the database.");
    }
  };

  const handleStart = async () => {
    if (!user) return;

    if (!activityType || !project) {
      alert("Please select activity type and project");
      return;
    }

    try {
      const response = await addTimelog({
        username: user.username,
        tasksAccomplished: [],
        duration: 0,
        startDate: new Date().toISOString(),
        project,
        customer,
        activityType,
        totalDailyMinutes: 0,
      });

      setActiveLog(response.data);
      setStage("Started");
      setLunchBreakApplied(false);
      await loadTodaySummary();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePause = async () => {
    if (!activeLog) return;

    try {
      const duration = Date.now() - new Date(activeLog.startDate).getTime();

      const updated = await updateTimelog(activeLog._id, {
        duration,
      });

      setPauseStartedAt(new Date());

      setActiveLog(null);
      setElapsedMinutes(0);
      setStage("Paused");

      await loadTodaySummary();

      console.log("Paused log:", updated.data);
    } catch (err) {
      console.error("Failed to pause log", err);
    }
  };

  const startClass = stage === "Started" ? "bg-cyan-300 border border-black text-black" : "bg-green-600 text-white";

  const pauseClass = stage === "Paused" ? "bg-cyan-300 border border-black text-black" : "bg-yellow-500 text-white";

  const finishClass = stage === "Finished" ? "bg-cyan-300 border-black text-black" : "bg-red-600 text-white";

  const formatMs = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")}`;
  };

  const handleFinish = async () => {
    if (!user) return;

    try {
      // close active session if one exists
      if (activeLog) {
        const duration = Date.now() - new Date(activeLog.startDate).getTime();

        await updateTimelog(activeLog._id, {
          duration,
        });
      }

      const response = await getTimelogs();

      const today = new Date().toDateString();

      const todaysLogs = response.data.filter((log) => log.username === user.username && new Date(log.startDate).toDateString() === today);

      const totalMs = todaysLogs.reduce((sum, log) => sum + log.duration, 0);

      const projectsWorked = [...new Set(todaysLogs.map((log) => log.project))];

      const diaryEntry = `
Finished for today, you spent ${formatMs(totalMs)} hours working.

Projects worked on:
${projectsWorked.map((p) => `- ${p}`).join("\n")}

Sessions completed: ${todaysLogs.length}
`.trim();

      await addDiaryEntry({
        username: user.username,
        diaryEntry,
        date: new Date().toISOString(),
        entryType: "work",
      });

      setActiveLog(null);
      setElapsedMinutes(0);
      setStage("Finished");

      await loadTodaySummary();
    } catch (err) {
      console.error(err);
    }
  };
  const handleLunchBreak = async () => {
    if (!pauseStartedAt || !user) return;

    try {
      const response = await getTimelogs();
      const today = new Date().toDateString();

      const todaysLogs = response.data.filter((log) => log.username === user.username && new Date(log.startDate).toDateString() === today);

      if (!todaysLogs.length) return;

      const lastLog = todaysLogs[todaysLogs.length - 1];

      const lunchBreakMs = pauseStartedAt.getTime() - Date.now();

      await updateTimelog(lastLog._id, {
        totalDailyMinutes: lunchBreakMs,
      });

      setLunchBreakApplied(true);
      await loadTodaySummary();

      alert("Lunch break recorded");
    } catch (err) {
      console.error(err);
    }
  };

  const isPaused = stage === "Paused" && !activeLog;

  

  return (
    <div>
      <ActivitySelector
        projects={projectNames}
        customers={customers}
        activityType={activityType}
        project={project}
        customer={customer}
        onActivityTypeChange={setActivityType}
        onProjectChange={setProject}
        onCustomerChange={setCustomer}
        onAddProject={() => setShowAddProjectModal(true)}
        onAddActivityType={handleAddActivityType}
      />
      <Modal isOpen={showAddProjectModal} title="Add Project" onClose={() => setShowAddProjectModal(false)}>
        <AddProjectForm onSubmit={handleAddProject} />
      </Modal>
      <div className="mt-6">
        <div className="mt-6 flex gap-4 justify-center">
          <button onClick={handleStart} className={`px-4 py-2 rounded ${startClass}`}>
            Start
          </button>

          <button onClick={handlePause} disabled={!activeLog} className={`px-4 py-2 rounded ${pauseClass}`}>
            Pause
          </button>

          <button onClick={handleFinish} className={`px-4 py-2 rounded ${finishClass}`}>
            Finish
          </button>
        </div>
      </div>
      {activeLog && (
        <div className="mt-4 text-center">
          <div>
            Project: <strong>{activeLog.project}</strong>
          </div>

          <div>
            Activity: <strong>{activeLog.activityType}</strong>
          </div>

          <div>
            Elapsed: <strong>{elapsedMinutes} mins</strong>
          </div>
        </div>
      )}
      <TodayLog logs={todayLogs} />

      {isPaused && pauseStartedAt && (
        <div className="mt-4 text-center">
          <p>
            Started a break at{" "}
            <strong>
              {pauseStartedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </p>

          <button
            onClick={handleLunchBreak}
            disabled={lunchBreakApplied}
            className={`mt-2 px-3 py-2 rounded text-white ${lunchBreakApplied ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"}`}
          >
            {lunchBreakApplied ? "Lunch Added" : "Add Lunch Break"}
          </button>
        </div>
      )}

      <TodaySummary
        totalMs={activeLog ? todayTotalMs + elapsedMinutes * 60000 : todayTotalMs}
        grossMs={grossMs}
        lastSessionMs={lastSessionMs}
        tasks={todayTasks}
        lunchBreakMs={lunchBreakMs}
      />
    </div>
  );
}
