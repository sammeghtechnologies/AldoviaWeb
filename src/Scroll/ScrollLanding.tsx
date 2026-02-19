import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroVideoScroll from "./HeroVideoScroll/v2/HeroVideoScroll";

gsap.registerPlugin(ScrollTrigger);

// 1. Define Props type
type MainProps = {
  onComplete: () => void;
};

const Main = ({ onComplete }: MainProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const masterTl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      masterTl.current = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=6000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // ✅ 2. Trigger onComplete when scroll ends
          onLeave: () => {
            onComplete();
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <HeroVideoScroll masterTl={masterTl} />
    </div>
  );
};

// 3. Update Export Component to accept and pass the prop
const ScrollLandingPage = ({ onComplete }: { onComplete: () => void }) => {
  return <Main onComplete={onComplete} />;
};

export default ScrollLandingPage;