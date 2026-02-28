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
  progressBarWidth?: number;
  buttonsClassName?: string;
}

const CarouselControls: React.FC<Props> = ({
  total,
  index,
  onNext,
  onPrev,
  progressTrackColor = "rgba(255, 255, 255, 0.20)",
  progressFillColor = "var(--color-primary)",
  buttonColor = "var(--color-primary)",
  iconColor = "var(--color-primary)",
  className = "",
  progressBarClassName = "w-[100px] max-w-[100px] shrink-0",
  progressBarWidth,
  buttonsClassName = "",
}) => {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className={`w-full max-w-6xl mx-auto !mt-10 flex items-center justify-between !px-[2%] ${className}`}>

      {/* Progress Bar */}
      <div
        className={`h-[1px] rounded-full overflow-hidden ${progressBarClassName}`}
        style={{
          backgroundColor: progressTrackColor,
          width: progressBarWidth ? `${progressBarWidth}px` : undefined,
          minWidth: progressBarWidth ? `${progressBarWidth}px` : undefined,
          maxWidth: progressBarWidth ? `${progressBarWidth}px` : undefined,
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: progressFillColor }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Arrows */}
      <div className={`flex items-center gap-4 ${buttonsClassName}`}>
        <button
          onClick={onPrev}
          className="!rounded-[999px] h-10 !border !border-[rgba(255,255,255,0.30)] !bg-[rgba(255,255,255,0.10)] !px-5 !py-2 text-sm font-normal !text-[var(--color-secondary)] backdrop-blur-md transition duration-300 hover:!bg-[rgba(255,255,255,0.18)] md:text-base"
          style={{ backgroundColor: buttonColor }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: iconColor }} />
        </button>

        <button
          onClick={onNext}
          className="!rounded-[999px] h-10 !border !border-[rgba(255,255,255,0.30)] !bg-[rgba(255,255,255,0.10)] !px-5 !py-2 text-sm font-normal !text-[var(--color-secondary)] backdrop-blur-md transition duration-300 hover:!bg-[rgba(255,255,255,0.18)] md:text-base"
          
        >
          <ArrowRight className="w-4 h-4" style={{ color: iconColor }} />
        </button>
      </div>
    </div>
  );
};

export default CarouselControls;
