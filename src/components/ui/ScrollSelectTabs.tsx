import { useRef } from "react";

interface ScrollSelectTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
  floatingOnScroll?: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
  disableDesktopShift?: boolean;
}

export default function ScrollSelectTabs({
  items,
  active,
  onChange,
  floatingOnScroll = false,
  activeClassName = "bg-[var(--color-secondary)]/95 !text-[var(--color-primary)] shadow-md",
  inactiveClassName = "bg-white/20 !text-[var(--color-secondary)] opacity-80 hover:opacity-95",
  disableDesktopShift = false,
}: ScrollSelectTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`w-full !mt-0 !mb-3 ${
        floatingOnScroll ? "sticky top-4 z-[140]" : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth
                   lg:w-full lg:mx-auto lg:overflow-visible
                   lg:justify-center
                   ${disableDesktopShift ? "" : "lg:translate-x-30"}
                   !px-4 !py-3 lg:!py-1.5
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden`}
      >
        {items.map((item) => {
          const isActive = active === item;

          return (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`!px-6 !py-2 lg:!py-1 !rounded-[10px] text-sm font-medium transition-all duration-300 flex-shrink-0 backdrop-blur-md
                ${
                  isActive
                    ? activeClassName
                    : inactiveClassName
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
