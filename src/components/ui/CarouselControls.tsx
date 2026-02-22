import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  total: number;
  index: number;
  onNext: () => void;
  onPrev: () => void;
  progressTrackColor?: string;
  progressFillColor?: string;
  buttonColor?: string;
  iconColor?: string;
  className?: string;
  progressBarClassName?: string;
}

const CarouselControls: React.FC<Props> = ({
  total,
  index,
  onNext,
  onPrev,
  progressTrackColor = "rgba(255, 255, 255, 0.20)",
  progressFillColor = "var(--color-primary)",
  buttonColor = "var(--color-primary)",
  iconColor = "#FFFFFF",
  className = "",
  progressBarClassName = "max-w-xs",
}) => {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className={`w-full max-w-6xl mx-auto !mt-10 flex items-center justify-between px-6 ${className}`}>

      {/* Progress Bar */}
      <div
        className={`flex-1 h-[4px] rounded-full overflow-hidden ${progressBarClassName}`}
        style={{ backgroundColor: progressTrackColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: progressFillColor }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Arrows */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
          style={{ backgroundColor: buttonColor }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: iconColor }} />
        </button>

        <button
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
          style={{ backgroundColor: buttonColor }}
        >
          <ArrowRight className="w-4 h-4" style={{ color: iconColor }} />
        </button>
      </div>
    </div>
  );
};

export default CarouselControls;
