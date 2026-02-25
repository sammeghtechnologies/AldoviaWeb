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
    <div className="w-full !mt-0 !mb-3">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth
                   lg:w-full lg:mx-auto lg:overflow-visible
                   lg:justify-center lg:translate-x-30
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
                    ? "bg-[var(--color-secondary)] !text-[var(--color-primary)] shadow-md"
                    : "bg-[var(--color-secondary)]/18 !text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/28"
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
