import { useState } from "react";
import type { Timelog } from "@/types";

interface Props {
  sessions: Timelog[];
  taskCountByLog: Record<string, number>;
  onDurationUpdate: (id: string, durationMs: number) => Promise<void>;
}

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.round((ms % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Parses "H:MM" or "HH:MM" into milliseconds. Returns null if invalid.
const parseDuration = (value: string): number | null => {
  const match = value.trim().match(/^(\d{1,3}):([0-5]?\d)$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return (hours * 60 + minutes) * 60000;
};

function EditableDuration({
  sessionId,
  duration,
  onSave,
}: {
  sessionId: string;
  duration: number;
  onSave: (id: string, durationMs: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(formatDuration(duration));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setValue(formatDuration(duration));
    setError(null);
    setIsEditing(true);
  };

  const cancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const save = async () => {
    const ms = parseDuration(value);
    if (ms === null) {
      setError("Use HH:MM");
      return;
    }

    setSaving(true);
    try {
      await onSave(sessionId, ms);
      setIsEditing(false);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-end gap-1">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          disabled={saving}
          className="font-mono text-lg w-20 text-right border rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="HH:MM"
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={startEditing}
      title="Click to correct duration"
      className="font-mono text-lg hover:bg-blue-50 hover:text-blue-700 rounded px-2 py-1 transition-colors"
    >
      {formatDuration(duration)}
    </button>
  );
}

export default function SessionsList({ sessions, taskCountByLog, onDurationUpdate }: Props) {
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
                <span className="font-medium">
                  {s.activityType} | {s.project}
                </span>{" "}
                · {s.customer}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                {taskCount} task{taskCount !== 1 ? "s" : ""} logged
              </div>
            </div>

            <EditableDuration sessionId={s._id} duration={s.duration} onSave={onDurationUpdate} />
          </div>
        );
      })}
    </div>
  );
}
