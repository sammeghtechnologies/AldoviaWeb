import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// import { useAssets } from "../../hooks/useAssets";
// import { useAssets } from "../../hooks/useAssets";

gsap.registerPlugin(ScrollTrigger);


export default function HeroVideoScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const TOTAL_FRAMES = 499; // Change to your frame count
  const FRAME_PATH = (i: number) =>
    `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;
  // Example: /public/frames/swarn_60/frame_0001.jpg

  const [images, setImages] = useState<HTMLImageElement[]>([]);

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
    if (!images.length) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;

    let targetFrame = 0;
    let currentFrame = 0;
    let rafId: number;

    const render = (index: number) => {
      const img = images[Math.floor(index)];
      if (!img) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const smoothUpdate = () => {
      currentFrame += (targetFrame - currentFrame) * 0.2;
      render(currentFrame);
      rafId = requestAnimationFrame(smoothUpdate);
    };
    smoothUpdate();

    // Create GSAP ScrollTrigger animation
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      pin: true,
      onUpdate: (self) => {
        targetFrame = self.progress * (TOTAL_FRAMES - 1);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      scrollTriggerRef.current?.kill();
    };
  }, [images]);

  // const { videos } = useAssets(); // still available if needed

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[500vh] bg-black overflow-hidden"
    >
      {/* <Navbar /> */}
      <canvas
        ref={canvasRef}
        className="sticky top-0 w-full h-screen object-cover"
      />
    </section>
  );
}
