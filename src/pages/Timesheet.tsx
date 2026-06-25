import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { useTimesheet } from "@/context/TimesheetContext";
import { getAllTasks } from "@/api/tasks";
import TimesheetTaskList from "@/components/Timesheet/TimesheetTaskList";
import type { Task } from "@/types";

// Round up to the nearest minute, same as old "kerekites"
const roundUpToMinute = (ms: number) => {
  const remainder = ms % 60000;
  return remainder === 0 ? ms : ms + (60000 - remainder);
};

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.round((ms % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function Timesheet() {
  const { timesheetData } = useTimesheet();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hourlyRate, setHourlyRate] = useState(35);

  useEffect(() => {
    getAllTasks().then((res) => setTasks(res.data));
  }, []);

  const tasksByLog = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (!task.linkedTimelogId) return;
      if (!map[task.linkedTimelogId]) map[task.linkedTimelogId] = [];
      map[task.linkedTimelogId].push(task);
    });
    return map;
  }, [tasks]);

  const changeRate = () => {
    const input = prompt("What is the hourly rate?", hourlyRate.toString());
    if (input) setHourlyRate(Number(input));
  };

  const totalAmount = timesheetData.reduce((sum, log) => sum + (roundUpToMinute(log.duration) / 60000) * (hourlyRate / 60), 0);

  const totalTimeSpent = timesheetData.reduce((sum, log) => sum + roundUpToMinute(log.duration), 0);

  const thisMonth = new Date().toLocaleString("default", { month: "long" });
  const thisYear = new Date().getFullYear();

  if (timesheetData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No data to display. Go back to the{" "}
        <Link to="/" className="text-blue-600 underline">
          Dashboard
        </Link>{" "}
        and filter sessions first.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-900 text-white flex items-center justify-center p-4 relative">
        <Link to="/" className="absolute left-4 text-gray-400 hover:text-white">
          <MdHome size={20} />
        </Link>
        <h2 className="text-xl font-semibold">
          Timesheet — {thisMonth} {thisYear}
        </h2>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white text-base">
            <th className="p-2 text-left">Date/Time</th>
            <th className="p-2 text-left">Project</th>
            <th className="p-2 text-left">Task</th>
            <th className="p-2 text-left">Hours:Min</th>
            <th className="p-2 text-left cursor-pointer" onClick={changeRate} title="Click to change hourly rate">
              Rate £{hourlyRate}*
            </th>
          </tr>
        </thead>
        <tbody>
          {timesheetData.map((log) => {
            const time = `${addZero(new Date(log.startDate).getHours())}:${addZero(new Date(log.startDate).getMinutes())}`;
            const logTasks = tasksByLog[log._id] ?? [];

            return (
              <tr key={log._id} className="border-b">
                <td className="p-2">
                  {new Date(log.startDate).toLocaleDateString()} {time}
                </td>
                <td className="p-2">{log.project}</td>
                <td className="p-2">
                  <TimesheetTaskList tasks={logTasks} />
                </td>
                <td className="p-2">{formatDuration(roundUpToMinute(log.duration))}</td>
                <td className="p-2">£{((roundUpToMinute(log.duration) / 60000) * (hourlyRate / 60)).toFixed(2)}</td>
              </tr>
            );
          })}
          <tr className="bg-gray-800 text-white font-semibold">
            <td className="p-2">
              <h3 className="text-base m-0">Total:</h3>
            </td>
            <td className="p-2"></td>
            <td className="p-2"></td>
            <td className="p-2">
              <h3 className="text-base m-0">{formatDuration(totalTimeSpent)}</h3>
            </td>
            <td className="p-2">
              <h3 className="text-base m-0">£{totalAmount.toFixed(2)}</h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
