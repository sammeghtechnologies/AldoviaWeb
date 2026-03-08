import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import SlidingTitleReveal from "../../ui/SlidingTitleReveal";

const ThreeDCube = lazy(() => import("../../ui/ThreeDCube"));

export interface ActivitySectionData {
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  whatIncludes: string[];
  timings?: string;
  backgroundImage?: string;
}

export interface ActivityInfoData {
  title: ActivitySectionData["title"];
  subtitle: ActivitySectionData["subtitle"];
  images: ActivitySectionData["images"];
  description: ActivitySectionData["description"];
  whatIncludes: ActivitySectionData["whatIncludes"];
  timings?: ActivitySectionData["timings"];
  backgroundImage?: ActivitySectionData["backgroundImage"];
  additionalSections?: ActivitySectionData[];
}

interface ActivitiesInfoSectionProps {
  data: ActivityInfoData;
  backgroundImage?: string;
  topContent?: React.ReactNode;
}

const ActivitiesInfoSection: React.FC<ActivitiesInfoSectionProps> = ({
  data,
  backgroundImage = "/assets/herobackgrounds/herobanner/corridor.jpg",
  topContent,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasReachedSection, setHasReachedSection] = useState(false);
  const [typedSubtitle, setTypedSubtitle] = useState("");
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasReachedSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasReachedSection(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasReachedSection]);

  useEffect(() => {
    setTypedSubtitle("");
  }, [data.subtitle]);

  useEffect(() => {
    setIsContentVisible(false);

    const frameId = window.requestAnimationFrame(() => {
      setIsContentVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [data.title, data.subtitle]);

  useEffect(() => {
    if (!hasReachedSection || !data.subtitle) return;

    let index = 0;
    const fullText = data.subtitle;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedSubtitle(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(timer);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [hasReachedSection, data.subtitle]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden snap-start bg-[radial-gradient(circle_at_35%_20%,rgba(207,171,87,0.25),rgba(28,25,23,0.96)_52%,rgba(14,14,14,1)_100%)]"
    >
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-none items-start !px-4 !pt-10 !pb-12 md:items-center md:!px-8 md:!pt-20 md:!pb-14 lg:!px-10 lg:!pt-24 lg:!pb-16"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 1, 1, 0.78), rgba(65, 52, 47, 0.78)), url('${backgroundImage}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: isContentVisible ? "center 38%" : "center 72%",
          transition:
            "background-position 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        <div className="relative w-full">
          {topContent ? <div className="!mb-2">{topContent}</div> : null}
          <div
            className={`rounded-[16px] !px-4 !pt-0 !pb-4 transition-all duration-700 ease-out md:!p-6 ${
              isContentVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-14 opacity-0"
            }`}
          >
            <div className="grid gap-2 md:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
              <div
                className={`relative !p-3 transition-all duration-[900ms] ease-out md:!p-4 lg:!mt-10 lg:!p-0 ${
                  isContentVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
              >
                <Suspense fallback={<div className="h-[320px] w-full rounded-[16px] bg-black/20" />}>
                  <ThreeDCube
                    className="!py-2"
                    images={data.images}
                    enableScrollSpin={!hasReachedSection}
                  />
                </Suspense>
              </div>

              <div className="lg:!pt-3">
                <div
                  className={`transition-all duration-[850ms] ease-out ${
                    isContentVisible
                      ? "translate-y-0 opacity-100 delay-100"
                      : "translate-y-24 opacity-0"
                  }`}
                >
                  <SlidingTitleReveal
                    lines={[data.title]}
                    className="max-w-[14ch] text-[32px] leading-[1.05] tracking-tight !text-[var(--color-secondary)] !mb-1 md:text-[46px]"
                    lineClassName="!text-[var(--color-secondary)]"
                  />
                  <span className="block !mt-3 h-[3px] w-16 rounded-full bg-[#CFAB57]" />

                  <p className="text-[16px] !text-[var(--color-secondary)]/85 !mb-5 md:text-[1em]">
                    {typedSubtitle}
                  </p>

                  <p className="max-w-[44ch] text-[1em] leading-8 !text-[var(--color-secondary)]/90 md:text-[1em]">
                    {data.description}
                  </p>

                  <p className="!mt-4 text-[.8em] tracking-[0.16em] uppercase !text-[var(--color-secondary)]/80">
                    What&apos;s Included
                  </p>

                  <ul className="!mt-3 space-y-2 text-[1em] !text-[var(--color-secondary)]/92 md:text-[1em]">
                    {data.whatIncludes.map((item) => (
                      <li key={`${data.title}-${item}`} className="flex items-start gap-2">
                        <span className="!text-[#CFAB57]">*</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {data.timings && (
                    <div className="!mt-6 flex w-[78%] rounded-[16px] !bg-[rgba(255,255,255,0.10)] !p-3 backdrop-blur-md md:w-1/2">
                      <img src="/assets/icons/clock.svg" className="!mr-3" alt="timings" />
                      {data.timings}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesInfoSection;
