import React from "react";
import { motion } from "framer-motion";
import { Trees, Users } from "lucide-react";

const HeroStats: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-12 flex flex-row items-center gap-4 sm:gap-6"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="rounded-full bg-yellow-500/20 p-2.5 backdrop-blur-xl sm:p-3">
          <Trees className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
        </div>
        <div>
          <p className="whitespace-nowrap text-sm font-semibold sm:text-base">
            70 Acres
          </p>
          <p className="whitespace-nowrap text-[10px] tracking-[0.2em] opacity-70 sm:text-xs sm:tracking-[0.24em]">
            LUSH GREENERY
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="rounded-full bg-yellow-500/20 p-2.5 backdrop-blur-xl sm:p-3">
          <Users className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
        </div>
        <div>
          <p className="whitespace-nowrap text-sm font-semibold sm:text-base">
            5,000+
          </p>
          <p className="whitespace-nowrap text-[10px] tracking-[0.2em] opacity-70 sm:text-xs sm:tracking-[0.24em]">
            CAPACITY
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroStats;
