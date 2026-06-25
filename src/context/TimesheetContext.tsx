import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Timelog } from "../types";

interface TimesheetContextType {
  timesheetData: Timelog[];
  setTimesheetData: (data: Timelog[]) => void;
}

const TimesheetContext = createContext<TimesheetContextType | null>(null);

export const TimesheetProvider = ({ children }: { children: ReactNode }) => {
  const [timesheetData, setTimesheetData] = useState<Timelog[]>([]);

  return (
    <TimesheetContext.Provider value={{ timesheetData, setTimesheetData }}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => {
  const context = useContext(TimesheetContext);
  if (!context) throw new Error("useTimesheet must be used within a TimesheetProvider");
  return context;
};