import React from "react";
import { motion } from "framer-motion";

interface RoomsCardProps {
  image: string;
  title: string;
  description: string;
  size: string;
  guests: string;
  price: string;
}

const RoomsCard: React.FC<RoomsCardProps> = ({
  image,
  title,
  description,
  size,
  guests,
  price,
}) => {
  return (
    <motion.div
      whileHover={{ rotateX: 5, rotateY: -7, y: -8, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 w-full max-w-md rounded-2xl overflow-hidden bg-[#E8E2D6] shadow-[0_22px_40px_rgba(0,0,0,0.20)] [transform-style:preserve-3d] [transform:perspective(1200px)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/35 via-transparent to-black/10" />

      {/* Image Section */}
      <motion.div
        whileHover={{ translateZ: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 [transform:translateZ(10px)]"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-[260px] object-cover"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-[#1C1917] text-sm font-medium !px-4 !py-1 rounded-full shadow">
          ₹{price}/night
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="relative z-10 !px-6 !py-6 [transform:translateZ(14px)]">
        {/* <img
          src="/assets/logo/logo-wet-earth.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-28px] right-0 w-[220px] opacity-25 z-0"
        /> */}

        <h3 className="relative z-10 text-3xl font-lust !mb-3 text-[#1C1917]">
          {title}
        </h3>

        <p className="relative z-10 text-gray-600 !mb-6 text-[#57534D]">
          {description}
        </p>

        {/* Meta Row */}
        <div className="relative z-10 flex items-center text-[#79716B] text-sm !mb-8 !space-x-2">
          <span>{size}</span>
          <span>•</span>
          <span>{guests}</span>
        </div>

        {/* Book Button */}
        <button
          className="
            relative
            z-10
            w-full 
            !py-3 
            !px-6 
            text-center 
            text-[#0A0A0A]
            text-[1em]
            font-medium
            leading-[20px]
            [font-family:'Inter']
            border 
            border-[rgba(0,0,0,0.10)] 
            bg-[rgba(255,255,255,0.50)] 
            rounded-[999px] 
            backdrop-blur-sm 
            hover:bg-white/70 
            transition
          "
        >
          Book Now
        </button>

      </div>
    </motion.div>
  );
};

export default RoomsCard;
