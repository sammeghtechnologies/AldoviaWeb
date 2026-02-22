import React from "react";
import { ChevronRight, House } from "lucide-react";

interface HeroBreadcrumbProps {
  label: string;
  onHomeClick?: () => void;
  className?: string;
}

const HeroBreadcrumb: React.FC<HeroBreadcrumbProps> = ({
  label,
  onHomeClick,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-3 !px-6 !py-6 text-white/95 ${className}`}
    >
      <button
        type="button"
        onClick={onHomeClick}
        className="inline-flex items-center justify-center text-white/90 transition hover:text-white"
        aria-label="Go to home"
      >
        <House className="h-4 w-4" />
      </button>
      <ChevronRight className="h-4 w-4 text-white/70" />
      <span className="text-[15px] font-medium tracking-[0.02em]">{label}</span>
    </div>
  );
};

export default HeroBreadcrumb;
