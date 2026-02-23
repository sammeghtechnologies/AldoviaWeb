import React from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RoomsCard from "../pages/home/RoomsCard";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";
import { roomsData } from "../../app/mockData/roomsData";

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const deckSpring = {
  type: "spring" as const,
  stiffness: 112,
  damping: 26,
  mass: 0.96,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const RoomsSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.35 });
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [introCycle, setIntroCycle] = React.useState(0);
  const [isIntroAnimating, setIsIntroAnimating] = React.useState(false);

  React.useEffect(() => {
    if (!isInView) {
      return;
    }
    setActiveIndex(0);
    setDirection(1);
    setIsIntroAnimating(true);
    setIntroCycle((prev) => prev + 1);
    const introTimer = window.setTimeout(() => setIsIntroAnimating(false), 780);
    return () => {
      window.clearTimeout(introTimer);
    };
  }, [isInView]);

  const next = React.useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % roomsData.length);
  }, []);

  const prev = React.useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length);
  }, []);

  const mobilePrevIndex = (activeIndex - 1 + roomsData.length) % roomsData.length;
  const mobileNextIndex = (activeIndex + 1) % roomsData.length;
  const desktopCardWidth = 380;
  const desktopActiveGap = 16;
  const desktopActiveCount = 3;
  const desktopStep = desktopCardWidth + desktopActiveGap;
  const desktopEdgeCenterOffset = ((desktopActiveCount - 1) * desktopStep) / 2;
  const desktopActiveIndices = React.useMemo(
    () => Array.from({ length: desktopActiveCount }, (_, idx) => (activeIndex + idx) % roomsData.length),
    [activeIndex, desktopActiveCount]
  );
  const desktopLeftInactiveIndex = (activeIndex - 1 + roomsData.length) % roomsData.length;
  const desktopRightInactiveIndex = (activeIndex + desktopActiveCount) % roomsData.length;

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-x-clip bg-[#FBF6E6] bg-cover bg-center bg-no-repeat !pt-12 !pb-24 !px-4 md:!px-6 lg:!px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(251, 246, 230, 0.78), rgba(251, 246, 230, 0.78)), url('/assets/backgrounds/swanbrown.png')",
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="!mb-6 md:!mb-3 text-left lg:text-center lg:!w-full lg:!max-w-[980px] lg:!mx-auto">
          <div className="lg:hidden">
            <SlidingTitleReveal
              eyebrowClassName="!mb-1 text-[11px] tracking-[0.35em] uppercase text-[#78716C]"
              lines={["Rooms &", "Suites"]}
              className="text-[44px] md:text-[52px] font-lust leading-[0.95] tracking-[0.4px] text-[#1C1917]"
            />
          </div>
          <div className=" w-full hidden lg:block justify-center lg:translate-x-[7.5rem]">
            <SlidingTitleReveal
              eyebrowClassName="!mb-1 text-[11px] tracking-[0.35em] uppercase text-[#78716C]"
              lines={["Rooms & Suites"]}
              className="text-[52px] font-lust leading-[0.95] tracking-[0.4px] text-[#1C1917]"
            />
          </div>
        </div>

        <div className="!mt-2 flex w-full justify-center lg:translate-x-[7.5rem]">
          <div className="relative w-full max-w-[560px] h-[530px] lg:mx-auto lg:max-w-[980px] lg:h-[580px]">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[10%] top-16 hidden h-[76%] rounded-[44px] bg-[radial-gradient(ellipse_at_center,rgba(90,51,38,0.20)_0%,rgba(90,51,38,0.08)_45%,rgba(90,51,38,0)_78%)] blur-2xl lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: premiumEase }}
            />

            <button
              onClick={prev}
              className="absolute left-2 top-1/2 z-[620] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1C1917]/20 bg-white/85 text-[#1C1917] shadow-sm transition hover:bg-white md:left-4 lg:flex lg:-left-24"
              aria-label="Previous room card"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              onClick={next}
              className="absolute right-2 top-1/2 z-[620] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1C1917]/20 bg-white/85 text-[#1C1917] shadow-sm transition hover:bg-white md:right-4 lg:flex lg:-right-24"
              aria-label="Next room card"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <motion.div
              key={`mobile-prev-${roomsData[mobilePrevIndex].id}-${introCycle}`}
              className="absolute left-[-28%] top-[92px] w-[84%] lg:hidden"
              initial={{ x: isIntroAnimating ? -220 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 0.9, rotate: -8, scale: 0.96 }}
              transition={{
                duration: isIntroAnimating ? 0.62 : 0.42,
                delay: isIntroAnimating ? 0.1 : 0,
                ease: premiumEase,
              }}
              style={{ zIndex: 220, filter: "blur(1.5px)" }}
            >
              <div className="flex w-full justify-center">
                <RoomsCard {...roomsData[mobilePrevIndex]} />
              </div>
            </motion.div>

            <motion.div
              key={`mobile-next-${roomsData[mobileNextIndex].id}-${introCycle}`}
              className="absolute right-[-28%] top-[92px] w-[84%] lg:hidden"
              initial={{ x: isIntroAnimating ? 220 : 40, opacity: 0 }}
              animate={{ x: 0, opacity: 0.9, rotate: 8, scale: 0.96 }}
              transition={{
                duration: isIntroAnimating ? 0.62 : 0.42,
                delay: isIntroAnimating ? 0.18 : 0,
                ease: premiumEase,
              }}
              style={{ zIndex: 220, filter: "blur(1.5px)" }}
            >
              <div className="flex w-full justify-center">
                <RoomsCard {...roomsData[mobileNextIndex]} />
              </div>
            </motion.div>

            <motion.div
              key={`desktop-left-inactive-${roomsData[desktopLeftInactiveIndex].id}-${introCycle}`}
              className="absolute left-1/2 top-10 hidden -translate-x-1/2 !w-[380px] !min-w-[380px] lg:block"
              initial={{
                x: -desktopEdgeCenterOffset - 92 + (direction > 0 ? -110 : 110),
                opacity: 0.28,
                scale: 0.8,
              }}
              animate={{
                x: -desktopEdgeCenterOffset - 92,
                y: 0,
                opacity: 0.5,
                scale: 0.84,
              }}
              transition={{
                ...deckSpring,
                duration: isIntroAnimating ? 0.66 : 0.58,
                delay: isIntroAnimating ? 0.08 : 0.02,
                ease: premiumEase,
              }}
              style={{ zIndex: 360, filter: "blur(2.8px)" }}
            >
              <motion.div
                className="flex w-full justify-center [transform:rotateY(14deg)] origin-right"
                whileHover={{ scale: 1.05, y: -6 }}
                transition={{ duration: 0.28, ease: premiumEase }}
              >
                <RoomsCard {...roomsData[desktopLeftInactiveIndex]} />
              </motion.div>
            </motion.div>

            <motion.div
              key={`desktop-right-inactive-${roomsData[desktopRightInactiveIndex].id}-${introCycle}`}
              className="absolute left-1/2 top-10 hidden -translate-x-1/2 !w-[380px] !min-w-[380px] lg:block"
              initial={{
                x: desktopEdgeCenterOffset + 92 + (direction > 0 ? -110 : 110),
                opacity: 0.28,
                scale: 0.8,
              }}
              animate={{
                x: desktopEdgeCenterOffset + 92,
                y: 0,
                opacity: 0.5,
                scale: 0.84,
              }}
              transition={{
                ...deckSpring,
                duration: isIntroAnimating ? 0.66 : 0.58,
                delay: isIntroAnimating ? 0.12 : 0.04,
                ease: premiumEase,
              }}
              style={{ zIndex: 360, filter: "blur(2.8px)" }}
            >
              <motion.div
                className="flex w-full justify-center [transform:rotateY(-14deg)] origin-left"
                whileHover={{ scale: 1.05, y: -6 }}
                transition={{ duration: 0.28, ease: premiumEase }}
              >
                <RoomsCard {...roomsData[desktopRightInactiveIndex]} />
              </motion.div>
            </motion.div>

            <motion.div
              key={`mobile-active-${roomsData[activeIndex].id}-${introCycle}`}
              className="absolute left-1/2 top-6 w-[92%] -translate-x-1/2 lg:hidden"
              initial={{
                x: isIntroAnimating ? (activeIndex % 2 === 0 ? -260 : 260) : direction > 0 ? 130 : -130,
                opacity: 1,
                scale: 0.96,
              }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: isIntroAnimating ? 0.66 : 0.46,
                delay: isIntroAnimating ? 0.26 : 0,
                ease: premiumEase,
              }}
              style={{ zIndex: 500 }}
              drag={isIntroAnimating ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next();
                if (info.offset.x > 80) prev();
              }}
            >
              <div className="flex w-full justify-center">
                <RoomsCard {...roomsData[activeIndex]} />
              </div>
            </motion.div>

            <div className="absolute left-0 right-0 top-6 hidden z-[520] [perspective:1200px] !justify-center !gap-4 !px-2 lg:flex">
              {desktopActiveIndices.map((roomIndex, idx) => (
                <motion.div
                  key={`desktop-active-${idx}-${roomsData[roomIndex].id}-${activeIndex}-${introCycle}`}
                  className="!px-2 shrink-0 !w-[380px] !min-w-[380px]"
                  initial={{
                    x: direction > 0 ? 160 : -160,
                    y: 12,
                    opacity: 1,
                    scale: 0.92,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotateY:
                      idx === 0
                        ? 7
                        : idx === desktopActiveCount - 1
                          ? -7
                          : 0,
                  }}
                  transition={{
                    ...deckSpring,
                    duration: isIntroAnimating ? 0.74 : 0.62,
                    delay: isIntroAnimating ? 0.18 + idx * 0.06 : idx * 0.04,
                    ease: premiumEase,
                  }}
                >
                  <motion.div
                    className="flex w-full justify-center"
                    whileHover={{ y: -8, scale: 1.06 }}
                    transition={{ duration: 0.28, ease: premiumEase }}
                  >
                    <RoomsCard {...roomsData[roomIndex]} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RoomsSection;
