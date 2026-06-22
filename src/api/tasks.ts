import api from "./axios";
import type { Task } from "../types";

export interface CreateTaskData {
  todo: string;
  project: string;
  linkedTimelogId?: string;
  taskType?: Task["taskType"];
  due?: string;
  important?: boolean;
}

export const getTasksByTimelog = async (
  timelogId: string
): Promise<Task[]> => {
  const response = await api.get(
    `/tasks/timelog/${timelogId}`
  );

  return response.data;
};

export const createTask = async (
  data: CreateTaskData
): Promise<Task> => {
  const response = await api.post(
    "/tasks/add",
    data
  );

  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  const response = await api.put(
    `/tasks/${id}`,
    data
  );

  return response.data;
};

export const deleteTask = async (
  id: string
): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};