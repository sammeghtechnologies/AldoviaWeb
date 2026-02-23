import { useRef } from "react";

interface ScrollSelectTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function ScrollSelectTabs({
  items,
  active,
  onChange,
}: ScrollSelectTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full !mt-1 !mb-6">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth
                   !px-4 !py-3 
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = active === item;

          return (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`!px-6 !py-2 !rounded-[10px] text-sm font-medium transition-all duration-300 flex-shrink-0
                ${
                  isActive
                    ? "bg-[#f5f5dc] text-black shadow-md"
                    : "bg-[#2c2c2c] text-white hover:bg-white/10"
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}