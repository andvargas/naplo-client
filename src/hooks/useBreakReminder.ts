import { useEffect, useRef } from "react";
import { showBreakNotification } from "@/services/notificationService";

export function useBreakReminder(
  startDate: string | null,
  pauseTimer: () => void
) {
  const reminderShown = useRef(false);

  useEffect(() => {
    if (!startDate) {
      reminderShown.current = false;
      return;
    }

    const checkTime = () => {
      const elapsed =
        (Date.now() - new Date(startDate).getTime()) / 60000;

      if (elapsed >= 50 && !reminderShown.current) {
        reminderShown.current = true;

        showBreakNotification(pauseTimer);
      }
    };


    const interval = setInterval(checkTime, 30000);

    checkTime();

    return () => clearInterval(interval);

  }, [startDate, pauseTimer]);
}