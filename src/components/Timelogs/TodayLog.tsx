import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import type { Timelog } from "@/types";
import Modal from "@/components/Modal/Modal";
import Tooltip from "@/components/Tooltip/Tooltip";
import {
  LuClipboardPlus,
  LuClipboardPenLine,
  LuTrash2,
  LuNotebookPen,
  LuClipboardList,
  LuLightbulb,
  LuCircleHelp,
  LuLink,
  LuCheck,
  LuX,
} from "react-icons/lu";
import QuickTaskInput from "@/components/Timelogs/QuickTaskInput";

interface Props {
  logs: Timelog[];
}

const taskTypeIcon = {
  task: LuClipboardList,
  solution: LuLightbulb,
  question: LuCircleHelp,
  link: LuLink,
};

export default function TodayLog({ logs }: Props) {
  const [selectedLog, setSelectedLog] = useState<Timelog | null>(null);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [taskManagerOpen, setTaskManagerOpen] = useState(false);

  const sortedLogs = [...logs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskType, setNewTaskType] = useState<"task" | "solution" | "question" | "link">("task");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const { tasks, addTask, editTask, removeTask, reload } = useTasks(selectedLog?._id);

  useEffect(() => {
    if (taskManagerOpen && selectedLog?._id) {
      reload();
    }
  }, [taskManagerOpen, selectedLog?._id]);

  return (
    <>
      <h3 className="max-w-3xl mx-auto px-4 text-left mt-8 mb-2 text-lg font-semibold">Today's Activity</h3>

      <ul className="max-w-3xl mx-auto px-4 list-none space-y-4 text-left">
        {sortedLogs.map((log) => (
          <li
            key={log._id}
            className={`flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-100 border border-gray-300 shadow-sm px-4 py-3 ${
              log.duration === 0 ? "border-l-4 border-l-cyan-500" : ""
            }`}
          >
            <span className="flex-1 text-sm sm:text-base">
              At <strong>{formatTime(log.startDate)}</strong> started working on <strong>{log.project}</strong> ({log.activityType})
              {log.duration === 0 ? (
                <>
                  {" "}
                  · <span className="font-bold">Active</span>
                </>
              ) : (
                <>
                  {" "}
                  · Spent <span className="font-bold">{Math.round(log.duration / 60000)}</span> minutes
                </>
              )}
            </span>

            <div className="flex items-center gap-2 justify-end shrink-0">
              <Tooltip label="Add quick task">
                <button
                  className="border border-gray-300 bg-white rounded-full p-2 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedLog(log);
                    setQuickTaskOpen(true);
                  }}
                >
                  <LuClipboardPlus color="green" />
                </button>
              </Tooltip>

              <Tooltip label="Manage tasks">
                <button
                  className="border border-gray-300 bg-white rounded-full p-2 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedLog(log);
                    setTaskManagerOpen(true);
                  }}
                >
                  <LuClipboardPenLine color="blue" />
                </button>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={quickTaskOpen} title="Quick Task" onClose={() => setQuickTaskOpen(false)}>
        <QuickTaskInput
          onSubmit={async (text: string, taskType) => {
            if (!selectedLog) return;

            await addTask({
              todo: text,
              project: selectedLog.project,
              linkedTimelogId: selectedLog._id,
              taskType,
            });

            setQuickTaskOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={taskManagerOpen}
        title="Session Tasks"
        onClose={() => {
          setTaskManagerOpen(false);
          setSelectedLog(null);
        }}
      >
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter" && editingTaskId === null) {
              e.preventDefault();
              setTaskManagerOpen(false);
              setSelectedLog(null);
            }
          }}
        >
          {/* Add task bar */}
          <div className="flex gap-2 mb-5">
            <input
              className="flex-1 min-w-0 border border-gray-300 rounded p-2"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="New task..."
            />

            <select
              className="hidden md:block border border-gray-300 rounded p-2"
              value={newTaskType}
              onChange={(e) => setNewTaskType(e.target.value as "task" | "solution" | "question" | "link")}
            >
              <option value="task">Task</option>
              <option value="solution">Solution</option>
              <option value="question">Question</option>
              <option value="link">Link</option>
            </select>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shrink-0"
              onClick={async () => {
                if (!selectedLog || !newTaskText.trim()) return;

                await addTask({
                  todo: newTaskText,
                  project: selectedLog.project,
                  linkedTimelogId: selectedLog._id,
                  taskType: newTaskType,
                });

                setNewTaskText("");
                setNewTaskType("task");
              }}
            >
              Add
            </button>
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-3">
            {tasks.map((task) => {
              const TypeIcon = taskTypeIcon[task.taskType];
              const isEditing = editingTaskId === task._id;

              return (
                <div key={task._id} className="group border-b border-gray-200 pb-3">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-2 shrink-0"
                          checked={task.status === "completed"}
                          onChange={() =>
                            editTask(task._id, {
                              status: task.status === "completed" ? "open" : "completed",
                              ...(task.status !== "completed" && !task.doneTask ? { doneTask: task.todo } : {}),
                            })
                          }
                        />
                        <textarea
                          autoFocus
                          className="w-full min-h-[60px] border border-gray-300 rounded p-2"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex gap-1 rounded p-1">
                          {(["task", "solution", "question", "link"] as const).map((type) => {
                            const Icon = taskTypeIcon[type];
                            return (
                              <button
                                title={`Change to ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                                key={type}
                                type="button"
                                className={`p-2 rounded flex items-center justify-center ${
                                  task.taskType === type ? "bg-sky-100" : "hover:bg-gray-100"
                                }`}
                                onClick={() => editTask(task._id, { taskType: type })}
                              >
                                <Icon />
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            title="Save changes"
                            onClick={async () => {
                              const trimmed = editValue.trim();
                              if (!trimmed) return;

                              await editTask(task._id, {
                                ...(task.status === "completed" ? { doneTask: trimmed } : { todo: trimmed }),
                              });

                              setEditingTaskId(null);
                            }}
                          >
                            <LuCheck color="green" size={20} />
                          </button>

                          <button onClick={() => setEditingTaskId(null)} title="Cancel editing">
                            <LuX color="red" size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <input
                          type="checkbox"
                          className="mt-1 shrink-0"
                          checked={task.status === "completed"}
                          onChange={() =>
                            editTask(task._id, {
                              status: task.status === "completed" ? "open" : "completed",
                              ...(task.status !== "completed" && !task.doneTask ? { doneTask: task.todo } : {}),
                            })
                          }
                        />
                        <div className="flex-1 text-left min-w-0 text-sm">{task.status === "completed" ? task.doneTask || task.todo : task.todo}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <TypeIcon />
                        </div>

                        <Tooltip label="Edit task">
                          <button
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditValue(task.status === "completed" ? task.doneTask || task.todo : task.todo);
                            }}
                          >
                            <LuNotebookPen color="blue" />
                          </button>
                        </Tooltip>

                        <Tooltip label="Delete task">
                          <button onClick={() => removeTask(task._id)}>
                            <LuTrash2 color="red" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-center mt-4">
              <button
                className="bg-red-800 hover:bg-red-900 text-gray-100 px-6 py-2 rounded"
                onClick={() => {
                  setTaskManagerOpen(false);
                  setSelectedLog(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}