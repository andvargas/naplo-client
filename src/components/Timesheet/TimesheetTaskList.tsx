import type { Task } from "@/types";

interface Props {
  tasks: Task[];
}

export default function TimesheetTaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <span className="text-gray-400 text-sm">No tasks logged</span>;
  }

  return (
    <ul className="text-left m-0 pl-4">
      {tasks.map((task) => (
        <li key={task._id} className="text-sm list-disc leading-tight">
          {task.status === "completed" ? (
            task.doneTask || task.todo
          ) : (
            <span>Started on: {task.todo}</span>
          )}
        </li>
      ))}
    </ul>
  );
}