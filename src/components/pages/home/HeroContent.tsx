import React from "react";
import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

const HeroContent: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mx-auto flex max-w-4xl flex-col items-center px-6"
      >
        <h1 className="
          mx-auto
          max-w-[18ch]
          font-serif 
          text-4xl 
          sm:text-5xl 
          md:text-6xl 
          lg:text-7xl 
          leading-[1.15] 
          tracking-tight
        ">
          Escape into Grandeur
        </h1>

        <p className="
          !mt-5 
          mx-auto
          max-w-[36ch]
          text-center
          font-['Inter']
          text-base
          font-light
          leading-6
          text-white/90
        ">
          Grand Celebrations. Timeless Stays.
        </p>

        <div className="!mt-6 flex justify-center">
          <HeroButtons />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
