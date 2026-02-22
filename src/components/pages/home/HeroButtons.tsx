import React from "react";
import { motion } from "framer-motion";

const HeroButtons: React.FC = () => {
  const buttonLayoutClass =
    "flex w-[314px] h-10 px-6 py-5 justify-center items-center gap-2 shrink-0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-10 flex flex-col items-center gap-5"
    >
      <div className="flex flex-col items-center gap-5 lg:flex-row">
        <button
          className={`${buttonLayoutClass} bg-[var(--color-primary)] hover:brightness-90 transition-all duration-500 text-white rounded-full text-lg shadow-2xl backdrop-blur-md`}
        >
          Book Your Stay
        </button>

        <button
          className={`${buttonLayoutClass} border border-white/50 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-500 text-white rounded-full text-lg`}
        >
          Plan Your Event
        </button>
      </div>

      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
        className="mt-2 flex items-center gap-2 text-lg group"
      >
        <span className="transition-transform group-hover:translate-x-2">
          →
        </span>
        Explore Aldovia
      </motion.button>
    </motion.div>
  );
};

export default HeroButtons;
