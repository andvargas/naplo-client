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

export default function Home() {
  const { user } = useAuth();
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

  const loadTodaySummary = async () => {
    if (!user) return;

    const response = await getTimelogs();

    const today = new Date().toDateString();

    const todaysLogs = response.data.filter((log) => log.username === user.username && new Date(log.startDate).toDateString() === today);

    const totalMs = todaysLogs.reduce((sum, log) => sum + log.duration, 0);

    const tasks = [...new Set(todaysLogs.map((log) => log.project))];

    const completedLogs = todaysLogs.filter((log) => log.duration > 0);

    const lastSession = completedLogs.length > 0 ? completedLogs[completedLogs.length - 1].duration : 0;

    setTodayTotalMs(totalMs);
    setTodayTasks(tasks);
    setLastSessionMs(lastSession);
    setTodayLogs(todaysLogs);
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

  const pauseClass = stage === "Paused" ? "bg-cyan-500 text-white" : "bg-yellow-500 text-white";

  const finishClass = stage === "Finished" ? "bg-cyan-500 text-white" : "bg-red-600 text-white";

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

          <button className={`px-4 py-2 rounded ${finishClass}`}>Finish</button>
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
      <TodaySummary totalMs={activeLog ? todayTotalMs + elapsedMinutes * 60000 : todayTotalMs} lastSessionMs={lastSessionMs} tasks={todayTasks} />
    </div>
  );
}
