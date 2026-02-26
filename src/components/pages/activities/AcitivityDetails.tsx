import React, { useMemo, useState } from "react";
import ScrollSelectTabs from "../../ui/ScrollSelectTabs";
import ActivitiesInfoSection from "./ActivitiesInfoSection";
import type { ActivityInfoData } from "./ActivitiesInfoSection";

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
      backgroundImage: activeData.backgroundImage,
    };

    const additionalSections: ActivityInfoData[] = (activeData.additionalSections ?? []).map(
      (section) => ({
        title: section.title,
        subtitle: section.subtitle,
        images: section.images,
        description: section.description,
        whatIncludes: section.whatIncludes,
        backgroundImage: section.backgroundImage,
      })
    );

    return [primarySection, ...additionalSections];
  }, [activeData]);

  if (!activeData) return null;

  return (
    <section className="relative w-full">
      {activeSections.map((sectionData, index) => (
        <ActivitiesInfoSection
          key={`${sectionData.title}-${index}`}
          data={sectionData}
          backgroundImage={sectionData.backgroundImage ?? backgroundImage}
          topContent={
            index === 0 ? (
              <div className="mx-auto flex w-full max-w-6xl justify-center !px-0 !pt-0 !pb-2 md:!px-0 lg:!px-0">
                <ScrollSelectTabs
                  items={tabs}
                  active={activeTab}
                  onChange={setActiveTab}
                  floatingOnScroll
                />
              </div>
            ) : undefined
          }
        />
      ))}
    </section>
  );
};

export default AcitivityDetails;
