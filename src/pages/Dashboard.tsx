import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTimelogs } from "@/api/timelogs";
import useProjects from "@/hooks/useProjects";
import { useAuth } from "@/context/AuthContext";
import { useTimesheet } from "@/context/TimesheetContext";
import DashboardFilterBar from "@/components/Dashboard/DashboardFilterBar";
import SessionsList from "@/components/Dashboard/SessionsList";
import { getAllTasks } from "@/api/tasks";
import type { Timelog, Task } from "@/types";

const isThisWeek = (date: Date) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
};

const isLastWeek = (date: Date) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() - 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { setTimesheetData } = useTimesheet();
  const navigate = useNavigate();

  const [allLogs, setAllLogs] = useState<Timelog[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedActivityType, setSelectedActivityType] = useState("all");
  const [weekFilter, setWeekFilter] = useState<"none" | "this" | "last">("none");

  const { projects } = useProjects(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;

    getAllTasks().then((res) => setTasks(res.data));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    getTimelogs()
      .then((res) => {
        setAllLogs(res.data.filter((log) => log.username === user.username));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const customers = useMemo(() => Array.from(new Set(projects.map((p) => p.customer).filter(Boolean))) as string[], [projects]);

  const activityTypes = user?.activityTypes ?? [];

  const taskCountByLog = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((task) => {
      if (!task.linkedTimelogId) return;
      map[task.linkedTimelogId] = (map[task.linkedTimelogId] ?? 0) + 1;
    });
    return map;
  }, [tasks]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const d = new Date(log.startDate);

      if (weekFilter === "this" && !isThisWeek(d)) return false;
      if (weekFilter === "last" && !isLastWeek(d)) return false;
      if (weekFilter === "none") {
        if (d.getMonth().toString() !== selectedMonth) return false;
        if (d.getFullYear() !== selectedYear) return false;
      }

      if (selectedCustomer !== "all" && log.customer !== selectedCustomer) return false;
      if (selectedActivityType !== "all" && log.activityType !== selectedActivityType) return false;

      return true;
    });
  }, [allLogs, weekFilter, selectedMonth, selectedYear, selectedCustomer, selectedActivityType]);

  const totalDuration = filteredLogs.reduce((sum, log) => sum + log.duration, 0);

  const handlePrintTimesheet = () => {
    setTimesheetData(filteredLogs);
    navigate("/timesheet");
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading sessions...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={handlePrintTimesheet}
          disabled={filteredLogs.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded"
        >
          Print Timesheet
        </button>
      </div>

      <DashboardFilterBar
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedCustomer={selectedCustomer}
        selectedActivityType={selectedActivityType}
        weekFilter={weekFilter}
        customers={customers}
        activityTypes={activityTypes}
        onChangeMonth={setSelectedMonth}
        onChangeYear={setSelectedYear}
        onChangeCustomer={setSelectedCustomer}
        onChangeActivityType={setSelectedActivityType}
        onChangeWeekFilter={setWeekFilter}
      />

      <div className="text-sm text-gray-500 mb-3">
        {filteredLogs.length} session{filteredLogs.length !== 1 ? "s" : ""} · Total: {Math.floor(totalDuration / 3600000)}h{" "}
        {Math.round((totalDuration % 3600000) / 60000)}m
      </div>

      <SessionsList sessions={filteredLogs} taskCountByLog={taskCountByLog} />
    </div>
  );
}
