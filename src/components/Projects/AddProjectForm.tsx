import { useState } from "react";

interface Props {
  onSubmit: (data: {
    projectName: string;
    customer: string;
    description: string;
  }) => Promise<void> | void;
}

export default function AddProjectForm({ onSubmit }: Props) {
  const [projectName, setProjectName] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onSubmit({
      projectName,
      customer,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border rounded p-2"
        placeholder="Project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Customer"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Project
      </button>
    </form>
  );
}