import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  label,
  children,
}: TooltipProps) {
  return (
    <div className="relative group">
      {children}

      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs bg-gray-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {label}
      </span>
    </div>
  );
}