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
}: Props) {

  const { user } = useAuth();

  const activityTypes = user?.activityTypes ?? [];

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      Add new activity:
      <select className="px-3 py-2 bg-gray-200 rounded border" value={activityType} onChange={(e) => onActivityTypeChange(e.target.value)}>
        <option value="">Type</option>

        {activityTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
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
