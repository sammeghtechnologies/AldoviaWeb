import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoader } from "../../context/LoaderProvider";

type Props = {
  masterTl: React.MutableRefObject<gsap.core.Timeline | null>;
};

const LogoReveal = ({ masterTl }: Props) => {
  const { assets } = useLoader();
  const sectionRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!masterTl?.current || !sectionRef.current || !assets?.images?.logo)
  //     return;

  //   const section = sectionRef.current;
  //   const logo = assets.images.logo;

  //   gsap.set(section, { autoAlpha: 0, pointerEvents: "none" });
  //   gsap.set(logo, {
  //     autoAlpha: 0,
  //     scale: 0.95,
  //     transformOrigin: "50% 50%",
  //   });

  //   if (!section.contains(logo)) {
  //     logo.className = "w-[420px] max-w-[80vw]";
  //     section.appendChild(logo);
  //   }

  //   const logoTl = gsap.timeline({ defaults: { ease: "none" } });

  //   logoTl.to(section, {
  //     autoAlpha: 1,
  //     duration: 0.6,
  //   });

  //   logoTl.to(
  //     logo,
  //     {
  //       autoAlpha: 1,
  //       scale: 1,
  //       duration: 1,
  //     },
  //     "<",
  //   );

  //   logoTl.to({}, { duration: 2 });

  //   logoTl.to(section, {
  //     autoAlpha: 0,
  //     duration: 1,
  //   });

  //   // masterTl.current.add(logoTl); // 🔥 simplest correct sync

  //   masterTl.current.add(logoTl, "hero-end");
  //   console.log("Works Logoreveal starts");
  // }, [assets, masterTl]);

  useEffect(() => {
    if (!masterTl?.current || !sectionRef.current || !assets?.images?.logo)
      return;

    const section = sectionRef.current;
    const logo = assets.images.logo;

    gsap.set(section, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(logo, {
      autoAlpha: 0,
      scale: 0.95,
      transformOrigin: "50% 50%",
    });

    if (!section.contains(logo)) {
      logo.className = "w-[420px] max-w-[80vw]";
      section.appendChild(logo);
    }

    const logoTl = gsap.timeline({ defaults: { ease: "none" } });

    logoTl.to(section, {
      autoAlpha: 1,
      duration: 0.6,
    });

    logoTl.to(
      logo,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1,
      },
      "<",
    );

    logoTl.to({}, { duration: 2 });

    logoTl.to(section, {
      autoAlpha: 0,
      duration: 1,
    });

    // ✅ Now it will correctly wait for hero timeline to finish
    masterTl.current.add(logoTl, "hero-end");

    console.log("LogoReveal added after hero-end");
  }, [assets, masterTl]);

  return (
    <div
      ref={sectionRef}
      className="fixed inset-0 z-40 flex items-center justify-center"
    />
  );
};

export default LogoReveal;
