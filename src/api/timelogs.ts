import api from "./axios";
import type { Timelog, NewTimelog, WeeklyEntry } from "../types";

export const getTimelogs = () => api.get<Timelog[]>("/timelogs");

export const getTimelog = (id: string) => api.get<Timelog>(`/timelogs/log/${id}`);

export const addTimelog = (data: NewTimelog) => api.post<Timelog>("/timelogs/add", data);

export const updateTimelog = (id: string, data: Partial<Timelog>) => api.patch<Timelog>(`/timelogs/${id}`, data);

export const deleteTimelog = (id: string) => api.delete(`/timelogs/${id}`);

export const getTodos = () => api.get<Timelog[]>("/timelogs/to-dos");

export const getWeeklyData = (offsetWeeks: number = 0, paidOnly: boolean = false) =>
  api.get<WeeklyEntry[]>(`/timelogs/weekly?offsetWeeks=${offsetWeeks}&paidOnly=${paidOnly}`);