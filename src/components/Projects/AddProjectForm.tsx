import { useState } from "react";

interface ProjectFormData {
  projectName: string;
  customer: string;
  description: string;
}

interface Props {
  onSubmit: (data: ProjectFormData) => Promise<void> | void;
  initialValues?: Partial<ProjectFormData>;
  submitLabel?: string;
}

export default function AddProjectForm({ onSubmit, initialValues, submitLabel = "Save Project" }: Props) {
  const [projectName, setProjectName] = useState(initialValues?.projectName ?? "");
  const [customer, setCustomer] = useState(initialValues?.customer ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onSubmit({
      projectName,
      customer,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="w-full border rounded p-2" placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />

      <input className="w-full border rounded p-2" placeholder="Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {submitLabel}
      </button>
    </form>
  );
}