import { useState } from "react";
import {
  getTasksByTimelog,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks";
import type { CreateTaskData } from "../api/tasks";
import type { Task } from "../types";

export const useTasks = (
  timelogId?: string
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] =
    useState(false);

  const loadTasks = async () => {
    if (!timelogId) return;

    setLoading(true);

    try {
      const data =
        await getTasksByTimelog(
          timelogId
        );

      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (
    data: CreateTaskData
  ) => {
    const task =
      await createTask(data);

    setTasks((prev) => [
      task,
      ...prev,
    ]);

    return task;
  };

  const editTask = async (
    id: string,
    data: Partial<Task>
  ) => {
    const updated =
      await updateTask(id, data);

    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? updated : t
      )
    );

    return updated;
  };

  const removeTask = async (
    id: string
  ) => {
    await deleteTask(id);

    setTasks((prev) =>
      prev.filter(
        (t) => t._id !== id
      )
    );
  };

  return {
    tasks,
    loading,
    reload: loadTasks,
    addTask,
    editTask,
    removeTask,
  };
};