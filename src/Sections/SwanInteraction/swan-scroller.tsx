import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  onComplete?: () => void;
};

const TOTAL_FRAMES = 41;
const MANUAL_END_FRAME = 39;

const getFramePath = (index: number) => {
  const paddedIndex = String(index).padStart(3, "0");
  return `/assets/swanfly2/ezgif-frame-${paddedIndex}.jpg`;
};

const SwanInteraction = ({ onComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameObj = useRef({ frame: 1 });
  const isAutoPlaying = useRef(false);

  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
    }
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !imgRef.current) return;

    // ✅ FIX 1: Reset scroll to 0 immediately when this component mounts
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ✅ FIX 2: Give the browser a split second to recognize the scroll reset
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=800%", // Luxurious scroll length
        scrub: 1.5,
        pin: true,
        onUpdate: (self) => {
          if (!isAutoPlaying.current) {
            // Mapping scroll progress to frames 1-39
            const currentFrame = Math.max(1, Math.min(MANUAL_END_FRAME, Math.floor(self.progress * MANUAL_END_FRAME) + 1));
            
            if (frameObj.current.frame !== currentFrame) {
              frameObj.current.frame = currentFrame;
              if (imgRef.current) imgRef.current.src = getFramePath(currentFrame);
            }
          }
        },
        onLeave: () => {
          if (isAutoPlaying.current) return;
          isAutoPlaying.current = true;

          // Final Takeoff animation
          gsap.to(frameObj.current, {
            frame: TOTAL_FRAMES,
            duration: 0.8,
            ease: "power2.out",
            roundProps: "frame",
            onUpdate: () => {
              if (imgRef.current) imgRef.current.src = getFramePath(Math.round(frameObj.current.frame));
            },
            onComplete: () => {
              // ✅ FIX 3: Clean up and move to Bubbles
              ScrollTrigger.getAll().forEach(st => st.kill());
              if (onComplete) onComplete();
            }
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [onComplete]);

  return (
    <section ref={containerRef} className="relative w-full h-screen z-40 bg-black">
      <div className="relative w-full h-full overflow-hidden">
        <img 
          ref={imgRef} 
          src={getFramePath(1)} 
          className="w-full h-full object-cover" 
          alt="Swan Animation"
        />
      </div>
    </section>
  );
};

export default SwanInteraction;