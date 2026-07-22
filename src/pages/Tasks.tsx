import { useEffect, useMemo, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { FiCheckCircle, FiCircle, FiClock, FiHelpCircle, FiLink, FiList, FiTool } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";

export default function Tasks() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { tasks, reload, editTask, removeTask } = useTasks(undefined, true);

  useEffect(() => {
    reload();
  }, []);

  const projects = useMemo(() => {
    return [...new Set(tasks.map((t) => t.project))].sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (projectFilter !== "all" && task.project !== projectFilter) return false;

      if (typeFilter !== "all" && task.taskType !== typeFilter) return false;

      if (statusFilter !== "all" && task.status !== statusFilter) return false;

      return true;
    });
  }, [tasks, projectFilter, typeFilter, statusFilter]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
        {/* Type */}

        <div className="flex gap-2">
          <button onClick={() => setTypeFilter("all")} className={`p-2 rounded ${typeFilter === "all" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}>
            All
          </button>

          <button onClick={() => setTypeFilter("task")} className={`p-2 rounded ${typeFilter === "task" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}>
            <FiList />
          </button>

          <button
            onClick={() => setTypeFilter("solution")}
            className={`p-2 rounded ${typeFilter === "solution" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            <FiTool />
          </button>

          <button
            onClick={() => setTypeFilter("question")}
            className={`p-2 rounded ${typeFilter === "question" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            <FiHelpCircle />
          </button>

          <button onClick={() => setTypeFilter("link")} className={`p-2 rounded ${typeFilter === "link" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}>
            <FiLink />
          </button>
        </div>

        {/* Project */}

        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="all">All projects</option>

          {projects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        {/* Status */}

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`p-2 rounded ${statusFilter === "all" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            All
          </button>

          <button
            onClick={() => setStatusFilter("open")}
            className={`p-2 rounded ${statusFilter === "open" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            <FiCircle />
          </button>

          <button
            onClick={() => setStatusFilter("in progress")}
            className={`p-2 rounded ${statusFilter === "in progress" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            <FiClock />
          </button>

          <button
            onClick={() => setStatusFilter("completed")}
            className={`p-2 rounded ${statusFilter === "completed" ? "bg-teal-300 text-indigo-900" : "bg-gray-200"}`}
          >
            <FiCheckCircle />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task._id} className="bg-gray-100 border border-gray-300 rounded p-4 flex gap-4">
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() =>
                editTask(task._id, {
                  status: task.status === "completed" ? "open" : "completed",
                })
              }
            />

            <div className="flex-1 text-left">
              <div className={task.status === "completed" ? "line-through text-gray-500" : ""}>{task.todo}</div>

              <div className="text-sm text-gray-500 text-left">
                {task.project} · {task.taskType}
              </div>
            </div>

            <div className="flex gap-2 ms-auto">
              <button onClick={() => removeTask(task._id)} className="text-red-600">
                <LuTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
