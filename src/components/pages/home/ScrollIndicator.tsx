import React from "react";
import { motion } from "framer-motion";

const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-center text-xs tracking-[0.4em] opacity-70"
    >
      <img
        src="assets/icons/collapse.svg"
        alt="Swipe up icon"
        className="mb-2 h-4 w-4 animate-bounce"
      />
      <span>SWIPE UP</span>
    </motion.div>
  );
};

export default ScrollIndicator;
