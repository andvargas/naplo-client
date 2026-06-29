import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getWeeklyData } from "@/api/timelogs";
import type { WeeklyEntry } from "@/types";

export default function Week() {
  const [data, setData] = useState<WeeklyEntry[]>([]);
  const [offset, setOffset] = useState(0);
  const [paidOnly, setPaidOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getWeeklyData(offset, paidOnly)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to fetch weekly data. Please try again."))
      .finally(() => setLoading(false));
  }, [offset, paidOnly]);

  const totalHours = +(data.reduce((sum, entry) => sum + entry.totalDuration, 0) / 3600000).toFixed(2);

  const chartData = data.map((entry) => ({
    day: new Date(entry._id).toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
    hours: +(entry.totalDuration / 3600000).toFixed(2),
  }));

  const displayOffset = -offset;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">
          Weekly Time Worked {offset === 0 ? "(this week)" : `(${displayOffset > 0 ? `+${displayOffset}` : displayOffset} weeks)`}
        </h2>

        <button
          onClick={() => setPaidOnly((p) => !p)}
          className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
            paidOnly ? "bg-emerald-500 text-white border-emerald-500" : "text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {paidOnly ? "Paid only ✓" : "All sessions"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="flex justify-center gap-3 my-4">
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-blue-500 rounded transition-colors"
        >
          ← Previous Week
        </button>
        <button
          onClick={() => setOffset((o) => o - 1)}
          disabled={offset === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
        >
          Next Week →
        </button>
      </div>

      <div className="text-center text-2xl font-bold text-teal-600 mb-4">
        Total Hours Worked: <span className="text-blue-500">{totalHours} hrs</span>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : chartData.length === 0 ? (
        <p className="text-center text-gray-400">No sessions logged this week.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} hrs`, "Hours"]} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="rgba(75, 192, 192, 1)"
              fill="rgba(75, 192, 192, 0.2)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}