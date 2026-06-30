import api from "./axios";
import type { AuthResponse } from "../types";

export const register = (username: string, email: string, password: string) =>
  api.post<AuthResponse>("/auth/register", { username, email, password });

export const login = (email: string, password: string) => api.post<AuthResponse>("/auth/login", { email, password });

export const changePassword = (currentPassword: string, newPassword: string) => api.post("/auth/change-password", { currentPassword, newPassword });