import React from "react";

interface SplitActionButtonsProps {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

const SplitActionButtons: React.FC<SplitActionButtonsProps> = ({
  primaryLabel = "Check Availability",
  secondaryLabel = "Plan Your Event",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}) => {
  return (
    <div
    className={`!flex !flex-row !items-center !justify-between !gap-3 !w-full md:!w-[492px] lg:!hidden 
    !border-t-[1.156px] !border-t-[rgba(229,231,235,0.50)] 
    !bg-[rgba(251,246,230,0.6)] 
    backdrop-blur-xl 
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
        {primaryLabel}
      </button>

      <button
        type="button"
        onClick={onSecondaryClick}
        className="!flex-1 !px-4 md:!px-7 !py-2.5 !rounded-full !bg-transparent !text-[#4A2C21] !border !border-[#6C4A3A] !text-[13px] md:!text-[16px] !font-medium !leading-[20px] !text-center"
      >
        {secondaryLabel}
      </button>
    </div>
  );
};

export default SplitActionButtons;
