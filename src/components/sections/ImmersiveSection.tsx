import React from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import VideoCard from "../ui/VideoCard";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const ImmersiveSection: React.FC = () => {
  const immersiveCards = React.useMemo(
    () => [
      { image: "/assets/hero/360view.jpg", title: "Wedding Setup Walkthrough" },
      { image: "/assets/hero/360view.jpg", title: "Corporate Hall Tour" },
    ],
    []
  );

  return (
    <section className="w-full min-h-screen bg-[rgba(33,20,15,0.80)] !py-20 !px-[2%] flex flex-col items-center">
      {/* Heading */}
      <div className="max-w-6xl mx-auto !mb-10 text-center">
        <SlidingTitleReveal
          lines={["Explore the Resort"]}
          className="!pt-2 !pb-2 text-4xl md:text-5xl font-serif text-white"
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-16">
        {/* 360 Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[420px] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src="/assets/hero/360view.jpg"
            alt="Resort"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <Video className="mb-8 h-8 w-8 text-white/90" />

            <p className="!pt-1 !pb-1 text-[.8em] tracking-[0.18em] uppercase text-white/80">
              Immersive Experience
            </p>

            <h3 className="!pt-2 !pb-2 text-4xl font-serif leading-tight !mb-6 max-w-[16ch] md:text-4xl">
              Before You Arrive
            </h3>

            <p className="!pt-1 !pb-1 !mb-8 max-w-[30ch] text-base !leading-[1.35] text-white/90 md:text-md">
              Experience our venues, rooms, and amenities in stunning 360° detail
            </p>

            <button className="!inline-flex !pt-2 !pr-[31.561px] !pb-2 !pl-[33.002px] !justify-center !items-center !rounded-[8px] !bg-white !text-black !font-medium hover:!bg-gray-200 !transition">
              Enter 360° Virtual Tour
            </button>

            <p className="!pt-1 !pb-1 mt-5 text-[.8em] text-white/60">
              Loads in 5-10 seconds • Exit anytime
            </p>
          </div>
        </motion.div>

        <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-center">
          {immersiveCards.map((item) => (
            <div
              key={item.title}
              className="w-full max-w-[480px] md:w-[calc(50%-1rem)] md:max-w-[480px] md:!opacity-100 md:!scale-100 md:!blur-0"
            >
              <VideoCard image={item.image} title={item.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImmersiveSection;
