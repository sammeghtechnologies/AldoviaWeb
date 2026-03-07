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
    <section className="relative w-full min-h-screen overflow-hidden bg-[var(--color-secondary)] !py-20 !px-[2%] flex flex-col items-center">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-0 -translate-y-1/2 bg-no-repeat opacity-10 md:opacity-[0.15]"
        style={{
          backgroundImage: "url('/assets/logo/logo-wet-earth.png')",
          backgroundSize: "min(54vw, 520px)",
          backgroundPosition: "right top",
          width: "min(54vw, 520px)",
          height: "min(54vw, 520px)",
        }}
      /> */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 bg-no-repeat opacity-20 md:opacity-[0.15] right-[-38%] top-[0%] -translate-y-[22%] sm:right-[-6%] sm:top-[0%] sm:-translate-y-[22%] md:right-[-14%] md:top-[0%] md:-translate-y-[22%] lg:right-[-42%] lg:top-[-13%] lg:-translate-y-[24%] [--logo-size:122vw] sm:[--logo-size:148vw] md:[--logo-size:162vw] lg:[--logo-size:136vw] xl:[--logo-size:100vw]"
        style={{
          backgroundImage: "url('/assets/logo/brownsmall-bg.svg')",
          backgroundSize: "var(--logo-size)",
          backgroundPosition: "right top",
          width: "var(--logo-size)",
          height: "var(--logo-size)",
        }}
      />

      {/* Heading */}
      <div className="relative z-10 max-w-6xl mx-auto !mb-10 text-center">
        <SlidingTitleReveal
          lines={["Explore the Resort"]}
          className="!pt-2 !pb-2 text-4xl md:text-5xl font-serif text-[var(--color-primary)]"
          lineClassName="!text-[var(--color-primary)]"

        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-16">
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

            <h3 className="!pt-2 !pb-2 text-4xl font-serif leading-tight !mb-6 max-w-[16ch] md:text-4xl !text-[var(--color-secondary)]">
              Before You Arrive
            </h3>

            <p className="!pt-1 !pb-1 !mb-8 max-w-[30ch] text-base !leading-[1.35] text-white/90 md:text-md">
              Experience our venues, rooms, and amenities in stunning 360° detail
            </p>

            <button className="!inline-flex !pt-2 !pr-[31.561px] !pb-2 !pl-[33.002px] !justify-center !items-center !rounded-[8px] !bg-[var(--color-secondary)] !text-black !font-medium hover:!bg-gray-200 !transition">
              Enter 360° Virtual Tour
            </button>

            <p className="!pt-1 !pb-1 mt-5 text-[.8em] text-white/60 !text-[var(--color-secondary)]">
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
