import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface LogoRevealProps {
  // ✅ Kept for compatibility
  masterTl?: React.RefObject<gsap.core.Timeline | null>; 
  onFinish: () => void;
}

const LogoReveal = ({ onFinish }: LogoRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null); // New ref for just the background
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Force Initial State
      gsap.set(logoWrapperRef.current, {
        position: "fixed",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "450px", 
        autoAlpha: 1,
        zIndex: 999999,
      });

      // 2. Play Animation
      const tl = gsap.timeline({
        delay: 0.1, 
        onComplete: () => {
           // Signal parent we are done, but DON'T hide the logo
           onFinish(); 
        }
      });

      tl.to(logoWrapperRef.current, {
          top: "37px",      // Final fixed position (top-6)
          left: "48px",     // Final fixed position (left-10)
          xPercent: 0,
          yPercent: 0,
          width: "56px",    // Final fixed width (w-12)
          duration: 1.0,    
          ease: "expo.inOut",
        })
        // 3. Fade out ONLY the background layer (Logo stays visible)
        .to(bgRef.current, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.inOut",
        }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, []); 

  return (
    <section 
      ref={containerRef} 
      className="fixed inset-0 w-full h-screen z-[999998] pointer-events-none"
    >
      {/* ✅ Separate Background Layer (Fades out) */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 w-full h-full bg-[#49261c]" 
      />

      {/* ✅ Logo Layer (Stays visible) */}
      <div ref={logoWrapperRef} className="flex items-center justify-center pointer-events-auto">
        <img 
          src="assets/logo/aldovialogo.svg" 
          alt="Logo" 
          className="w-full h-auto object-contain brightness-0 invert" 
        />
      </div>
    </section>
  );
};

export default LogoReveal;