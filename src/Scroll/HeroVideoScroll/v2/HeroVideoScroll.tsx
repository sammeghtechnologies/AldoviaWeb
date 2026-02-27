import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  masterTl: React.MutableRefObject<gsap.core.Timeline | null>;
};

export default function HeroVideoScroll({ masterTl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const TOTAL_FRAMES = 499;
  const BLUR_START_FRAME = TOTAL_FRAMES - 25; 

  const FRAME_PATH = (i: number) =>
    `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Preload Frames
  useEffect(() => {
    const loaded: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);

      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loaded);
        }
      };

      loaded.push(img);
    }
  }, []);

  useEffect(() => {
    if (!images.length || !masterTl?.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false }); 
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const frameObj = { frame: 0 };

    const render = (index: number) => {
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      const img = images[frameIndex];
      if (!img) return;

      // ✅ BALANCED SMOOTH BLUR
      if (frameIndex >= BLUR_START_FRAME) {
        const linearProgress = (frameIndex - BLUR_START_FRAME) / 25;
        const smoothProgress = linearProgress * linearProgress;

        // ✅ REDUCED: Set to 100px for a cleaner transition
        const blurValue = smoothProgress * 100; 

        context.filter = `blur(${blurValue}px)`;
      } else {
        context.filter = "none";
      }

      // ✅ GLITCH FIX: No clearRect
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    render(0);

    const heroTl = gsap.timeline({ defaults: { ease: "none" } });

    heroTl.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      duration: 1,
      snap: "frame",
      onUpdate: () => render(frameObj.frame),
      onComplete: () => render(TOTAL_FRAMES - 1),
    });

    masterTl.current.add(heroTl);
    masterTl.current.addLabel("hero-end");

  }, [images]);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "block" }} 
      />
    </section>
  );
}