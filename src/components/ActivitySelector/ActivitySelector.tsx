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

      if (newType && newType.trim() !== "") {
        const cleanType = newType.trim();

        if (activityTypes.includes(cleanType)) {
          alert("This activity type already exists!");
          return;
        }

        onAddActivityType(cleanType);
      }
      onActivityTypeChange("");
    } else {
      onActivityTypeChange(value);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 space-y-2">
      <div className="text-sm font-medium text-gray-700">Select activity, and press Start:</div>

      <div className="flex items-center gap-2">
        <div className="grid grid-cols-3 gap-2 flex-1 min-w-0">
          <select
            className="min-w-0 px-2 py-2 bg-gray-200 rounded border text-sm"
            value={activityType}
            onChange={(e) => handleActivityTypeChange(e.target.value)}
          >
            <option value="">Type</option>
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value="ADD_NEW_TYPE" className="text-green-600 font-semibold">
              + Add new...
            </option>
          </select>

          <select className="min-w-0 px-2 py-2 bg-gray-200 rounded border text-sm" value={project} onChange={(e) => onProjectChange(e.target.value)}>
            <option value="">Project</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="min-w-0 px-2 py-2 bg-gray-200 rounded border text-sm"
            value={customer}
            onChange={(e) => onCustomerChange(e.target.value)}
          >
            <option value="">Customer</option>
            {customers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Tooltip label="Add new project">
          <button onClick={onAddProject} className="shrink-0">
            <FaPlusCircle size={24} className="text-green-600 hover:scale-110 transition" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}