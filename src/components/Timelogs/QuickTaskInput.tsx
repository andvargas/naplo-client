
import { useState } from "react";
import styles from "./TodayLog.module.css";

export default function QuickTaskInput({
  onSubmit,
}: {
  onSubmit: (text: string, type: "task" | "solution" | "question" | "link") => void;
}) {
  const [value, setValue] = useState("");
  const [taskType, setTaskType] = useState<"task" | "solution" | "question" | "link">("task");

  return (
    <div className="flex flex-col gap-2">
      <div className={styles.taskTypeButtons}>
        <button type="button" onClick={() => setTaskType("task")} className={`${styles.taskTypeButton} ${taskType === "task" ? styles.activeType : ""}`}>
          Task
        </button>
        <button type="button" onClick={() => setTaskType("solution")} className={`${styles.taskTypeButton} ${taskType === "solution" ? styles.activeType : ""}`}>
          Solution
        </button>
        <button type="button" onClick={() => setTaskType("question")} className={`${styles.taskTypeButton} ${taskType === "question" ? styles.activeType : ""}`}>
          Question
        </button>
        <button type="button" onClick={() => setTaskType("link")} className={`${styles.taskTypeButton} ${taskType === "link" ? styles.activeType : ""}`}>
          Link
        </button>
      </div>
      <input className="border p-2 flex-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Task..." autoFocus/>
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
}