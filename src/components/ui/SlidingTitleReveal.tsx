import React from "react";
import { motion } from "framer-motion";

interface SlidingTitleRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  eyebrow?: string;
  eyebrowClassName?: string;
}

const lineVariants = {
  hidden: { y: "115%", opacity: 0 },
  visible: (index: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.85,
      delay: index * 0.14,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const SlidingTitleReveal: React.FC<SlidingTitleRevealProps> = ({
  lines,
  className = "",
  lineClassName = "",
  eyebrow,
  eyebrowClassName = "",
}) => {
  return (
    <div>
      {eyebrow ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.7 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={eyebrowClassName}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.55 }}
        className={className}
      >
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className={`block overflow-hidden ${lineClassName}`}>
            <motion.span custom={index} variants={lineVariants} className="block will-change-transform">
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  );
};

export default SlidingTitleReveal;
