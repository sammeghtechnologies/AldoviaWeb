import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoCardProps {
  image: string;
  title: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ image, title }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="relative h-[260px] md:h-[300px] rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
    >

      {/* Background Image */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">

        {/* Gold Play Button */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500 flex items-center justify-center mb-6 shadow-xl">
          <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" />
        </div>

        <h4 className="text-xl md:text-2xl font-medium !mt-8">
          {title}
        </h4>

      </div>
    </motion.div>
  );
};

export default VideoCard;
