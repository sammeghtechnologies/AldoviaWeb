import React from "react";
import { ArrowRight, Download } from "lucide-react";

interface SplitActionButtonsProps {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  visibilityClassName?: string;
}

const SplitActionButtons: React.FC<SplitActionButtonsProps> = ({
  primaryLabel = "Check Availability",
  secondaryLabel = "Plan Your Event",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
  visibilityClassName = "lg:!hidden",
}) => {
  const hasSecondaryButton = Boolean(secondaryLabel);
  return (
    <div
    className={`!flex !flex-row !items-center !justify-between !gap-3 !w-full md:!w-[492px] ${visibilityClassName}
    !bg-[rgba(73, 72, 72, 0.55)] 
    backdrop-blur-[300px]
    !shadow-[0_-4px_20px_0_rgba(0,0,0,0.08)] 
    ${className}`}
    style={{
      height: "79px",
      padding: "0 15.985px",
    }}
  >
      <button
        type="button"
        onClick={onPrimaryClick}
        className="!flex-1 !px-4 md:!px-7 !py-2.5 !rounded-[999px] !bg-[#523127] !text-[#F8F3E9] !border !border-[#523127] !shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] !text-[13px] md:!text-[16px] !font-medium !leading-[20px] !text-center"
      >
        <span className="inline-flex items-center gap-2">
          <span>{primaryLabel}</span>
          {primaryLabel === "Request Proposal" && <ArrowRight className="h-4 w-4" />}
        </span>
      </button>

      {hasSecondaryButton && (
        <button
          type="button"
          onClick={onSecondaryClick}
          className="!flex-1 !px-4 md:!px-7 !py-2.5 !rounded-full !bg-transparent !text-[#FFFFFF] !border !border-[#FFFFFF] !text-[13px] md:!text-[16px] !font-medium !leading-[20px] !text-center"
        >
          <span className="inline-flex items-center gap-2">
            {secondaryLabel === "Download Brochure" && <Download className="h-4 w-4" />}
            <span>{secondaryLabel}</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default SplitActionButtons;
