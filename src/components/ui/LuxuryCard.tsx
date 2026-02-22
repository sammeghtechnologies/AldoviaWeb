import React from "react";
import { motion } from "framer-motion";

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
     return (
          <motion.div
               whileHover={{ scale: 1.02 }}
               transition={{ duration: 0.4 }}
               className="relative w-full max-w-md h-[520px] rounded-[28px] overflow-hidden shadow-2xl group"
          >
               {/* Image */}
               <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />

               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

               {/* Content */}
               <div className="absolute bottom-0 w-full !px-8 !pb-12 !pt-20 sm:!px-10 sm:!pb-14 translate-y-6">
                    <p className="!mb-3 text-[12px] tracking-[0.25em] uppercase text-yellow-400">
                         {category}
                    </p>

                    <h2 className="!mb-4 text-4xl font-serif leading-[1.1]">
                         {title}
                    </h2>

                    <p className="!mb-6 text-base opacity-80 leading-relaxed max-w-[85%]">
                         {description}
                    </p>

               </div>
          </motion.div>
     );
};

export default LuxuryCard;
