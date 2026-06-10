import { useEffect, useState } from "react";
import { getProjects, addProject, type Project } from "@/api/projects";
import { useAuth } from "@/context/AuthContext";

export default function useProjects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    if (!user) return;

    try {
      const data = await getProjects();

      setProjects(
        data.filter(
          (p) =>
            p.statusActive &&
            p.username === user.username
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const createProject = async (
    projectData: {
      projectName: string;
      customer: string;
      description: string;
    }
  ) => {
    await addProject(projectData);

    await loadProjects();
  };

  return {
    projects,
    loading,
    refreshProjects: loadProjects,
    createProject,
  };
}