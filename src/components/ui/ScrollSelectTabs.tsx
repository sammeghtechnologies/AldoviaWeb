import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollSelectTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
  floatingOnScroll?: boolean;
  floatingClassName?: string;
  innerWrapperClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  disableDesktopShift?: boolean;
  compactMobile?: boolean;
}

export default function ScrollSelectTabs({
  items,
  active,
  onChange,
  floatingOnScroll = false,
  floatingClassName = "sticky top-4 z-[140]",
  innerWrapperClassName = "!mx-auto !w-full !max-w-[1200px] lg:!w-[80%]",
  activeClassName = "!bg-[#FFE694] !text-[var(--color-primary)] shadow-md",
  inactiveClassName = "!bg-transparent !text-[var(--color-secondary)] opacity-80 hover:opacity-95",
  disableDesktopShift = false,
  compactMobile = false,
}: ScrollSelectTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const trackShiftClass = disableDesktopShift ? "lg:translate-x-0" : "lg:translate-x-0";

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    setIsOverflowing(scrollWidth > clientWidth + 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => updateScrollState();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items, updateScrollState]);

  useEffect(() => {
    const activeTab = tabRefs.current[active];
    if (!activeTab) return;

    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  const scrollTabs = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`w-full !mt-0 !mb-3 ${
        floatingOnScroll ? floatingClassName : ""
      }`}
    >
      <div className={innerWrapperClassName}>
        <div className="mx-auto flex w-full max-w-full items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollTabs("left")}
            disabled={!canScrollLeft}
            className={`z-10 grid shrink-0 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-35 ${
              compactMobile ? "h-7 w-7 md:h-8 md:w-8" : "h-8 w-8"
            }`}
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1 max-w-full rounded-xl !bg-[rgba(255,255,255,0.10)] border border-white/20 backdrop-blur-md">
            <div
              ref={containerRef}
              className={`flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth
                   lg:!w-full lg:!mx-auto ${isOverflowing ? "lg:!justify-start" : "lg:!justify-center"}
                   ${trackShiftClass}
                   ${compactMobile ? "!pl-5 !pr-3 !py-1.5 md:!pl-6 md:!pr-4 md:!py-3 lg:!pl-7 lg:!pr-5 lg:!py-1.5" : "!pl-6 !pr-4 !py-3 lg:!pl-7 lg:!pr-5 lg:!py-1.5"}
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden`}
            >
              {items.map((item, index) => {
                const isActive = active === item;

                return (
                  <button
                    key={item}
                    onClick={() => onChange(item)}
                    ref={(node) => {
                      tabRefs.current[item] = node;
                    }}
                    className={`!px-6 ${compactMobile ? "!py-1 md:!py-2 lg:!py-1" : "!py-2 lg:!py-1"} ${
                      isOverflowing && index === 0 ? "!ml-1 md:!ml-2" : ""
                    } !rounded-[10px] text-sm font-medium transition-all duration-300 flex-shrink-0
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

          <button
            type="button"
            onClick={() => scrollTabs("right")}
            disabled={!canScrollRight}
            className={`z-10 grid shrink-0 place-items-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-35 ${
              compactMobile ? "h-7 w-7 md:h-8 md:w-8" : "h-8 w-8"
            }`}
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
