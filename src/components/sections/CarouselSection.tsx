import React, { useState } from "react";
import { motion } from "framer-motion";
import CarouselControls from "../ui/CarouselControls";
import LuxuryCard from "../ui/LuxuryCard";

const cards = [
  {
    image: "/assets/hero/hero.jpg",
    category: "Stay & Leisure",
    title: "Escape",
    description: "Rejuvenate in nature’s lap with premium luxury."
  },
  {
    image: "/assets/hero/hero.jpg",
    category: "Wedding & Social Events",
    title: "Celebrate",
    description: "Grand lawns and ballrooms for your timeless moments."
  },
  {
    image: "/assets/hero/hero.jpg",
    category: "Corporate & Conventions",
    title: "Gather",
    description: "World-class venues for impactful gatherings."
  }
];

const CarouselSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? cards.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative flex w-full min-h-screen items-center justify-center overflow-hidden bg-[var(--color-primary)] py-20">

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-6"
      >

        <div className="relative flex h-[520px] w-full items-center justify-center">

          {cards.map((card, i) => {
            const position = (i - index + cards.length) % cards.length;

            const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
            const offset = isMobile ? 140 : 260;

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

                // START STACKED IN CENTER
                initial={{
                  x: 0,
                  scale: 0.7,
                  opacity: 0,
                }}

                // SPREAD TO FINAL POSITION
                whileInView={{
                  x,
                  scale,
                  opacity,
                }}

                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  delay: i * 0.15,
                }}

                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
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

    

<CarouselControls
         total={cards.length}
         index={index}
         onNext={next}
         onPrev={prev}
          progressTrackColor="rgba(255, 255, 255, 0.25)"
          progressFillColor="#FFFFFF"
          buttonColor="#FFFFFF"
          iconColor="#21140F"
        />

      </motion.div>
    </section>
  );
};

export default CarouselSection;
