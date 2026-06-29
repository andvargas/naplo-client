import api from "./axios";

export const updateUserActivityTypes = (username: string, activityTypes: string[]) =>
  api.put("/users/update-activities", { username, activityTypes });
