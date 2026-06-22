import api from "./axios";

export interface Project {
  _id: string;
  projectName: string;
  customer: string;
  statusActive: boolean;
  description: string;
  username: string;
}

export interface AddProjectPayload {
  username?: string;
  projectName: string;
  customer: string;
  description: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get("/projects");
  return res.data;
};

export const addProject = async (payload: AddProjectPayload): Promise<Project> => {
  const response = await api.post("/projects/add", payload);
  return response.data;
};
