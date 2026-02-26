import React, { useEffect, useRef, useState } from "react";
import ThreeDCube from "../../ui/ThreeDCube";
import SlidingTitleReveal from "../../ui/SlidingTitleReveal";

export interface ActivitySectionData {
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  whatIncludes: string[];
  backgroundImage?: string;
}

export interface ActivityInfoData {
  title: ActivitySectionData["title"];
  subtitle: ActivitySectionData["subtitle"];
  images: ActivitySectionData["images"];
  description: ActivitySectionData["description"];
  whatIncludes: ActivitySectionData["whatIncludes"];
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
      className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_35%_20%,rgba(207,171,87,0.25),rgba(28,25,23,0.96)_52%,rgba(14,14,14,1)_100%)]"
    >
      <div
        className={`relative mx-auto w-full max-w-none !px-4 md:!px-8 lg:!px-10 ${
          topContent
            ? "!pt-2 !pb-12 md:!pt-3 md:!pb-14 lg:!pt-4 lg:!pb-16"
            : "!py-12 md:!py-14 lg:!py-16"
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(14, 1, 1, 0.78), rgba(65, 52, 47, 0.78)), url('${backgroundImage}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {topContent ? <div className="!mb-2">{topContent}</div> : null}

        <div className="rounded-[16px] !p-4 md:!p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
            <div className="relative !p-3 md:!p-4 lg:!p-0 lg:!mt-10">
              <ThreeDCube
                className="!py-2"
                images={data.images}
                enableScrollSpin={!hasReachedSection}
              />
            </div>

            <div className="lg:!pt-3">
              <SlidingTitleReveal
                lines={[data.title]}
                className="max-w-[14ch] text-[32px] leading-[1.05] tracking-tight !text-[var(--color-secondary)] !mb-1 md:text-[46px]"
                lineClassName="!text-[var(--color-secondary)]"
              />

              <p className="text-[16px] !text-[var(--color-secondary)]/85 !mb-5 md:text-[20px]">
                {typedSubtitle}
              </p>

              <p className="max-w-[42ch] text-[16px] leading-8 !text-[var(--color-secondary)]/90 md:text-[18px]">
                {data.description}
              </p>

              <p className="!mt-4 text-[12px] tracking-[0.16em] uppercase !text-[var(--color-secondary)]/80">
                What&apos;s Included
              </p>

              <ul className="!mt-3 space-y-2 text-[16px] !text-[var(--color-secondary)]/92 md:text-[18px]">
                {data.whatIncludes.map((item) => (
                  <li key={`${data.title}-${item}`} className="flex items-start gap-2">
                    <span className="!text-[#CFAB57]">*</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesInfoSection;
