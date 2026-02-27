import React, { useEffect, useRef, useState } from "react";

const AboutUs: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);
  const mobileTextRef = useRef<HTMLParagraphElement | null>(null);
  const [mobileHeights, setMobileHeights] = useState({ collapsed: 0, expanded: 0 });
  const aboutText =
    "Led by the visionary entrepreneurs Mr. Ronald Colaco and Mr. Vivek Kumar, Clarks Exotica has emerged as a premier destination for corporate and leisure travellers alike. The Management team is characterized by their unwavering commitment to excellence, passion for hospitality, and relentless pursuit of innovation. Drawing on their extensive experience in the hospitality industry, the team is responsible for setting the resort's strategic direction, and ensuring that the resort remains a leading destination for travellers from around the world. Under their able guidance and leadership, Clarks has established itself as a beacon of excellence in the industry.";

  useEffect(() => {
    const measureHeights = () => {
      const node = mobileTextRef.current;
      if (!node) return;
      const expanded = node.scrollHeight;
      setMobileHeights({
        expanded,
        collapsed: Math.floor(expanded * 0.6),
      });
    };

    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [aboutText]);

  return (
    <section
      className="relative h-screen min-h-screen w-full overflow-hidden text-[var(--color-secondary)]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(18, 11, 8, 0.72), rgba(18, 11, 8, 0.78)), url('/assets/herobackgrounds/property/property.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(214,130,32,0.72),rgba(214,130,32,0.18)_32%,transparent_64%)]" />

      <div className="relative mx-auto flex h-full min-h-screen w-full max-w-12xl translate-y-30 flex-col items-center justify-center !px-4 !py-16 text-center md:translate-y-10 md:!px-8 md:!py-20 lg:translate-y-12 lg:!px-10 lg:!py-24">
        {/* <p className="!mb-4 text-[11px] uppercase tracking-[0.28em] text-[#c9a15e] md:text-[12px]">
          About Aldovia
        </p> */}

        <h2 className="!mb-7 !mt-5 mx-auto max-w-4xl text-center text-[2rem] font-semibold leading-tight tracking-[0.01em] md:text-[3rem] lg:text-[3.4rem]">
          A Legacy of Visionary Leadership
        </h2>

        <div
          className="mx-auto w-full max-w-5xl overflow-hidden transition-[max-height] duration-500 ease-in-out md:hidden"
          style={{
            maxHeight: `${showFullText ? (mobileHeights.expanded || 360) : (mobileHeights.collapsed || 220)}px`,
          }}
        >
          <p
            ref={mobileTextRef}
            className="text-center text-[16px] font-normal leading-8 tracking-normal text-[var(--color-secondary)]/90"
          >
            {aboutText}
          </p>
        </div>

        <p className="mx-auto hidden max-w-5xl text-center text-[16px] font-normal leading-8 tracking-normal text-[var(--color-secondary)]/90 md:block md:text-[20px] md:leading-9">
          {aboutText}
        </p>

        <button
          type="button"
          onClick={() => setShowFullText((prev) => !prev)}
          className="!mt-4 block cursor-pointer text-center text-[13px] font-medium uppercase tracking-[0.14em] text-[#cfab57] underline-offset-4 hover:underline md:hidden"
        >
          {showFullText ? "View Less" : "View More"}
        </button>
      </div>
    </section>
  );
};

export default AboutUs;
