import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import VenueInfo from "./VenueInfo";
import ScrollSelectTabs from "./ScrollSelectTabs";

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
  sectionBackgroundImage = "/assets/venues/herobanner/galaxy.jpg",
  tabs = [],
  activeTab,
  onTabChange,
}: CarouselCardsProps) {
  const defaultActiveIndex = 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  const cardWidth = useMemo(() => "min(78vw, 320px)", []);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomedImage(null);
      }
    };

    if (zoomedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomedImage]);

  if (items.length === 0) {
    return null;
  }
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section
      className="relative mx-auto w-full overflow-hidden !pb-8"
      style={{
        backgroundImage: `url(/assets/venues/herobanner/galaxy.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10">
        {tabs.length > 0 && activeTab && onTabChange && (
          <div className="!px-2 md:!px-6 lg:!px-10 !pt-4">
            <ScrollSelectTabs items={tabs} active={activeTab} onChange={onTabChange} />
          </div>
        )}
        <div
          {...handlers}
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory !py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    ? 1
                    : Math.abs(index - activeIndex) === 1
                      ? 0.92
                      : 0.86,
                opacity:
                  index === activeIndex
                    ? 1
                    : Math.abs(index - activeIndex) === 1
                      ? 0.78
                      : 0.62,
                y:
                  index === activeIndex
                    ? 0
                    : Math.abs(index - activeIndex) === 1
                      ? 10
                      : 18,
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
              <div className="h-80 rounded-t-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover cursor-zoom-in"
                  onClick={() => setZoomedImage({ src: item.image, alt: item.title })}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <VenueInfo
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

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[2147483646] flex items-center justify-center bg-black/85 backdrop-blur-sm !p-4"
          onClick={() => setZoomedImage(null)}
          role="presentation"
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/40 text-xl leading-none text-white hover:bg-black/60"
            aria-label="Close image preview"
          >
            ×
          </button>
          <img
            src={zoomedImage.src}
            alt={zoomedImage.alt}
            className="max-h-[90vh] w-auto max-w-[92vw] rounded-xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
