import React from "react";
import { motion } from "framer-motion";
import CarouselControls from "./CarouselControls";

interface AnimatedImageHeroProps {
  images: string[];
  title: string;
  subtitle?: string;
  eyebrow?: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  topLeftContent?: React.ReactNode;
  topRightContent?: React.ReactNode;
  className?: string;
  heightClassName?: string;
  cycleMs?: number;
  enableTypingSubtitle?: boolean;
  controlsWrapperClassName?: string;
  controlsClassName?: string;
  controlsProgressBarClassName?: string;
  centerContentClassName?: string;
  enableEntryAnimation?: boolean;
  entryDuration?: number;
  enableStaggeredTitle?: boolean;
}

const AnimatedImageHero: React.FC<AnimatedImageHeroProps> = ({
  images,
  title,
  subtitle,
  eyebrow,
  buttonLabel,
  onButtonClick,
  topLeftContent,
  topRightContent,
  className = "",
  heightClassName = "h-screen",
  cycleMs = 4500,
  enableTypingSubtitle = false,
  controlsWrapperClassName = "mt-10 w-full max-w-xl",
  controlsClassName = "",
  controlsProgressBarClassName = "max-w-xs",
  centerContentClassName = "",
  enableEntryAnimation = false,
  entryDuration = 1.8,
  enableStaggeredTitle = false,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [typedCount, setTypedCount] = React.useState(0);
  const subtitleChars = React.useMemo(() => (subtitle ? subtitle.split("") : []), [subtitle]);
  const titleWords = React.useMemo(() => title.split(" "), [title]);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, cycleMs);
    return () => window.clearInterval(timer);
  }, [images.length, cycleMs]);

  React.useEffect(() => {
    if (!subtitle || !enableTypingSubtitle) return;
    setTypedCount(0);
    const timer = window.setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= subtitle.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 22);
    return () => window.clearInterval(timer);
  }, [subtitle, enableTypingSubtitle]);

  const onNext = React.useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const onPrev = React.useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <motion.section
      className={`relative w-full overflow-hidden text-white ${heightClassName} ${className}`}
      initial={enableEntryAnimation ? { opacity: 0, scale: 1.035 } : false}
      animate={enableEntryAnimation ? { opacity: 1, scale: 1 } : undefined}
      transition={enableEntryAnimation ? { duration: entryDuration, ease: [0.22, 1, 0.36, 1] } : undefined}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.img
            key={`${image}-${index}`}
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1.01 : 1.04,
            }}
            transition={{ opacity: { duration: 0.6 }, scale: { duration: 5.2, ease: "easeOut" } }}
          />
        );
      })}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,23,0.46)_0%,rgba(28,25,23,0.56)_50%,rgba(28,25,23,0.46)_100%)]" />

      {(topLeftContent || topRightContent) && (
        <div className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 md:px-10">
          <div>{topLeftContent}</div>
          <div>{topRightContent}</div>
        </div>
      )}

      <div
        className={`relative z-20 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-6 text-center md:px-10 ${centerContentClassName}`}
      >
        {eyebrow && (
          <span className="mb-4 inline-flex rounded-full bg-[#D4AF37] px-4 py-1 text-xs font-semibold tracking-[0.12em] text-[#1F140F]">
            {eyebrow}
          </span>
        )}

        <motion.h1
          className="max-w-[16ch] font-lust text-5xl !leading-[1] md:text-7xl"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {enableStaggeredTitle ? (
            titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block"
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.18 + index * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
                {index < titleWords.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {subtitle && (
          <p className="!mt-8 max-w-[38ch] text-base text-white/90 md:text-xl">
            {enableTypingSubtitle
              ? subtitleChars.map((char, index) => (
                <span
                  key={`typed-subtitle-${index}`}
                  style={{
                    opacity: index < typedCount ? 1 : 0,
                    transition: "opacity 120ms ease-out",
                  }}
                >
                  {char}
                </span>
              ))
              : subtitle}
          </p>
        )}

        <button
          type="button"
          onClick={onButtonClick}
          className="!mt-8 !rounded-[999px] !border !border-[rgba(255,255,255,0.30)] !bg-[rgba(255,255,255,0.10)] !px-7 !py-3 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:!bg-[rgba(255,255,255,0.18)] md:text-base"
        >
          {buttonLabel}
        </button>

        {images.length > 1 && (
          <div className={controlsWrapperClassName}>
            <CarouselControls
              total={images.length}
              index={activeIndex}
              onNext={onNext}
              onPrev={onPrev}
              progressTrackColor="rgba(255, 255, 255, 0.3)"
              progressFillColor="var(--color-secondary)"
              buttonColor="var(--color-secondary)"
              iconColor="var(--color-primary)"
              className={controlsClassName}
              progressBarClassName={controlsProgressBarClassName}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default AnimatedImageHero;
