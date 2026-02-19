import { useEffect, useRef } from "react";
import gsap from "gsap";
import Observer from "gsap/Observer";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

export const useStepScroll = () => {
  const isAnimating = useRef(false);
  const steps = [0, 500,800, 1500,2200];
  const currentStepIndex = useRef(0);

  useEffect(() => {
    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      wheelSpeed: 1,
      tolerance: 15,
      preventDefault: true,
      onDown: () => !isAnimating.current && scrollByStep(1),
      onUp: () => !isAnimating.current && scrollByStep(-1),
    });

    const scrollByStep = (direction: number) => {
      const nextIndex = Math.min(Math.max(currentStepIndex.current + direction, 0), steps.length - 1);
      
      if (nextIndex !== currentStepIndex.current) {
        isAnimating.current = true;
        currentStepIndex.current = nextIndex;

        // ✅ ULTRA-SLOW: 6s for the first step, 5s for others
      const animDuration = nextIndex === 1 ? 6.0 : nextIndex === 2 ? 0.5 : 5.0;

        gsap.to(window, {
          scrollTo: steps[nextIndex],
          duration: animDuration, 
          ease: "sine.inOut", 
          onComplete: () => {
            isAnimating.current = false;
          }
        });
      }
    };

    return () => observer.kill();
  }, []);
};