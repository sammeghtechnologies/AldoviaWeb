import React from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import CarouselControls from "../ui/CarouselControls";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const categories = ["Dining", "Hall", "Rooms", "Activities"];

const experiences = [
  {
    id: 1,
    category: "Dining",
    title: "Ambrosia",
    tag: "Dining Experience",
    subtitle: "Crafted cuisine",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200",
  },
  {
    id: 2,
    category: "Dining",
    title: "Illusion Bar",
    tag: "Dining Experience",
    subtitle: "Luxury bar",
    image:
      "https://images.unsplash.com/photo-1523906630133-f6934a1ab3c8?q=80&w=1200",
  },
  {
    id: 3,
    category: "Hall",
    title: "Grand Ballroom",
    tag: "Hall Experience",
    subtitle: "Elegant event space",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f29c8cc27f?q=80&w=1200",
  },
  {
    id: 4,
    category: "Rooms",
    title: "Premium Suite",
    tag: "Room Experience",
    subtitle: "Comfort with a view",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200",
  },
  {
    id: 5,
    category: "Activities",
    title: "Poolside Retreat",
    tag: "Activity Experience",
    subtitle: "Relax and unwind",
    image:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=1200",
  },
];

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 72, y: 18, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: [0.2, 0.95, 0.22, 1] as const },
  },
};

const categorySwitchVariants = {
  hidden: { opacity: 0, x: 140, scale: 0.88, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: [0.18, 0.94, 0.2, 1] as const },
  },
};

const ExperienceSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);
  const [index, setIndex] = React.useState(0);
  const cardsRowRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "start 15%"],
  });
  const { scrollYProgress: sectionEndProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const dropYRaw = useTransform(scrollYProgress, [0, 1], [-320, 0]);
  const dropOpacityRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dropScaleYRaw = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const cardsXRaw = useTransform(scrollYProgress, [0, 0.62, 1], [210, 0, 0]);
  const cardsScaleRaw = useTransform(scrollYProgress, [0, 0.62, 1], [0.74, 0.74, 1]);
  const dropY = useSpring(dropYRaw, { stiffness: 70, damping: 26, mass: 0.7 });
  const dropOpacity = useSpring(dropOpacityRaw, { stiffness: 60, damping: 24, mass: 0.8 });
  const dropScaleY = useSpring(dropScaleYRaw, { stiffness: 70, damping: 26, mass: 0.7 });
  const cardsX = useSpring(cardsXRaw, { stiffness: 72, damping: 24, mass: 0.75 });
  const cardsScale = useSpring(cardsScaleRaw, { stiffness: 72, damping: 24, mass: 0.75 });
  const bottomCurve = useTransform(sectionEndProgress, [0, 0.75, 1], [44, 44, 0]);
  const filteredExperiences = React.useMemo(
    () => experiences.filter((item) => item.category === activeCategory),
    [activeCategory]
  );
  const subtitleText = "Explore our spaces, celebrations,\nand curated moments.";
  const subtitleChars = React.useMemo(() => subtitleText.split(""), [subtitleText]);
  const subtitleVisibleTotal = React.useMemo(
    () => subtitleChars.filter((char) => char !== "\n").length,
    [subtitleChars]
  );
  const [typedCount, setTypedCount] = React.useState(0);
  const [typingStarted, setTypingStarted] = React.useState(false);
  const typingTriggeredRef = React.useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest <= 0.06) {
      typingTriggeredRef.current = false;
      setTypingStarted(false);
      setTypedCount(0);
      return;
    }

    if (!typingTriggeredRef.current && latest >= 0.2) {
      typingTriggeredRef.current = true;
      setTypingStarted(true);
    }
  });

  React.useEffect(() => {
    if (!typingStarted) return;
    if (typedCount >= subtitleVisibleTotal) return;

    const timer = window.setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= subtitleVisibleTotal) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [typingStarted, typedCount, subtitleVisibleTotal]);

  const scrollToCard = React.useCallback((targetIndex: number, behavior: ScrollBehavior = "smooth") => {
    const total = filteredExperiences.length;
    if (!total) return;

    const normalizedIndex = (targetIndex + total) % total;
    setIndex(normalizedIndex);
    const row = cardsRowRef.current;
    const card = cardRefs.current[normalizedIndex];
    if (row && card) {
      const targetLeft = card.offsetLeft - (row.clientWidth - card.clientWidth) / 2;
      row.scrollTo({
        left: Math.max(0, targetLeft),
        behavior,
      });
      return;
    }
    card?.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "center",
    });
  }, [filteredExperiences.length]);

  React.useEffect(() => {
    setIndex(0);
    cardRefs.current = [];
    const raf = window.requestAnimationFrame(() => {
      scrollToCard(0, "smooth");
    });
    return () => window.cancelAnimationFrame(raf);
  }, [activeCategory, scrollToCard]);

  const onNext = React.useCallback(() => {
    scrollToCard(index + 1);
  }, [index, scrollToCard]);

  const onPrev = React.useCallback(() => {
    scrollToCard(index - 1);
  }, [index, scrollToCard]);

  const onCardsScroll = React.useCallback(() => {
    const row = cardsRowRef.current;
    if (!row) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, cardIndex) => {
      if (!card) return;
      const rowCenter = row.scrollLeft + row.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - rowCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = cardIndex;
      }
    });

    setIndex((prev) => (prev === closestIndex ? prev : closestIndex));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#21140F] !py-20 !px-5 md:!px-10 lg:!px-30"
    >
      <motion.div
        aria-hidden="true"
        style={{
          y: dropY,
          opacity: dropOpacity,
          scaleY: dropScaleY,
          transformOrigin: "top center",
          borderBottomLeftRadius: bottomCurve,
          borderBottomRightRadius: bottomCurve,
        }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[94%] bg-[#21140F]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(234,223,217,0.08)_0%,rgba(33,20,15,0.0)_55%)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Heading */}
        <div className="!mb-10">
       
       

          <div className="!mb-6 md:!mb-3 text-left lg:text-center lg:!w-full lg:!max-w-[980px] lg:!mx-auto">
          <div className="lg:hidden">
            <SlidingTitleReveal
              eyebrowClassName="!mb-1 text-[11px] tracking-[0.35em] uppercase text-[#78716C]"
              lines={["Experience Alvodia", "Visually"]}
              className="text-white text-[34px] md:text-[42px] leading-[1.1] font-medium [font-family:'Playfair_Display']"
              />
          </div>
          <div className="w-full hidden lg:flex justify-center">
            <SlidingTitleReveal
              eyebrowClassName="!mb-1 text-[11px] tracking-[0.35em] uppercase text-[#78716C]"
              lines={["Experience Alvodia Visually"]}
              className="text-white text-[34px] md:text-[42px] leading-[1.1] font-medium [font-family:'Playfair_Display'] text-center"
              />
          </div>
        </div>

        <div className="lg:hidden">
        <p
            className="text-[#C7B8AE] !mt-4 text-[15px] max-w-md"
            aria-label={subtitleText.replace("\n", " ")}
          >
            {(() => {
              let shown = 0;
              return subtitleChars.map((char, idx) => {
                if (char === "\n") return <br key={`subtitle-br-${idx}`} />;
                shown += 1;
                const isVisible = shown <= typedCount;
                return (
                  <span
                    key={`subtitle-char-${idx}`}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 120ms ease-out",
                    }}
                  >
                    {char}
                  </span>
                );
              });
            })()}
          </p>
        </div>

        <div className="w-full hidden lg:flex justify-center">
        <p
            className="text-[var(--color-secondary)] !mt-4 text-[15px] max-w-md text-center"
            aria-label={subtitleText.replace("\n", " ")}
          >
            {(() => {
              let shown = 0;
              return subtitleChars.map((char, idx) => {
                if (char === "\n") return " ";
                shown += 1;
                const isVisible = shown <= typedCount;
                return (
                  <span
                    key={`subtitle-char-${idx}`}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 120ms ease-out",
                    }}
                  >
                    {char}
                  </span>
                );
              });
            })()}
          </p>
        </div>
        
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto !pb-6 scrollbar-hide">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActiveCategory(item)}
              className={`whitespace-nowrap !px-2 !py-2 rounded-full text-sm transition duration-300 ${activeCategory === item
                  ? "bg-[var(--color-secondary)] text-[#21140F]"
                  : "bg-[#3A241D] text-[#EADFD9] hover:bg-[#4A2E25]"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Cards */}
        <motion.div
          key={`category-switch-${activeCategory}`}
          variants={categorySwitchVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            ref={cardsRowRef}
            onScroll={onCardsScroll}
            style={{ scale: cardsScale, x: cardsX, transformOrigin: "center top" }}
            variants={cardsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth !pb-4 !pr-12 md:!pr-2 [scroll-padding-inline:12vw] md:[scroll-padding-inline:6rem]"
          >

            {filteredExperiences.map((item, cardIndex) => (
              <motion.div
                key={item.id}
                ref={(node) => {
                  cardRefs.current[cardIndex] = node;
                }}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                className={`relative rounded-2xl overflow-hidden group shrink-0 snap-center w-[70vw] sm:w-[340px] md:w-[400px] transition-all duration-500 ${cardIndex === index
                    ? "md:scale-100 md:opacity-100"
                    : "md:scale-[0.94] md:opacity-60"
                  }`}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[420px] object-cover
                           transition duration-700
                           group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_28%,rgba(255,255,255,0)_42%)] opacity-70 transition duration-700 group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6 !text-[var(--color-secondary)]">

                  <span className="text-[11px] tracking-widest uppercase
                                 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>

                  <h3 className="mt-4 text-[22px] font-medium [font-family:'Playfair_Display']">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#E0D6D0] mt-1">
                    {item.subtitle}
                  </p>

                </div>
              </motion.div>
            ))}

          </motion.div>
        </motion.div>

        <CarouselControls
          total={filteredExperiences.length}
          index={index}
          onNext={onNext}
          onPrev={onPrev}
          progressTrackColor="rgba(255, 255, 255, 0.22)"
          progressFillColor="var(--color-secondary)"
          buttonColor="var(--color-secondary)"
          iconColor="var(--color-primary)"
          progressBarClassName="!w-[100px] !max-w-[100px] shrink-0"
          progressBarWidth={100}
        />

      </div>
    </section>
  );
};

export default ExperienceSection;
