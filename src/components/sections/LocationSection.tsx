import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const LocationSection: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  // 👉 Replace with your real coordinates
  const latitude = 13.2068724;
  const longitude = 77.6338742;

  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 40%"],
  });
  const buttonXRaw = useTransform(scrollYProgress, [0, 1], [-140, 0]);
  const buttonOpacityRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const buttonX = useSpring(buttonXRaw, { stiffness: 80, damping: 24, mass: 0.8 });
  const buttonOpacity = useSpring(buttonOpacityRaw, { stiffness: 80, damping: 24, mass: 0.8 });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FBF6E6] !py-20 !px-6 md:!px-10 lg:!px-16 flex justify-center"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

        {/* Heading */}
        <SlidingTitleReveal
          lines={["Perfectly Located"]}
          className="text-[32px] md:text-[42px] font-medium text-[#1C1917] [font-family:'Playfair_Display']"
        />

        <p className="text-[#6B5E57] mt-3 text-[15px]">
          Easily accessible luxury resort
        </p>

        {/* Airport Badge */}
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-[#E9D6A5] text-[#3D2B1F] !px-4 !py-2 rounded-full text-sm font-medium">
            📍 15 minutes from Bangalore Airport
          </span>
        </div>

        {/* Map */}
        <div className="!mt-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Hotel Location"
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Get Directions Button */}
        <div className="!mt-10">
          <motion.div style={{ x: buttonX, opacity: buttonOpacity }}>
            <motion.button
              onClick={() => window.open(googleMapsLink, "_blank")}
              transition={{ y: { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } }}
              animate={{ y: [0, -3, 0] }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform" }}
              className="bg-[#5A3326] hover:bg-[#47271C] text-white
                         !px-10 !py-3 rounded-full text-[1em]
                         transition duration-300 shadow-md"
            >
              ➤ Get Directions
            </motion.button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default LocationSection;
