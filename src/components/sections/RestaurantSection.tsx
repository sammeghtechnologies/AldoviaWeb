import React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

type DiningSection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cuisine: string;
  timings: string;
  capacity: string;
  gallery: string[];
};

const diningSections: DiningSection[] = [
  {
    id: "ambrosia",
    title: "Ambrosia",
    subtitle: "A Culinary Journey",
    description:
      "Experience fine dining at its best with our signature multi-cuisine restaurant. From authentic Indian delicacies to international favorites, every dish is crafted to perfection.",
    cuisine: "Multi-Cuisine",
    timings: "7:00 AM - 11:00 PM",
    capacity: "120 guests",
    gallery: [
      "/assets/herobackgrounds/dining/ambrosia.jpg",
      "/assets/herobackgrounds/dining/Buvette.jpg",
      "/assets/herobackgrounds/dining/Buvette1.jpg",
    ],
  },
  {
    id: "illusion-bar",
    title: "Illusion Bar",
    subtitle: "Crafted Evenings",
    description:
      "Unwind in an intimate lounge setting with handcrafted cocktails, premium spirits, and an atmosphere curated for elevated nightlife.",
    cuisine: "Premium Bar Menu",
    timings: "5:00 PM - 1:00 AM",
    capacity: "80 guests",
    gallery: [
      "/assets/herobackgrounds/dining/illusion.jpg",
      "/assets/herobackgrounds/dining/Buvette.jpg",
      "/assets/herobackgrounds/dining/Buvette1.jpg",
    ],
  },
  {
    id: "buvette-coffee-shop",
    title: "Buvette Coffee Shop",
    subtitle: "Cafe Moments",
    description:
      "A cozy coffee destination for slow mornings and quick breaks, serving fresh brews, light bites, and cafe classics all day.",
    cuisine: "Cafe & Bakery",
    timings: "8:00 AM - 10:00 PM",
    capacity: "60 guests",
    gallery: [
      "/assets/herobackgrounds/dining/Buvette1.jpg",
      "/assets/herobackgrounds/dining/Buvette.jpg",
      "/assets/herobackgrounds/dining/ambrosia.jpg",
    ],
  },
];

const AMBROSIA_BG_VIDEO = "/assets/video/ambrosiya.mp4";

const RestaurantSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeMobileImageIndex, setActiveMobileImageIndex] = React.useState(2);
  const [transitionDirection, setTransitionDirection] = React.useState<1 | -1>(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const targetIndex = Math.min(
      diningSections.length - 1,
      Math.floor(latest * diningSections.length)
    );
    setActiveIndex((prev) => {
      if (targetIndex > prev) {
        setTransitionDirection(1);
        return Math.min(prev + 1, diningSections.length - 1);
      }
      if (targetIndex < prev) {
        setTransitionDirection(-1);
        return Math.max(prev - 1, 0);
      }
      return prev;
    });
  });

  React.useEffect(() => {
    setActiveMobileImageIndex(2);
  }, [activeIndex]);

  const scrollToSectionIndex = React.useCallback((index: number) => {
    const node = sectionRef.current;
    if (!node) return;

    const maxIndex = diningSections.length - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    const sectionTop = node.getBoundingClientRect().top + window.scrollY;
    const totalScrollable = Math.max(1, node.offsetHeight - window.innerHeight);
    const progress = maxIndex > 0 ? clampedIndex / maxIndex : 0;
    const targetY = sectionTop + totalScrollable * progress;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const section = diningSections[activeIndex] ?? diningSections[0];
  if (!section) return null;

  const fullTitle = section.title;

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full bg-black">
      <div className="sticky top-0 min-h-screen w-full overflow-hidden bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={`full-scene-${section.id}`}
            initial={{
              opacity: 0.15,
              rotateY: transitionDirection > 0 ? -16 : 16,
              rotateX: transitionDirection > 0 ? 3 : -3,
              scale: 0.965,
            }}
            animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1 }}
            exit={{
              opacity: 0.15,
              rotateY: transitionDirection > 0 ? 12 : -12,
              rotateX: transitionDirection > 0 ? -2 : 2,
              scale: 0.98,
            }}
            transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformPerspective: 1800,
              transformOrigin: transitionDirection > 0 ? "left center" : "right center",
            }}
            className="absolute inset-0 px-3 sm:px-5 md:px-10 lg:px-16 py-6 sm:py-8 md:py-16 lg:py-20 flex items-center justify-center"
          >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={AMBROSIA_BG_VIDEO} type="video/mp4" />
          </video>
        
          <div
            className="absolute inset-0 backdrop-blur-[1px] bg-black/55"
          />

          <div
            className="absolute right-[-5%] bottom-[-5%] w-[60vw] h-[90vh] bg-no-repeat bg-right-bottom bg-contain opacity-[0.15] pointer-events-none z-[1]"
            style={{ backgroundImage: "url('/assets/rooms/background/page2bg.png')" }}
          />

          <div className="max-w-[1180px] w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 relative z-10 [perspective:1400px]">
          <motion.div
            key={`${section.id}-gallery`}
            initial={{
              opacity: 0,
              x: transitionDirection > 0 ? -120 : 120,
              rotateY: transitionDirection > 0 ? -18 : 18,
              scale: 0.94,
              borderRadius: "48px",
            }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1, borderRadius: "32px" }}
            transition={{ duration: 1.45, ease: [0.22, 0.85, 0.2, 1] }}
            style={{ transformPerspective: 1400, transformOrigin: transitionDirection > 0 ? "left center" : "right center" }}
            className="!pl-1 !pr-1 md:order-1 group flex h-[260px] sm:h-[340px] md:h-[550px] w-full md:w-[56%] gap-2 sm:gap-3 md:gap-4 shrink-0 relative mx-auto md:mx-0"
          >
            {section.gallery.slice(0, 3).map((imgSrc, index) => (
              <div
                key={`${section.id}-${index}`}
                onClick={() => setActiveMobileImageIndex(index)}
                className={`
                  relative h-full overflow-hidden rounded-[2rem] shadow-lg cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                  ${activeMobileImageIndex === index ? "w-[72%]" : "w-[14%]"}
                  ${activeMobileImageIndex === index ? "md:w-[68%]" : "md:w-[16%]"}
                  md:group-hover:w-[15%]
                  md:hover:!w-[75%]
                `}
              >
                <img
                  src={imgSrc || "/fallback.jpg"}
                  alt={`${section.title} view ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </motion.div>

          <motion.div
            key={`${section.id}-text`}
            initial={{
              opacity: 0,
              x: transitionDirection > 0 ? 100 : -100,
              rotateY: transitionDirection > 0 ? 14 : -14,
              scale: 0.96,
              borderRadius: "30px",
            }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1, borderRadius: "18px" }}
            transition={{ duration: 1.4, ease: [0.22, 0.85, 0.2, 1], delay: 0.12 }}
            style={{ transformPerspective: 1400, transformOrigin: transitionDirection > 0 ? "right center" : "left center" }}
            className="md:order-2 flex flex-col relative w-full md:w-[44%] lg:w-[44%] justify-center items-start text-left mt-2 sm:mt-4 md:mt-0 !px-2 sm:!px-4 md:!px-6 lg:!px-8 !py-3 sm:!py-4 md:!py-6 text-[var(--color-secondary)]"
          >
            <div className="relative pointer-events-none z-20 whitespace-nowrap">
              <SlidingTitleReveal
                lines={[fullTitle]}
                className="whitespace-nowrap text-[2.6rem] sm:text-[3rem] md:text-[3.2rem] lg:text-[3.2rem] font-serif leading-[0.9] tracking-tight text-[var(--color-secondary)]/80"
                lineClassName="text-[var(--color-secondary)]/80"
              />
            
            </div>

            <p className="!mt-3 sm:!mt-4 text-base sm:text-lg md:text-[28px] font-serif text-[var(--color-secondary)]">
              {section.subtitle}
            </p>

            <p className="text-[13px] sm:text-sm md:text-[15px] text-[var(--color-secondary)]/90 max-w-[460px] md:max-w-[520px] lg:max-w-[560px] leading-[1.7] sm:leading-[1.8] mt-3 sm:mt-5 font-medium z-10 relative">
              {section.description}
            </p>

            <div className="flex flex-col gap-3 sm:gap-5 !py-4 sm:!py-7 text-[var(--color-secondary)] z-10 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-secondary)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" strokeWidth={1.7} />
                  </svg>
                </span>
                <div>
                  <p className="text-xs sm:text-sm text-[var(--color-secondary)]/75">Cuisine</p>
                  <p className="text-[18px] sm:text-[24px] font-semibold text-[var(--color-secondary)]">{section.cuisine}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-secondary)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" strokeWidth={1.7} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 8v4l2.8 1.6" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs sm:text-sm text-[var(--color-secondary)]/75">Timings</p>
                  <p className="text-[18px] sm:text-[24px] font-semibold text-[var(--color-secondary)]">{section.timings}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-secondary)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                    <circle cx="10" cy="8" r="3" strokeWidth={1.7} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M23 20v-2a4 4 0 00-3-3.87" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 3.13a3 3 0 010 5.82" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs sm:text-sm !text-[var(--color-secondary)]/75">Capacity</p>
                  <p className="text-[18px] sm:text-[24px] font-semibold !text-[var(--color-secondary)]">{section.capacity}</p>
                </div>
              </div>
            </div>
          </motion.div>
          </div>

          <div className="absolute right-3 sm:right-5 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => scrollToSectionIndex(activeIndex - 1)}
              aria-label="Previous restaurant section"
              className="h-10 w-10 rounded-full border border-white/45 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/45 disabled:opacity-40"
              disabled={activeIndex === 0}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => scrollToSectionIndex(activeIndex + 1)}
              aria-label="Next restaurant section"
              className="h-10 w-10 rounded-full border border-white/45 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/45 disabled:opacity-40"
              disabled={activeIndex === diningSections.length - 1}
            >
              ↓
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </section>
  );
};

export default RestaurantSection;
