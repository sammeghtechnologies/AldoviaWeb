import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CarouselControls from "../ui/CarouselControls";
import LuxuryCard from "../ui/LuxuryCard";

const cards = [
  {
    image: "/assets/herobackgrounds/home/stay.webp",
    category: "Stay & Leisure",
    title: "Escape",
    description: "Rejuvenate in nature’s lap with premium luxury."
  },
  {
    image: "/assets/herobackgrounds/home/wedding.webp",
    category: "Wedding & Social Events",
    title: "Celebrate",
    description: "Grand lawns and ballrooms for your timeless moments."
  },
  {
    image: "/assets/herobackgrounds/home/corporate.webp",
    category: "Corporate & Conventions",
    title: "Gather",
    description: "World-class venues for impactful gatherings."
  }
];

const CarouselSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Desktop row motion: right -> center -> left as user scrolls through this section.
  const desktopRowX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.62, 1],
    [220, 0, 0, -260]
  );
  const desktopRowOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.9, 1],
    [0, 1, 1, 0.82]
  );

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? cards.length - 1 : prev - 1
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full min-h-[84vh] md:min-h-screen items-center justify-center overflow-hidden bg-center bg-cover bg-no-repeat py-14 md:py-20 [&_p]:!text-sm"
      style={{
        backgroundColor: "#21140F",
        backgroundImage:
          "linear-gradient(rgba(33, 20, 15, 0.78), rgba(33, 20, 15, 0.78)), url('/assets/backgrounds/swanbg.png')",
      }}
    >

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-6"
      >

        <div className="relative !mt-20 flex h-[460px] w-full items-center justify-center md:hidden">
          {cards.map((card, i) => {
            const position = (i - index + cards.length) % cards.length;
            const offset = 140;

            let x = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (position === 0) {
              x = 0;
              scale = 1;
              zIndex = 30;
            } else if (position === 1) {
              x = offset;
              scale = 0.85;
              opacity = 0.6;
              zIndex = 20;
            } else if (position === cards.length - 1) {
              x = -offset;
              scale = 0.85;
              opacity = 0.6;
              zIndex = 20;
            } else {
              opacity = 0;
            }

            return (
              <motion.div
                key={i}
                className="absolute w-[85%] max-w-sm cursor-grab"
                style={{ zIndex }}
                initial={{ x: 0, scale: 0.7, opacity: 0 }}
                whileInView={{ x, scale, opacity }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.15 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -100) next();
                  if (info.offset.x > 100) prev();
                }}
              >
                <LuxuryCard
                  image={card.image}
                  category={card.category}
                  title={card.title}
                  description={card.description}
                />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          style={{ x: desktopRowX, opacity: desktopRowOpacity }}
          className="hidden !mt-8 w-full grid-cols-3 gap-10 md:grid"
        >
          {cards.map((card, i) => (
            <motion.div key={`desktop-${i}`}>
              <LuxuryCard
                image={card.image}
                category={card.category}
                title={card.title}
                description={card.description}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="w-full md:hidden">
          <CarouselControls
            total={cards.length}
            index={index}
            onNext={next}
            onPrev={prev}
            progressTrackColor="rgba(255, 255, 255, 0.25)"
            progressFillColor="#FFFFFF"
            buttonColor="#FFFFFF"
            iconColor="var(--color-secondary)"
            className="!mt-24"
            progressBarClassName="!w-[100px] !max-w-[100px] shrink-0"
            progressBarWidth={100}
          />
        </div>

      </motion.div>
    </section>
  );
};

export default CarouselSection;
