import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, light = false }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <path
          d="M16 2L4 9V23L16 30L28 23V9L16 2Z"
          stroke={light ? "#FFFFFF" : "#111827"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 2V16M16 16L28 9M16 16L4 9"
          stroke={light ? "#FFFFFF" : "#111827"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 30V16"
          stroke={light ? "#D4AF37" : "#D4AF37"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn("font-bold text-xl tracking-tight", light ? "text-white" : "text-gray-900")}>
        3dprint
      </span>
    </div>
  );
};
