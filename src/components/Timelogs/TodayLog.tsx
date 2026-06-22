import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import type { Timelog } from "@/types";
import styles from "./TodayLog.module.css";
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

interface Props {
  logs: Timelog[];
}

export default function TodayLog({ logs }: Props) {
  const [selectedLog, setSelectedLog] = useState<Timelog | null>(null);

  const [quickTaskOpen, setQuickTaskOpen] = useState(false);

  const [taskManagerOpen, setTaskManagerOpen] = useState(false);

  const sortedLogs = [...logs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskType, setNewTaskType] = useState<"task" | "solution" | "question" | "link">("task");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { tasks, addTask, editTask, removeTask, reload } = useTasks(selectedLog?._id);

  useEffect(() => {
    if (taskManagerOpen && selectedLog?._id) {
      reload();
    }
  }, [taskManagerOpen, selectedLog?._id]);

  const QuickTaskInput = ({ onSubmit }: { onSubmit: (text: string, type: "task" | "solution" | "question" | "link") => void }) => {
    const [value, setValue] = useState("");
    const [taskType, setTaskType] = useState<"task" | "solution" | "question" | "link">("task");

    return (
      <div className="flex flex-col gap-2">
        <div className={styles.taskTypeButtons}>
          <button
            type="button"
            onClick={() => setTaskType("task")}
            className={`${styles.taskTypeButton} ${taskType === "task" ? styles.activeType : ""}`}
          >
            Task
          </button>

          <button
            type="button"
            onClick={() => setTaskType("solution")}
            className={`${styles.taskTypeButton} ${taskType === "solution" ? styles.activeType : ""}`}
          >
            Solution
          </button>

          <button
            type="button"
            onClick={() => setTaskType("question")}
            className={`${styles.taskTypeButton} ${taskType === "question" ? styles.activeType : ""}`}
          >
            Question
          </button>

          <button
            type="button"
            onClick={() => setTaskType("link")}
            className={`${styles.taskTypeButton} ${taskType === "link" ? styles.activeType : ""}`}
          >
            Link
          </button>
        </div>
        <input className="border p-2 flex-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Task..." />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (!value.trim()) return;
            onSubmit(value, taskType);
            setValue("");
          }}
        >
          Add
        </button>
      </div>
    );
  };

  return (
    <>
      <h3 className={styles.header}>Today's Activity</h3>

      <ul className={styles.log}>
        {sortedLogs.map((log) => (
          <li key={log._id} className={`${styles.taskItem} ${log.duration === 0 ? styles.active : ""}`}>
            <span className={styles.taskText}>
              At <strong>{formatTime(log.startDate)}</strong> started working on <strong>{log.project}</strong>
              {" ("}
              {log.activityType}
              {")"}
              {log.duration === 0 ? (
                <>
                  {" "}
                  • <span className={styles.duration}>Active</span>
                </>
              ) : (
                <>
                  {" "}
                  • Spent <span className={styles.duration}>{Math.round(log.duration / 60000)}</span> minutes
                </>
              )}
            </span>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <Tooltip label="Add quick task">
                <button
                  className={styles.roundButton}
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
                  className={styles.roundButton}
                  onClick={() => {
                    setSelectedLog(log);
                    setTaskManagerOpen(true);
                  }}
                >
                  <LuClipboardPenLine color="blue" width="30" />
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
        <div className={styles.addTaskBar}>
          <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="New task..." />

          <select value={newTaskType} onChange={(e) => setNewTaskType(e.target.value as "task" | "solution" | "question" | "link")}>
            <option value="task">Task</option>
            <option value="solution">Solution</option>
            <option value="question">Question</option>
            <option value="link">Link</option>
          </select>

          <button
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
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task._id} className={styles.taskRow}>
              <div className={styles.taskActions}>
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() =>
                    editTask(task._id, {
                      status: task.status === "completed" ? "open" : "completed",

                      ...(task.status !== "completed" && !task.doneTask ? { doneTask: task.todo } : {}),
                    })
                  }
                />

                {editingTaskId === task._id ? (
                  <textarea autoFocus className={styles.taskEditor} value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                ) : (
                  <div className={styles.taskContent}>{task.status === "completed" ? task.doneTask || task.todo : task.todo}</div>
                )}
              </div>
              <div className={styles.taskActions}>
                {editingTaskId === task._id ? (
                  <>
                    <button
                      onClick={async () => {
                        const trimmed = editValue.trim();

                        if (!trimmed) return;

                        await editTask(task._id, {
                          ...(task.status === "completed" ? { doneTask: trimmed } : { todo: trimmed }),
                        });

                        setEditingTaskId(null);
                      }}
                    >
                      <LuCheck color="green" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingTaskId(null);
                      }}
                    >
                      <LuX color="red" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.taskTypeIcons}>
                      {task.taskType === "task" && <LuClipboardList />}

                      {task.taskType === "solution" && <LuLightbulb />}

                      {task.taskType === "question" && <LuCircleHelp />}

                      {task.taskType === "link" && <LuLink />}
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
