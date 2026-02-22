import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  hidden: { opacity: 0, y: 46, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
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
    offset: ["start 85%", "start 25%"],
  });
  const dropY = useTransform(scrollYProgress, [0, 1], [-260, 0]);
  const dropOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dropScaleY = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const filteredExperiences = React.useMemo(
    () => experiences.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  React.useEffect(() => {
    setIndex(0);
    cardRefs.current = [];
    if (cardsRowRef.current) {
      cardsRowRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [activeCategory]);

  const scrollToCard = React.useCallback((targetIndex: number) => {
    const total = filteredExperiences.length;
    if (!total) return;

    const normalizedIndex = (targetIndex + total) % total;
    setIndex(normalizedIndex);
    cardRefs.current[normalizedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [filteredExperiences.length]);

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
      const distance = Math.abs(card.offsetLeft - row.scrollLeft);
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
      className="relative w-full overflow-hidden bg-[#21140F] !py-20 !px-5 md:!px-10 lg:!px-16"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: dropY, opacity: dropOpacity, scaleY: dropScaleY, transformOrigin: "top center" }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[94%] rounded-b-[44px] bg-[#2A1913]"
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Heading */}
        <div className="!mb-10">
          <SlidingTitleReveal
            lines={["Experience Alvodia", "Visually"]}
            className="text-white text-[34px] md:text-[42px] leading-[1.1] font-medium [font-family:'Playfair_Display']"
          />

          <p className="text-[#C7B8AE] mt-4 text-[15px] max-w-md">
            Explore our spaces, celebrations,
            <br /> and curated moments.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto !pb-6 scrollbar-hide">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActiveCategory(item)}
              className={`whitespace-nowrap !px-2 !py-2 rounded-full text-sm transition duration-300 ${
                activeCategory === item
                  ? "bg-[#EADFD9] text-[#21140F]"
                  : "bg-[#3A241D] text-[#EADFD9] hover:bg-[#4A2E25]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Cards */}
        <motion.div
          key={activeCategory}
          ref={cardsRowRef}
          onScroll={onCardsScroll}
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory !pb-2 !pr-12 md:!pr-2"
        >

          {filteredExperiences.map((item, cardIndex) => (
            <motion.div
              key={item.id}
              ref={(node) => {
                cardRefs.current[cardIndex] = node;
              }}
              variants={cardVariants}
              className="relative rounded-2xl overflow-hidden group shrink-0 snap-start w-[70vw] sm:w-[340px] md:w-[400px]"
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

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">

                <span className="text-[11px] tracking-widest uppercase
                                 bg-black/50 px-3 py-1 rounded-full">
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

        <CarouselControls
          total={filteredExperiences.length}
          index={index}
          onNext={onNext}
          onPrev={onPrev}
          progressTrackColor="rgba(255, 255, 255, 0.25)"
          progressFillColor="#FFFFFF"
          buttonColor="#FFFFFF"
          iconColor="#21140F"
        />

      </div>
    </section>
  );
};

export default ExperienceSection;
