import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface LuxuryCardProps {
     image: string;
     category: string;
     title: string;
     description: string;
}

const LuxuryCard: React.FC<LuxuryCardProps> = ({
     image,
     category,
     title,
     description,
}) => {
     const rotateX = useMotionValue(0);
     const rotateY = useMotionValue(0);
     const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 14, mass: 0.45 });
     const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 14, mass: 0.45 });

     const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const tilt = 14;
          rotateY.set((px - 0.5) * tilt * 2);
          rotateX.set((0.5 - py) * tilt * 2);
     };

     const handleMouseLeave = () => {
          rotateX.set(0);
          rotateY.set(0);
     };

     return (
          <motion.div
               whileHover={{
                    scale: 1.04,
                    y: -8,
                    boxShadow: "0 34px 72px rgba(0,0,0,0.45), 0 8px 22px rgba(0,0,0,0.28)",
               }}
               transition={{ duration: 0.35 }}
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
               style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: "preserve-3d",
                    transformPerspective: 1800,
               }}
               className="relative w-full max-w-md h-[520px] rounded-[28px] overflow-hidden bg-[#1B120E] shadow-[0_22px_46px_rgba(0,0,0,0.38)] group will-change-transform"
          >
               {/* Image */}
               <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover [transform:translateZ(-36px)_scale(1.12)] transition-transform duration-700 group-hover:scale-110"
               />

               {/* Gradient Overlay */}
               <div className="absolute inset-0 [transform:translateZ(18px)] bg-gradient-to-t from-black/92 via-black/56 to-transparent" />

               {/* Content */}
               <div className="absolute bottom-0 w-full !px-8 !pb-12 !pt-20 sm:!px-10 sm:!pb-14 translate-y-6 [transform:translateZ(42px)]">
                    <p className="!mb-3 text-[12px] tracking-[0.25em] uppercase text-yellow-400">
                         {category}
                    </p>

                    <h2 className="!mb-4 text-4xl font-serif leading-[1.1]">
                         {title}
                    </h2>

                    <p className="!mb-6 text-base opacity-80 !leading-[1.35] max-w-[85%]">
                         {description}
                    </p>

               </div>
          </motion.div>
     );
};

export default LuxuryCard;
