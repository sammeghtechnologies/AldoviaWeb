import React, { useEffect, useMemo, useRef, useState } from "react";
import ScrollSelectTabs from "../../ui/ScrollSelectTabs";
import ActivitiesInfoSection from "./ActivitiesInfoSection";
import type { ActivityInfoData } from "./ActivitiesInfoSection";

const ACTIVITY_SCROLL_LOCK_MS = 700;
const ACTIVITY_SCROLL_STEP_PX = 220;

export interface AcitivityDetailItem extends ActivityInfoData {
  tab: string;
}

interface AcitivityDetailsProps {
  details: AcitivityDetailItem[];
  backgroundImage?: string;
  defaultTab?: string;
}

const AcitivityDetails: React.FC<AcitivityDetailsProps> = ({
  details,
  backgroundImage,
  defaultTab,
}) => {
  const tabs = useMemo(() => details.map((item) => item.tab), [details]);
  const initialTab = defaultTab && tabs.includes(defaultTab) ? defaultTab : tabs[0] ?? "";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const containerRef = useRef<HTMLElement | null>(null);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const lastWheelDirectionRef = useRef(0);
  const activeSectionIndexRef = useRef(0);

  const activeData = useMemo(() => {
    return details.find((item) => item.tab === activeTab) ?? details[0];
  }, [activeTab, details]);

  const activeSections = useMemo<ActivityInfoData[]>(() => {
    if (!activeData) return [];

    const primarySection: ActivityInfoData = {
      title: activeData.title,
      subtitle: activeData.subtitle,
      images: activeData.images,
      description: activeData.description,
      whatIncludes: activeData.whatIncludes,
      timings: activeData.timings,
      backgroundImage: activeData.backgroundImage,
    };

    const additionalSections: ActivityInfoData[] = (activeData.additionalSections ?? []).map(
      (section) => ({
        title: section.title,
        subtitle: section.subtitle,
        images: section.images,
        description: section.description,
        whatIncludes: section.whatIncludes,
        timings: section.timings,
        backgroundImage: section.backgroundImage,
      })
    );

    return [primarySection, ...additionalSections];
  }, [activeData]);

  useEffect(() => {
    activeSectionIndexRef.current = activeSectionIndex;
  }, [activeSectionIndex]);

  useEffect(() => {
    setActiveSectionIndex(0);
    activeSectionIndexRef.current = 0;
    wheelLockRef.current = false;
    lastWheelDirectionRef.current = 0;
  }, [activeTab]);

  useEffect(() => {
    const sectionRoot = containerRef.current;
    const sectionCount = activeSections.length;
    if (!sectionRoot || sectionCount <= 1) return;

    let wheelDelta = 0;

    const releaseLock = () => {
      window.setTimeout(() => {
        wheelLockRef.current = false;
        wheelDelta = 0;
      }, ACTIVITY_SCROLL_LOCK_MS);
    };

    const isSectionPinned = () => {
      const rect = sectionRoot.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= window.innerHeight;
    };

    const shouldReleaseScroll = (index: number, direction: number) => {
      return (index === 0 && direction < 0) || (index === sectionCount - 1 && direction > 0);
    };

    const onWheel = (event: WheelEvent) => {
      if (!isSectionPinned() || wheelLockRef.current) return;

      const immediateDirection = Math.sign(event.deltaY);
      if (
        immediateDirection !== 0 &&
        shouldReleaseScroll(activeSectionIndexRef.current, immediateDirection)
      ) {
        lastWheelDirectionRef.current = 0;
        wheelDelta = 0;
        return;
      }

      if (immediateDirection !== 0 && lastWheelDirectionRef.current !== immediateDirection) {
        wheelDelta = 0;
      }

      wheelDelta += event.deltaY;
      lastWheelDirectionRef.current = immediateDirection;

      if (
        activeSectionIndexRef.current === 0 ||
        activeSectionIndexRef.current === sectionCount - 1
      ) {
        if (Math.abs(wheelDelta) < ACTIVITY_SCROLL_STEP_PX) {
          return;
        }
      }

      if (Math.abs(wheelDelta) < ACTIVITY_SCROLL_STEP_PX) {
        event.preventDefault();
        return;
      }

      const direction = wheelDelta > 0 ? 1 : -1;

      if (shouldReleaseScroll(activeSectionIndexRef.current, direction)) {
        lastWheelDirectionRef.current = 0;
        wheelDelta = 0;
        return;
      }

      setActiveSectionIndex((currentIndex) => {
        const nextIndex = Math.min(sectionCount - 1, Math.max(0, currentIndex + direction));

        if (nextIndex === currentIndex) {
          return currentIndex;
        }

        event.preventDefault();
        wheelLockRef.current = true;
        activeSectionIndexRef.current = nextIndex;
        releaseLock();
        return nextIndex;
      });

      wheelDelta = 0;
      lastWheelDirectionRef.current = 0;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isSectionPinned() || wheelLockRef.current || touchStartYRef.current === null) return;

      const currentY = event.touches[0]?.clientY;
      if (typeof currentY !== "number") return;

      const deltaY = touchStartYRef.current - currentY;
      if (Math.abs(deltaY) < ACTIVITY_SCROLL_STEP_PX * 0.5) return;

      const direction = deltaY > 0 ? 1 : -1;

      if (shouldReleaseScroll(activeSectionIndexRef.current, direction)) {
        touchStartYRef.current = currentY;
        return;
      }

       if (
        (activeSectionIndexRef.current === 0 || activeSectionIndexRef.current === sectionCount - 1) &&
        Math.abs(deltaY) < ACTIVITY_SCROLL_STEP_PX * 0.5
      ) {
        return;
      }

      setActiveSectionIndex((currentIndex) => {
        const nextIndex = Math.min(sectionCount - 1, Math.max(0, currentIndex + direction));

        if (nextIndex === currentIndex) {
          return currentIndex;
        }

        wheelLockRef.current = true;
        activeSectionIndexRef.current = nextIndex;
        releaseLock();
        return nextIndex;
      });

      touchStartYRef.current = currentY;
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeSections]);

  if (!activeData) return null;

  const displayedSection = activeSections[activeSectionIndex] ?? activeSections[0];
  const desktopHeightStyle =
    activeSections.length > 1 ? { minHeight: `${activeSections.length * 100}vh` } : undefined;

  return (
    <section ref={containerRef} className="relative w-full" style={desktopHeightStyle}>
      <div className="sticky top-0 h-screen">
        <div className="relative">
          <ActivitiesInfoSection
            key={`${activeTab}-${displayedSection.title}-${activeSectionIndex}`}
            data={displayedSection}
            backgroundImage={displayedSection.backgroundImage ?? backgroundImage}
            topContent={
              <div className="relative mx-auto flex w-full justify-center !px-0 !pt-0 !pb-2 md:w-full md:!px-0 lg:!px-0 lg:w-screen lg:left-1/2 lg:-translate-x-1/2">
                <ScrollSelectTabs
                  items={tabs}
                  active={activeTab}
                  onChange={setActiveTab}
                  floatingOnScroll
                  floatingClassName="sticky top-4 z-[140] lg:top-4 lg:!w-[min(92vw,1320px)] lg:!mx-auto"
                  innerWrapperClassName="!mx-auto !w-full !max-w-none lg:!w-full"
                />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default AcitivityDetails;
