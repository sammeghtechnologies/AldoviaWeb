import { useEffect, useRef, useState } from "react";

const impactStats = [
  { end: 2, suffix: "+", label: "Decades of Excellence" },
  { end: 250, suffix: "+", label: "Team Members" },
  { end: 98, suffix: "%", label: "Guest Satisfaction" },
];

const AboutInfoSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasStartedCount, setHasStartedCount] = useState(false);
  const [counts, setCounts] = useState<number[]>(impactStats.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasStartedCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStartedCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStartedCount]);

  useEffect(() => {
    if (!hasStartedCount) return;

    const duration = 1400;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(impactStats.map((item) => Math.round(item.end * eased)));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasStartedCount]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden text-[var(--color-secondary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-8%] z-[1] translate-y-[46%] bg-no-repeat opacity-10 md:opacity-[0.16]"
        style={{
          backgroundImage: "url('/assets/logo/logo-wet-earth.png')",
          backgroundSize: "min(60vw, 760px)",
          backgroundPosition: "right bottom",
          width: "min(60vw, 760px)",
          height: "min(60vw, 760px)",
        }}
      />

      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-16%] z-0 translate-y-[44%] bg-no-repeat opacity-23 md:opacity-[0.8]"
        style={{
          backgroundImage: "url('/assets/logo/logo-wet-earth.png')",
          backgroundSize: "min(64vw, 920px)",
          backgroundPosition: "right bottom",
          width: "min(64vw, 920px)",
          height: "min(64vw, 920px)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(207,171,87,0.15),transparent_60%)]" />

      {/* ===== CENTER WRAPPER (IMPORTANT) ===== */}
      <div className="relative z-10 flex w-full justify-center">
        <div className="w-full max-w-6xl !px-4 !py-14 md:!px-8 md:!py-16 lg:!px-10 lg:!py-20">

          {/* RIGHT CARD */}
          <div className="w-full">
            <div className="w-full rounded-2xl border border-[#cfab57]/25 bg-[linear-gradient(90deg,rgba(58,24,14,0.64),rgba(78,43,26,0.5),rgba(58,24,14,0.64))] !px-6 !py-6 md:!px-8 md:!py-7">
              <h3 className="!mb-6 text-left text-[28px] leading-none md:text-[34px]">
                Our Impact
              </h3>

              <div className="flex w-full flex-col gap-6 text-left md:flex-row md:items-end md:justify-between md:gap-8">
                {impactStats.map((item, index) => (
                  <div key={item.label} className="min-w-0">
                    <p className="font-lust text-[56px] leading-none !text-[#FFE694] md:text-[42px]">
                      {counts[index]}
                      {item.suffix}
                    </p>
                    <p className="!mt-2 text-[11px] uppercase tracking-[0.16em] text-[var(--color-secondary)]/78 md:text-[12px]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfoSection;
