import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoader } from "../../../context/LoaderProvider";

const HeroVideo = ({ masterTl }: any) => {
  const { assets } = useLoader();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!assets?.videos?.hero || !sectionRef.current || !masterTl.current)
      return;

    const video = assets.videos.hero;
    const section = sectionRef.current;
    const duration = video.duration;

    // reset video
    video.pause();
    video.currentTime = 0;

    // attach video once
    if (!section.contains(video)) {
      video.className = "w-full h-full object-cover";
      section.appendChild(video);
    }

    const tl = gsap.timeline();

    // Fade in section
    tl.fromTo(section, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

    // Play video
    tl.add(() => {
      video.volume = 1;
      video.play();
    });

    // Wait for full video duration
    tl.to({}, { duration });

    // 🔒 Freeze on last frame
    tl.add(() => {
      video.pause();
    });

    // (Optional but HIGHLY recommended)
    // Slight dim + blur to prep logo morph illusion
    tl.to(section, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.out",
    });

    tl.to(
      video,
      {
        filter: "blur(20px)",
        duration: 0.5,
        ease: "power1.out",
      },
      "<",
    );

    // 👇 Fade out + hide after completion
    tl.to(video, {
      autoAlpha: 0, // opacity: 0 + visibility: hidden
      filter: "blur(40px)",
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        video.style.display = "none";
      },
    });

    // 🔑 Handoff WHILE swan is still visible
    masterTl.current.add(tl, "hero");
    masterTl.current.addLabel("after-hero");
  }, [assets]);

  return (
    <section
      ref={sectionRef}
      className="w-screen h-screen fixed inset-0 z-10 bg-black"
    />
  );
};

export default HeroVideo;
