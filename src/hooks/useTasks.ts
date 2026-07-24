import { useState } from "react";
import { getTasksByTimelog, createTask, updateTask, deleteTask, getAllTasks } from "../api/tasks";
import type { CreateTaskData } from "../api/tasks";
import type { Task } from "../types";

export const useTasks = (timelogId?: string, global = false) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = async (pageToLoad = page) => {
    setLoading(true);

    try {
      if (global) {
        const response = await getAllTasks({
          page: pageToLoad,
          limit: 50,
        });

        setTasks(response.tasks);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } else if (timelogId) {
        const data = await getTasksByTimelog(timelogId);
        setTasks(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (data: CreateTaskData) => {
    const task = await createTask(data);

    setTasks((prev) => [task, ...prev]);

    return task;
  };

  const editTask = async (id: string, data: Partial<Task>) => {
    const updated = await updateTask(id, data);

    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));

    return updated;
  };

  const removeTask = async (id: string) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return {
    tasks,
    loading,
    reload: loadTasks,
    addTask,
    editTask,
    removeTask,
    page,
    totalPages,
    setPage,
  };
};