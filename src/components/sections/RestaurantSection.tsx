import React from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

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

//const SECTION_BG_VIDEO = "/assets/video/swanflight.webm";

const RestaurantSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeMobileImageIndex, setActiveMobileImageIndex] = React.useState(2);

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
      if (targetIndex > prev) return Math.min(prev + 1, diningSections.length - 1);
      if (targetIndex < prev) return Math.max(prev - 1, 0);
      return prev;
    });
  });

  React.useEffect(() => {
    setActiveMobileImageIndex(2);
  }, [activeIndex]);

  const section = diningSections[activeIndex] ?? diningSections[0];
  if (!section) return null;

  const fullTitle = section.title;

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full bg-[#F4F1E8]">
      <div className="sticky top-0 min-h-screen w-full overflow-hidden px-3 sm:px-5 md:px-10 lg:px-16 py-6 sm:py-8 md:py-16 lg:py-20 flex items-center justify-center bg-[var(--color-primary)]">
        {/* <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={SECTION_BG_VIDEO} type="video/webm" />
        </video> */}
        <div className="absolute inset-0 bg-[#F4F1E8]/72 backdrop-blur-[1px]" />

        <div
          className="absolute right-[-5%] bottom-[-5%] w-[60vw] h-[90vh] bg-no-repeat bg-right-bottom bg-contain opacity-[0.15] pointer-events-none z-[1]"
          style={{ backgroundImage: "url('/assets/rooms/background/page2bg.png')" }}
        />

        <div className="max-w-[1180px] w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 relative z-10">
          <motion.div
            key={`${section.id}-gallery`}
            initial={{ opacity: 0, x: -90 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
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
            initial={{ opacity: 0, x: 90 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="md:order-2 flex flex-col relative w-full md:w-[44%] lg:w-[44%] justify-center items-start text-left mt-2 sm:mt-4 md:mt-0 !px-2 sm:!px-4 md:!px-6 lg:!px-8 !py-3 sm:!py-4 md:!py-6 text-[var(--color-secondary)]"
          >
            <div className="relative pointer-events-none z-20 whitespace-nowrap">
              <h2 className="whitespace-nowrap text-[2.6rem] sm:text-[3rem] md:text-[3.2rem] lg:text-[3.2rem] font-serif leading-[0.9] tracking-tight text-[var(--color-secondary)]/80">
                {fullTitle}
              </h2>
            
            </div>

            <p className="!mt-3 sm:!mt-4 text-base sm:text-lg md:text-[28px] font-serif text-[var(--color-secondary)]">
              {section.subtitle}
            </p>

            <p className="text-[13px] sm:text-sm md:text-[15px] text-[var(--color-secondary)]/90 max-w-[460px] md:max-w-[520px] lg:max-w-[560px] leading-[1.7] sm:leading-[1.8] mt-3 sm:mt-5 font-medium z-10 relative">
              {section.description}
            </p>

            <div className="flex flex-col gap-3 sm:gap-5 !py-4 sm:!py-7 text-[var(--color-secondary)] z-10 relative">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-primary)]">
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
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-primary)]">
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
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full !bg-[var(--color-secondary)]/10 !text-[var(--color-primary)]">
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
      </div>
    </section>
  );
};

export default RestaurantSection;
