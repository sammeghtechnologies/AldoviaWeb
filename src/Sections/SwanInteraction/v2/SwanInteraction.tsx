import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoader } from "../../../context/LoaderProvider";

type Props = {
  masterTl: React.MutableRefObject<gsap.core.Timeline | null>;
};

const SwanInteraction = ({ masterTl }: Props) => {
  const { assets } = useLoader();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const isPlaying = useRef(false);

  /* ---------------- MASTER TIMELINE ENTRY ---------------- */

  useEffect(() => {
    if (!masterTl?.current || !containerRef.current) return;

    const swanTl = gsap.timeline({
      onComplete: () => {
        // ⛔ Pause master until user interacts
        masterTl.current?.pause();
      },
    });

    gsap.set(containerRef.current, {
      autoAlpha: 0,
    });

    swanTl.to(containerRef.current, {
      autoAlpha: 1,
      duration: 1.2,
      ease: "power3.out",
    });

    // 🔥 Attach AFTER menu automatically
    masterTl.current.add(swanTl, ">");
  }, []);

  /* ---------------- ATTACH PRELOADED VIDEO ---------------- */

  useEffect(() => {
    if (!assets?.videos?.swan || !containerRef.current) return;

    const video = assets.videos.swan;
    const container = containerRef.current;

    video.pause();
    video.currentTime = 1;

    if (!container.contains(video)) {
      video.className = `
        pointer-events-none
        w-full
        max-w-[1400px]
        h-auto
        will-change-transform
      `;
      container.appendChild(video);
    }

    videoRef.current = video;
  }, [assets]);

  /* ---------------- SEGMENT PLAYER ---------------- */

  const playSegment = (from: number, to: number, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) return;

    isPlaying.current = true;
    video.currentTime = from;
    video.play();

    const tick = () => {
      if (video.currentTime >= to) {
        video.pause();
        gsap.ticker.remove(tick);
        isPlaying.current = false;
        onDone?.();
      }
    };

    gsap.ticker.add(tick);
  };

  /* ---------------- USER INTERACTION ---------------- */

  const handleClick = () => {
    if (isPlaying.current) return;

    // 🦢 Stage 1 - Ready to fly
    if (stage === 0) {
      playSegment(2, 5, () => setStage(1));
    }

    // 🦢 Stage 2 - Takeoff
    else if (stage === 1) {
      playSegment(5, 10, () => {
        setStage(2);

        gsap.to(containerRef.current, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            // ▶ Resume cinematic flow
            masterTl.current?.play();
          },
        });
      });
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <section
      ref={containerRef}
      onClick={handleClick}
      className="
        fixed
        inset-0
        w-screen
        h-screen
        flex
        items-center
        justify-center
        bg-black
        cursor-pointer
        overflow-hidden
      "
    />
  );
};

export default SwanInteraction;
