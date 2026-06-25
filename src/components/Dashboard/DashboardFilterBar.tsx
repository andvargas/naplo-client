import type { Project } from "@/api/projects";

interface Props {
  selectedMonth: string;
  selectedYear: number;
  selectedCustomer: string;
  selectedActivityType: string;
  weekFilter: "none" | "this" | "last";
  customers: string[];
  activityTypes: string[];
  onChangeMonth: (month: string) => void;
  onChangeYear: (year: number) => void;
  onChangeCustomer: (customer: string) => void;
  onChangeActivityType: (type: string) => void;
  onChangeWeekFilter: (filter: "none" | "this" | "last") => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DashboardFilterBar({
  selectedMonth,
  selectedYear,
  selectedCustomer,
  selectedActivityType,
  weekFilter,
  customers,
  activityTypes,
  onChangeMonth,
  onChangeYear,
  onChangeCustomer,
  onChangeActivityType,
  onChangeWeekFilter,
}: Props) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 space-y-3">
      <div className="flex gap-2 justify-center">
        {(["none", "this", "last"] as const).map((w) => (
          <button
            key={w}
            onClick={() => onChangeWeekFilter(w)}
            className={`px-3 py-1.5 text-sm rounded border ${
              weekFilter === w ? "bg-gray-800 text-white" : "hover:bg-gray-100"
            }`}
          >
            {w === "none" ? "Month/Year" : w === "this" ? "This Week" : "Last Week"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-center">
        <select
          className="border rounded p-2 text-sm"
          value={selectedMonth}
          onChange={(e) => onChangeMonth(e.target.value)}
          disabled={weekFilter !== "none"}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i.toString()}>{m}</option>
          ))}
        </select>

        <select
          className="border rounded p-2 text-sm"
          value={selectedYear}
          onChange={(e) => onChangeYear(Number(e.target.value))}
          disabled={weekFilter !== "none"}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="border rounded p-2 text-sm"
          value={selectedCustomer}
          onChange={(e) => onChangeCustomer(e.target.value)}
        >
          <option value="all">All Customers</option>
          {customers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded p-2 text-sm"
          value={selectedActivityType}
          onChange={(e) => onChangeActivityType(e.target.value)}
        >
          <option value="all">All Activity Types</option>
          {activityTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}