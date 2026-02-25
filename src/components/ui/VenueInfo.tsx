import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SlidingTitleReveal from "./SlidingTitleReveal";

interface VenueInfoProps {
  title: string;
  subtitle: string;
  description: string;
  dimensions: {
    area: string;
    height: string;
    width: string;
    length: string;
  };
  seatings: {
    theater: string;
    ushape: string;
    classroom: string;
    boardroom: string;
    cluster: string;
    cocktails: string;
    round: string;
  };
  capacity: string;
  backgroundImage: string;
  contentKey?: string;
}

const layoutItems = [
  { key: "theater", label: "Theater", icon: "/assets/layouts/theater.png" },
  { key: "ushape", label: "U-Shape", icon: "/assets/layouts/ushape.png" },
  { key: "classroom", label: "Classroom", icon: "/assets/layouts/classroom.png" },
  { key: "boardroom", label: "Boardroom", icon: "/assets/layouts/boardroom.png" },
  { key: "cluster", label: "Cluster", icon: "/assets/layouts/cluster.png" },
  { key: "cocktails", label: "Cocktails", icon: "/assets/layouts/cocktail.png" },
  { key: "round", label: "Round", icon: "/assets/layouts/round.png" },
] as const;

const venueBackgroundOverlayClass = "absolute";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  startOnView?: boolean;
}

function TypewriterText({
  text,
  className = "",
  speed = 16,
  startDelay = 0,
  startOnView = false,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [shouldStart, setShouldStart] = useState(!startOnView);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!startOnView) {
      setShouldStart(true);
      return;
    }

    setShouldStart(false);
    const node = textRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [text, startOnView]);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    setDisplayed("");
    let cursor = 0;
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        cursor += 1;
        setDisplayed(text.slice(0, cursor));
        if (cursor >= text.length && intervalId) {
          window.clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, startDelay, shouldStart]);

  return (
    <p ref={textRef} className={className}>
      {displayed}
    </p>
  );
}

export default function VenueInfo({
  title,
  subtitle,
  description,
  dimensions,
  seatings,
  capacity,
  backgroundImage,
  contentKey,
}: VenueInfoProps) {
  const animationKey = contentKey ?? `${title}-${subtitle}`;

  return (
    <div className="relative w-full">
      <div
        className={venueBackgroundOverlayClass}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute" />

      <div className="relative z-10 max-h-[56vh] overflow-y-auto overflow-x-hidden overscroll-y-auto !px-4 !pt-6 !pb-24 md:!px-7 md:!pt-8 md:!pb-28 lg:max-h-[72vh] lg:!pt-6 text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SlidingTitleReveal
              lines={[title]}
              className="[font-family:'Playfair_Display'] text-[50px] md:text-[56px] leading-[0.95] tracking-tight text-white !pb-4"
              lineClassName="!pb-2"
            />

            <span className="block !mt-3 h-[3px] w-16 rounded-full bg-[#CFAB57]" />

            <TypewriterText
              text={subtitle}
              className="!mt-2 text-sm md:text-base text-white/82"
              speed={18}
              startDelay={220}
              startOnView
            />

            <TypewriterText
              text={description}
              className="!mt-8 text-[17px] leading-8 text-white/90 max-w-[95%]"
              speed={15}
              startDelay={220}
            />

            <div className="!mt-8 flex items-center gap-6 text-sm md:text-base text-white/92">
              <div className="flex items-center gap-2">
                <span className="text-[#CFAB57] text-base">↗</span>
                <span>{dimensions.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#AA8F6A] text-base">
                  <img
                    src={"/assets/layouts/heads.png"}
                    alt={"seatings"}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span>{capacity}</span>
              </div>
            </div>

            <div className="!mt-6 grid grid-cols-3 gap-3 text-center text-white/90">
              <div className="rounded-lg bg-white/10 !py-2">
                <p className="text-xs text-white/65">Height</p>
                <p className="text-sm font-medium">{dimensions.height}</p>
              </div>
              <div className="rounded-lg bg-white/10 !py-2">
                <p className="text-xs text-white/65">Width</p>
                <p className="text-sm font-medium">{dimensions.width}</p>
              </div>
              <div className="rounded-lg bg-white/10 !py-2">
                <p className="text-xs text-white/65">Length</p>
                <p className="text-sm font-medium">{dimensions.length}</p>
              </div>
            </div>

            <h3 className="!mt-7 !mb-1 text-xl font-semibold">Seating Layout</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 bg-transparent sm:grid-cols-3 lg:grid-cols-4">
              {layoutItems.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col items-center rounded-lg bg-white/10 !p-3 text-center"
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-8 w-8 object-contain"
                  />

                  <p className="mt-2 text-[.8em] text-white/70">{item.label}</p>

                  <p className="text-[.8em] font-semibold text-white">
                    {seatings[item.key]}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-8 md:h-10" aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
