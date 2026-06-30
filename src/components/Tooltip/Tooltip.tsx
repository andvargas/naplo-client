import { useState } from "react";
import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children}

      {isHovered && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-gray-700 text-white rounded whitespace-nowrap pointer-events-none z-50 shadow-md">
          {label}
        </span>
      )}
    </div>
  );
}
