import type { Timelog } from "@/types";

interface Props {
  sessions: Timelog[];
  taskCountByLog: Record<string, number>;
}

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.round((ms % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export default function SessionsList({ sessions, taskCountByLog }: Props) {
  if (sessions.length === 0) {
    return <div className="text-gray-500 text-center py-8">No sessions found for this filter.</div>;
  }

  return (
    <div className="space-y-2">
      {sessions.map((s) => {
        const taskCount = taskCountByLog[s._id] ?? 0;

        return (
          <div key={s._id} className="border rounded-lg p-3 bg-white flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">
                {new Date(s.startDate).toLocaleDateString()} ·{" "}
                <span className="font-medium">{s.activityType} | {s.project}</span> · {s.customer}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                {taskCount} task{taskCount !== 1 ? "s" : ""} logged
              </div>
            </div>
            <div className="font-mono text-lg">{formatDuration(s.duration)}</div>
          </div>
        );
      })}
    </div>
  );
}