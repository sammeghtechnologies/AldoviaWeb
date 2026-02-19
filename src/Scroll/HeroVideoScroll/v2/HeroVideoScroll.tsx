import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  masterTl: React.MutableRefObject<gsap.core.Timeline | null>;
};

export default function HeroVideoScroll({ masterTl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const TOTAL_FRAMES = 499;

  const FRAME_PATH = (i: number) =>
    `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // 🔥 Preload Frames
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
    if (!images.length || !masterTl?.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const frameObj = { frame: 0 };

    const render = (index: number) => {
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      const img = images[frameIndex];
      if (!img) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
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

    // IMPORTANT: add heroTl first
    masterTl.current.add(heroTl);

    // IMPORTANT: add label in master timeline AFTER heroTl is added
    masterTl.current.addLabel("hero-end");

    console.log("Hero timeline added + label set");

  }, [images]);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </section>
  );
}
