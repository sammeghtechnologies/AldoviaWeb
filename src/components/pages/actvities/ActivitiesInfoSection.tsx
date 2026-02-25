import React, { useEffect, useRef, useState } from "react";
import ThreeDCube from "../../ui/ThreeDCube";
import ScrollSelectTabs from "../../ui/ScrollSelectTabs";

const ActivitiesInfoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasReachedSection, setHasReachedSection] = useState(false);
  const activityTabs = ["Indoor", "Outdoor", "Wellness & Spa"];
  const [activeTab, setActiveTab] = useState(activityTabs[2]);

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_35%_20%,rgba(207,171,87,0.25),rgba(28,25,23,0.96)_52%,rgba(14,14,14,1)_100%)]"
    >
      <div className="relative mx-auto w-full max-w-6xl !px-4 !py-12 md:!px-8 md:!py-14 lg:!px-10 lg:!py-16"
       style={{
        backgroundImage:
          "linear-gradient(rgba(14, 1, 1, 0.78), rgba(65, 52, 47, 0.78)), url('/assets/herobackgrounds/herobanner/corridor.jpg')",
      }}>
        <div className="!mb-6 md:!mb-8">
          <ScrollSelectTabs
            items={activityTabs}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <h2 className="max-w-[12ch] text-[42px] leading-[1.05] tracking-tight text-[var(--color-secondary)] !mb-1 md:text-[56px]">
          Exotica Spa &amp; Wellness
        </h2>
        <p className="text-[16px] !text-[var(--color-secondary)]/85 !mb-6 md:text-[20px]">
          Rejuvenate Your Senses
        </p>

        <div className="relative !p-3 md:!p-4">
       
          <ThreeDCube className="!py-2" enableScrollSpin={!hasReachedSection} />
        </div>

        <p className="max-w-[42ch] text-[16px] leading-8 !text-[var(--color-secondary)]/90 !mt-6 md:text-[18px]">
          Indulge in our world-class spa treatments featuring Ayurvedic therapies,
          aromatherapy, and modern wellness practices.
        </p>

        <p className="!mt-4 text-[12px] tracking-[0.16em] uppercase !text-[var(--color-secondary)]/80">
          What&apos;s Included
        </p>

        <ul className="!mt-3 space-y-2 text-[16px] !text-[var(--color-secondary)]/92 md:text-[18px]">
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Signature Massages
          </li>
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Guided Meditation Sessions
          </li>
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Steam, Sauna &amp; Wellness Lounge Access
          </li>
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Signature Massages
          </li>
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Guided Meditation Sessions
          </li>
          <li className="flex items-start gap-2">
            <span className="!text-[#CFAB57]">*</span>
            Steam, Sauna &amp; Wellness Lounge Access
          </li>
        </ul>

      </div>
    </section>
  );
};

export default ActivitiesInfoSection;
