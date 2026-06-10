import type { Timelog } from "@/types";
import styles from "./TodayLog.module.css";

interface Props {
  logs: Timelog[];
}

export default function TodayLog({ logs }: Props) {
  const sortedLogs = [...logs].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  );

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <h3 className={styles.header}>
        Today's Activity
      </h3>

      <ul className={styles.log}>
        {sortedLogs.map((log) => (
          <li
            key={log._id}
            className={`${styles.taskItem} ${
              log.duration === 0 ? styles.active : ""
            }`}
          >
            At <strong>{formatTime(log.startDate)}</strong>
            {" "}started working on{" "}
            <strong>{log.project}</strong>

            {" ("}
            {log.activityType}
            {")"}

            {log.duration === 0 ? (
              <>
                {" "}• <span className={styles.duration}>Active</span>
              </>
            ) : (
              <>
                {" "}• Spent{" "}
                <span className={styles.duration}>
                  {Math.round(log.duration / 60000)}
                </span>{" "}
                minutes
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}