import api from "./axios";
import type { Task } from "../types";

export interface CreateTaskData {
  todo: string;
  project: string;
  linkedTimelogId?: string;
  taskType?: Task["taskType"];
  status?: Task["status"];
  due?: string;
  important?: boolean;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  project?: string;
  status?: string;
  taskType?: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getTasksByTimelog = async (timelogId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/timelog/${timelogId}`);

  return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post("/tasks/add", data);

  return response.data;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);

  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const getAllTasks = async (params: GetTasksParams): Promise<PaginatedTasks> => {
  const response = await api.get("/tasks", {
    params,
  });

  return response.data;
};

export const getTasksByProject = async (project: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/project/${project}`);
  return response.data;
};
