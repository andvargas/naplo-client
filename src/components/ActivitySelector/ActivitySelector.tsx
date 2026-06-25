import { FaPlusCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Tooltip from "@/components/Tooltip/Tooltip";

interface Props {
  projects: string[];
  customers: string[];

  activityType: string;
  project: string;
  customer: string;

  onActivityTypeChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onCustomerChange: (value: string) => void;

  onAddProject: () => void;
  onAddActivityType: (newType: string) => void;
}

export default function ActivitySelector({
  projects,
  customers,
  activityType,
  project,
  customer,
  onActivityTypeChange,
  onProjectChange,
  onCustomerChange,
  onAddProject,
  onAddActivityType,
}: Props) {
  const { user } = useAuth();

  const activityTypes = user?.activityTypes ?? [];
  const handleActivityTypeChange = (value: string) => {
    if (value === "ADD_NEW_TYPE") {
      const newType = prompt("Enter new activity type:");

      // Basic validation to ensure they didn't hit cancel or type empty spaces
      if (newType && newType.trim() !== "") {
        const cleanType = newType.trim();

        if (activityTypes.includes(cleanType)) {
          alert("This activity type already exists!");
          return;
        }

        onAddActivityType(cleanType);
      }
      // Reset the selector value back to empty so it doesn't stay stuck on "Add new type..."
      onActivityTypeChange("");
    } else {
      onActivityTypeChange(value);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      Add new activity:
      <select className="px-3 py-2 bg-gray-200 rounded border" value={activityType} onChange={(e) => handleActivityTypeChange(e.target.value)}>
        <option value="">Type</option>

        {activityTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
        <option value="ADD_NEW_TYPE" className="text-green-600 font-semibold">
          + Add new type...
        </option>
      </select>
      <select className="px-3 py-2 bg-gray-200 rounded border" value={project} onChange={(e) => onProjectChange(e.target.value)}>
        <option value="">Project</option>

        {projects.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select className="px-3 py-2 bg-gray-200 rounded border" value={customer} onChange={(e) => onCustomerChange(e.target.value)}>
        <option value="">Customer</option>

        {customers.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Tooltip label="Add new project">
        <button onClick={onAddProject}>
          <FaPlusCircle size={28} className="text-green-600 hover:scale-110 transition" />
        </button>
      </Tooltip>
    </div>
  );
}
