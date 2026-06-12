interface Props {
  totalMs: number;
  lastSessionMs: number;
  tasks: string[];
  lunchBreakMs: number;
  grossMs: number;
}

export default function TodaySummary({ totalMs, lastSessionMs, tasks, lunchBreakMs, grossMs }: Props) {
  const formatMs = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-center mt-4 p-3">
      Today you've spent net <strong>{formatMs(totalMs)}</strong> on {tasks.join(", ")}. Last session: <strong>{formatMs(lastSessionMs)}</strong>
      <div>Gross working time: {formatMs(grossMs)} excluding lunch break</div>
      <div>Lunch breaks: {Math.abs(Math.round(lunchBreakMs / 60000))} mins</div>
    </div>
  );
}