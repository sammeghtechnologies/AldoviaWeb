import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  onComplete?: () => void;
};

// Updated constants for the new sequence
const TOTAL_FRAMES = 41;
const MANUAL_END_FRAME = 39; 

const getFramePath = (index: number) => {
  // Simplified to point to the new swanfly2 directory
  const paddedIndex = String(index).padStart(3, "0");
  return `/assets/swanfly2/ezgif-frame-${paddedIndex}.jpg`;
};

const SwanInteraction = ({ onComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameObj = useRef({ frame: 1 });
  const isAutoPlaying = useRef(false);

  // Preload images
  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
    }
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.5,
        pin: true,
        onUpdate: (self) => {
          if (!isAutoPlaying.current) {
            // Map scroll progress to frames 1 through 39
            const currentFrame = Math.max(1, Math.floor(self.progress * MANUAL_END_FRAME));
            frameObj.current.frame = currentFrame;
            if (imgRef.current) imgRef.current.src = getFramePath(currentFrame);
          }
        },
        onLeave: () => {
          if (isAutoPlaying.current) return;
          isAutoPlaying.current = true;

          // Animate the remaining frames (39 to 41)
          gsap.to(frameObj.current, {
            frame: TOTAL_FRAMES,
            duration: 0.3,
            ease: "none",
            roundProps: "frame",
            onUpdate: () => {
              if (imgRef.current) imgRef.current.src = getFramePath(frameObj.current.frame);
            },
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
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