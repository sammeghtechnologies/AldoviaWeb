import React, { useEffect, useRef, useState } from "react";

const AboutUs: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);
  const mobileTextRef = useRef<HTMLParagraphElement | null>(null);
  const [mobileHeights, setMobileHeights] = useState({ collapsed: 0, expanded: 0 });
  const aboutText  = "Set across 70 acres of landscaped grounds, just forty minutes from the heart of Bangalore, Aldovia  Resort & Convention began its life as Clarks Exotica, a name that served the property well for years. But properties, like the people who build them, evolve. And in January 2026, this evolution found its name.\n\nAldovia is not a rebrand in the cosmetic sense. It is a recalibration. Every space, every service, every experience has been reconsidered through a single lens: excellence, not as an aspiration, but as a standard. The Galaxy Grand Ballroom still seats three thousand. The grounds still stretch to the horizon. The kitchens still serve meals three times a day. What has changed is the intention behind all of it.\n\nToday, Aldovia is where Bangalore comes to celebrate. Weddings that take over the entire property. Conferences that bring five hundred people together under one roof. Family weekends that start with the pool and end with a meal nobody wants to finish. Corporate retreats where the offsite actually feels different from the office.\n\nTwelve event venues ranging from intimate boardrooms to a courtyard under the open sky. Three restaurants, each with their own identity. A spa that draws on Ayurvedic tradition without ignoring modern practice. An infinity pool that makes forty minutes from the city feel like forty hours.\n\nAnd behind all of it, a team that has been here long enough to know what works, and bold enough to change what did not.\n\nAldovia. Crafted In Excellence.";
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
        The Aldovia Story
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
