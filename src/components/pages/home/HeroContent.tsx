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
          font-lust
          text-2xl 
          sm:text-2xl 
          md:text-4xl 
          lg:text-5xl 
          leading-[1.15] 
          tracking-tight
          text-[var(--color-secondary)]
        ">
          Where Every Moment Is Crafted In Excellence
        </h1>

        <p className="
          !mt-5 
          mx-auto
          max-w-[50ch]
          text-center
          font-['Inter']
          text-base
          font-light
          leading-6
          text-white/90
          text-[var(--color-secondary)]
        ">
          A destination resort 40 minutes from Bangalore, where world-class venues, refined dining, and timeless hospitality come together.
        </p>

        <div className="!mt-6 flex justify-center">
          <HeroButtons />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
