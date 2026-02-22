import React from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import VideoCard from "../ui/VideoCard";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const ImmersiveSection: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-[rgba(33,20,15,0.80)] !py-20 !px-6 flex flex-col items-center">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-14 text-center">
        <SlidingTitleReveal
          lines={["Explore the Resort"]}
          className="!pt-2 !pb-2 text-4xl md:text-5xl font-serif text-white"
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-14">
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
            <Video className="mb-8 h-10 w-10 text-white/90" />

            <p className="!pt-1 !pb-1 text-sm tracking-[0.18em] uppercase text-white/80">
              Immersive Experience
            </p>

            <h3 className="!pt-2 !pb-2 text-4xl font-serif leading-tight !mb-6 max-w-[16ch] md:text-5xl">
              Before You Arrive
            </h3>

            <p className="!pt-1 !pb-1 mb-8 max-w-[30ch] text-base leading-relaxed text-white/90 md:text-xl">
              Experience our venues, rooms, and amenities in stunning 360° detail
            </p>

            <button className="!inline-flex !pt-2 !pr-[31.561px] !pb-2 !pl-[33.002px] !justify-center !items-center !rounded-[8px] !bg-white !text-black !font-medium hover:!bg-gray-200 !transition">
              Enter 360° Virtual Tour
            </button>

            <p className="!pt-1 !pb-1 mt-5 text-sm text-white/60">
              Loads in 5-10 seconds • Exit anytime
            </p>
          </div>
        </motion.div>

        <div className="flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:justify-center">
          <div className="w-full lg:max-w-[480px]">
            <VideoCard
              image="/assets/hero/360view.jpg"
              title="Wedding Setup Walkthrough"
            />
          </div>

          <div className="w-full lg:max-w-[480px]">
            <VideoCard
              image="/assets/hero/360view.jpg"
              title="Corporate Hall Tour"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveSection;
