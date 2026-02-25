import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import VenueInfo from "./VenueInfo";
import ScrollSelectTabs from "./ScrollSelectTabs";
import CarouselControls from "./CarouselControls";

interface CarouselCardsProps {
  items: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    dimensions?: {
      area: string;
      height: string;
      width: string;
      length: string;
    };
    seating?: {
      theater: string;
      ushape: string;
      classroom: string;
      boardroom: string;
      cluster: string;
      cocktails: string;
      round: string;
    };
    capacity?: string;
    image: string;
  }[];
  sectionBackgroundImage?: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}


export default function CarouselCards({
  items,
  sectionBackgroundImage = "/assets/herobackgrounds/herobanner/galaxy.jpg",
  tabs = [],
  activeTab,
  onTabChange,
}: CarouselCardsProps) {
  const defaultActiveIndex = 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false
  );

  const cardWidth = useMemo(() => "clamp(220px, 78vw, 540px)", []);
  const itemsSignature = useMemo(
    () => items.map((item) => item.id).join("|"),
    [items]
  );

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];

    if (!container || !card) {
      return;
    }

    const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, []);

  const setIndexAndScroll = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
      setActiveIndex(clampedIndex);
      scrollToIndex(clampedIndex);
    },
    [items.length, scrollToIndex]
  );

  const updateActiveFromScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || cardRefs.current.length === 0) {
      return;
    }

    const center = container.scrollLeft + container.clientWidth / 2;
    let nextActive = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nextActive = index;
      }
    });

    setActiveIndex(nextActive);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndexAndScroll(activeIndex + 1),
    onSwipedRight: () => setIndexAndScroll(activeIndex - 1),
    trackTouch: true,
    trackMouse: true,
    delta: 10,
  });
  const zoomHandlers = useSwipeable({
    onSwipedLeft: () =>
      setZoomedIndex((prev) => {
        if (prev === null || items.length === 0) return prev;
        return (prev + 1) % items.length;
      }),
    onSwipedRight: () =>
      setZoomedIndex((prev) => {
        if (prev === null || items.length === 0) return prev;
        return (prev - 1 + items.length) % items.length;
      }),
    trackMouse: true,
  });

  useEffect(() => {
    const initialIndex = Math.min(defaultActiveIndex, Math.max(0, items.length - 1));
    setActiveIndex(initialIndex);
    const id = window.requestAnimationFrame(() => {
      scrollToIndex(initialIndex);
    });
    return () => window.cancelAnimationFrame(id);
  }, [defaultActiveIndex, items.length, itemsSignature, scrollToIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const onScroll = () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = window.requestAnimationFrame(updateActiveFromScroll);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateActiveFromScroll]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomedIndex(null);
      }
      if (event.key === "ArrowRight") {
        setZoomedIndex((prev) => {
          if (prev === null || items.length === 0) return prev;
          return (prev + 1) % items.length;
        });
      }
      if (event.key === "ArrowLeft") {
        setZoomedIndex((prev) => {
          if (prev === null || items.length === 0) return prev;
          return (prev - 1 + items.length) % items.length;
        });
      }
    };

    if (zoomedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [items.length, zoomedIndex]);

  if (items.length === 0) {
    return null;
  }
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section
      className="relative mx-auto w-full overflow-hidden !pb-2"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14, 1, 1, 0.78), rgba(65, 52, 47, 0.78)), url('/assets/herobackgrounds/herobanner/corridor.jpg')",
        }}
      />
      <div className="relative z-10 !pt-8">
        <div className="z-[130] w-full">
          {tabs.length > 0 && activeTab && onTabChange && (
            <div className="!px-2 md:!px-6 lg:!px-10">
              <ScrollSelectTabs items={tabs} active={activeTab} onChange={onTabChange} />
            </div>
          )}
        </div>
        <div className="!pb-24">
          <div className="mx-auto w-full max-w-[1500px] !px-2 md:!px-6 lg:!px-10">
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,620px)_minmax(0,760px)] lg:justify-center lg:items-start lg:justify-items-center lg:gap-10 lg:translate-x-32">
              <motion.div
                className="z-[120] w-full lg:max-w-[620px] lg:translate-y-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <div
                  {...handlers}
                  ref={containerRef}
                  className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory !py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{
                    paddingInline: `calc((100% - ${cardWidth}) / 2)`,
                    perspective: "1200px",
                  }}
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      ref={(node) => {
                        cardRefs.current[index] = node;
                      }}
                      animate={{
                        scale:
                          index === activeIndex
                            ? 1.08
                            : Math.abs(index - activeIndex) === 1
                              ? isDesktop
                                ? 1.0
                                : 0.92
                              : isDesktop
                                ? 0.97
                                : 0.86,
                        opacity:
                          index === activeIndex
                            ? 1
                            : Math.abs(index - activeIndex) === 1
                              ? isDesktop
                                ? 0.98
                                : 0.78
                              : isDesktop
                                ? 0.93
                                : 0.62,
                        rotateY:
                          index === activeIndex
                            ? 0
                            : index < activeIndex
                              ? 8
                              : -8,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 26,
                        mass: 0.7,
                      }}
                      className="snap-center flex-shrink-0 rounded-2xl bg-white shadow-xl cursor-grab select-none overflow-hidden"
                      style={{
                        width: cardWidth,
                        transformStyle: "preserve-3d",
                        zIndex: items.length - Math.abs(index - activeIndex),
                      }}
                    >
                      <div className="h-70 rounded-t-2xl overflow-hidden lg:h-[60vh]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover cursor-zoom-in"
                          onClick={() => setZoomedIndex(index)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {items.length > 1 && (
                  <CarouselControls
                    total={items.length}
                    index={activeIndex}
                    onNext={() => setIndexAndScroll(activeIndex + 1)}
                    onPrev={() => setIndexAndScroll(activeIndex - 1)}
                    progressTrackColor="rgba(255, 255, 255, 0.22)"
                    progressFillColor="#FFFFFF"
                    buttonColor="rgba(255,255,255,0.92)"
                    iconColor="#21140F"
                    className="!flex !mt-4 !max-w-none !px-0 !justify-center !gap-6"
                    progressBarClassName="w-[180px] max-w-[180px] shrink-0"
                  />
                )}
              </motion.div>

              <div className="!mt-1 w-full lg:!mt-0 lg:max-w-[760px]">
                <VenueInfo
                  contentKey={activeTab ?? activeItem.id}
                  title={activeItem.title}
                  subtitle={activeItem.subtitle ?? "Opulent Celebrations & Galas"}
                  description={
                    activeItem.description ??
                    "Spacious and versatile venue is ideal for large-scale events, from glamorous weddings to corporate galas."
                  }
                  dimensions={
                    activeItem.dimensions ?? {
                      area: "1,29,065 sq.ft",
                      height: "21 ft",
                      width: "311 ft",
                      length: "415 ft",
                    }
                  }
                  seatings={
                    activeItem.seating ?? {
                      theater: "3000",
                      ushape: "450",
                      classroom: "1800",
                      boardroom: "250",
                      cluster: "1200",
                      cocktails: "3500",
                      round: "2000",
                    }
                  }
                  capacity={activeItem.capacity ?? "3000 seater"}
                  backgroundImage={sectionBackgroundImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {zoomedIndex !== null && (
        <div
          {...zoomHandlers}
          className="fixed inset-0 z-[2147483646] flex items-center justify-center overflow-x-hidden bg-black/85 backdrop-blur-sm !p-4"
          onClick={() => setZoomedIndex(null)}
          role="presentation"
        >
          <button
            type="button"
            onClick={() => setZoomedIndex(null)}
            className="absolute bottom-6 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/40 bg-black/50 text-xl leading-none text-white hover:bg-black/70"
            aria-label="Close image preview"
          >
            ×
          </button>
          <div className="flex h-full w-full items-center justify-center overflow-x-hidden">
            <img
              src={items[zoomedIndex]?.image}
              alt={items[zoomedIndex]?.title ?? "Venue image"}
              className="mx-auto block max-h-[84vh] w-[min(92vw,1100px)] rounded-xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
