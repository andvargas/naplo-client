import api from "./axios";
import type { User } from "@/types";

export const updateUserActivityTypes = (username: string, activityTypes: string[]) =>
  api.put("/users/update-activities", { username, activityTypes });

export const updateUserSettings = (username: string, settings: User["settings"]) => api.patch("/users/settings", { username, settings });
