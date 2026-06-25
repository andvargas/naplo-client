import { useState } from "react";
import useProjects from "@/hooks/useProjects";
import Modal from "@/components/Modal/Modal";
import AddProjectForm from "@/components/Projects/AddProjectForm";
import { updateProject, deleteProject, type Project } from "@/api/projects";

const Projects: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { projects, loading, refreshProjects, createProject } = useProjects(false);

  const toggleStatus = async (project: Project) => {
    try {
      setUpdatingId(project._id);
      await updateProject(project._id, { statusActive: !project.statusActive });
      await refreshProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to update project");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      await refreshProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  };

  const handleAddProject = async (data: { projectName: string; customer: string; description: string }) => {
    try {
      await createProject(data);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = async (data: { projectName: string; customer: string; description: string }) => {
    if (!editingProject) return;

    try {
      await updateProject(editingProject._id, data);
      await refreshProjects();
      setEditingProject(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update project");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>

        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add Project
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project._id} className="flex items-center justify-between border rounded-lg p-2 bg-white">
            <div className="flex items-center gap-4">
              <button
                disabled={updatingId === project._id}
                onClick={() => toggleStatus(project)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${project.statusActive ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition ${project.statusActive ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>

              <div>
                <div className="font-medium text-left">
                  {project.projectName} | {project.customer}
                </div>
                <div className="text-sm text-gray-500">{project.description}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                Edit
              </button>
              <button onClick={() => handleDelete(project._id)} className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAddModal} title="Add Project" onClose={() => setShowAddModal(false)}>
        <AddProjectForm onSubmit={handleAddProject} />
      </Modal>

      <Modal isOpen={!!editingProject} title="Edit Project" onClose={() => setEditingProject(null)}>
        {editingProject && (
          <AddProjectForm
            initialValues={{
              projectName: editingProject.projectName,
              customer: editingProject.customer,
              description: editingProject.description,
            }}
            submitLabel="Save changes"
            onSubmit={handleUpdateProject}
          />
        )}
      </Modal>
    </div>
  );
};

export default Projects;
