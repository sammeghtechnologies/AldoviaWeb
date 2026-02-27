import React, { useEffect, useMemo, useState } from "react";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";
import ScrollSelectTabs from "../ui/ScrollSelectTabs";

export interface ExperienceInfoImage {
  id: string | number;
  src: string;
  thumb?: string;
}

export interface ExperienceInfoItem {
  id: string;
  packageTab: "Day out package" | "Rooms package" | "Festive package";
  title: string;
  subtitle: string;
  duration?: string;
  price: string;
  priceNote?: string;
  description: string;
  includes: string[];
  ctaLabel?: string;
  images: ExperienceInfoImage[];
}

interface ExperienceInfoSectionProps {
  sections: ExperienceInfoItem[];
}

const ExperienceInfoCard: React.FC<{
  item: ExperienceInfoItem;
  topTabs?: React.ReactNode;
}> = ({
  item,
  topTabs,
}) => {
  const firstImage = item.images[0]?.src ?? "";
  const [activeImage, setActiveImage] = useState(firstImage);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [typedDescription, setTypedDescription] = useState("");

  useEffect(() => {
    setImageScale(1.08);
    const raf = window.requestAnimationFrame(() => {
      setImageScale(1);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [activeImage]);

  useEffect(() => {
    setTypedDescription("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedDescription(item.description.slice(0, index));
      if (index >= item.description.length) {
        window.clearInterval(timer);
      }
    }, 20);

    return () => window.clearInterval(timer);
  }, [item.description]);

  const handleImageChange = (newImage: string) => {
    if (!newImage || newImage === activeImage) return;

    setPrevImage(activeImage);
    setActiveImage(newImage);

    window.setTimeout(() => {
      setPrevImage(null);
    }, 900);
  };

  const activeIndex = Math.max(
    0,
    item.images.findIndex((img) => img.src === activeImage)
  );
  const handlePrevImage = () => {
    if (!item.images.length) return;
    const prevIndex = (activeIndex - 1 + item.images.length) % item.images.length;
    handleImageChange(item.images[prevIndex]?.src ?? "");
  };
  const handleNextImage = () => {
    if (!item.images.length) return;
    const nextIndex = (activeIndex + 1) % item.images.length;
    handleImageChange(item.images[nextIndex]?.src ?? "");
  };

  return (
    <div className="relative w-full max-w-[420px] lg:max-w-none h-screen min-h-screen rounded-none overflow-hidden shadow-2xl">
      {topTabs ? <div className="absolute top-3 left-0 right-0 z-20">{topTabs}</div> : null}

      {prevImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-900 opacity-0"
          style={{ backgroundImage: `url(${prevImage})` }}
        />
      )}

      <div
        key={`${item.id}-${activeImage}`}
        className="absolute inset-0 bg-cover bg-center animate-luxuryFade"
        style={{
          backgroundImage: `url(${activeImage || firstImage})`,
          transform: `scale(${imageScale})`,
          transition: "transform 900ms ease-out",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/42 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/25 to-transparent" />

      <div className="relative !mt-10 z-10 h-full !p-4 md:!p-5 lg:!p-10 !pt-16 md:!pt-18 lg:!pt-24 !pb-4 lg:!pb-10 !text-[var(--color-secondary)]">
        <div className="flex h-full flex-col justify-start lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="w-full max-w-[340px] lg:max-w-[560px] !translate-y-5 lg:!translate-y-0 lg:!translate-x-10 !bg-black/35 lg:!bg-black/25 !rounded-xl !px-3 !py-3 lg:!px-5 lg:!py-5">
            <SlidingTitleReveal
              lines={[item.title]}
              className="font-lust !text-[2em] lg:!text-[56px] !leading-tight !font-medium !mb-1 !text-[var(--color-secondary)]"
              lineClassName="!text-[var(--color-secondary)]"
            />

            <p className="font-area !text-[1em] lg:!text-[18px] !leading-[1.4] !mb-3 !opacity-90 !text-[var(--color-secondary)]">
              {item.subtitle}
            </p>

            {item.duration ? (
              <div className="!mb-3 inline-flex items-center gap-2 rounded-[12px] !bg-white/10 !px-3 !py-1.5 text-[13px] lg:text-[15px] !text-[var(--color-secondary)] backdrop-blur-md">
                <img src="/assets/icons/clock.svg" alt="Duration" className="h-4 w-4 object-contain" />
                <span>{item.duration}</span>
              </div>
            ) : null}

            <h2 className="!mt-6 !text-[2em] lg:!text-[2em] !leading-none !font-semibold !mb-2 !text-[var(--color-secondary)]">
              {item.price}
              {item.priceNote ? (
                <span className="!text-[16px] lg:!text-[22px] !font-normal !text-[var(--color-secondary)]">
                  {" "}
                  {item.priceNote}
                </span>
              ) : null}
            </h2>

            <p className="!mt-6 !text-[.9em] lg:!text-[.9em] !leading-[1.55] !mb-3 !opacity-90 !text-[var(--color-secondary)]">
              {typedDescription}
            </p>

            <ul className="!mt-6 !space-y-1.5 !text-[.9em] lg:!text-[18px] !leading-[1.4] !text-[var(--color-secondary)] lg:grid lg:grid-cols-2 lg:gap-x-6">
              {item.includes.map((includeLine) => (
                <li key={`${item.id}-${includeLine}`} className="flex items-center gap-2 !text-[var(--color-secondary)]">
                  <span className="!text-[var(--color-secondary)]">✔</span>
                  {includeLine}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>

      <div className="!mt-6 absolute !bottom-5 !left-4 lg:!left-22 flex items-end justify-between gap-3 z-20">
        <button className="!px-4 lg:!px-6 !py-2 !rounded-full !bg-white/15 backdrop-blur-md !border !border-white/35 hover:!bg-white/25 transition-all duration-300 !text-[13px] lg:!text-[16px] !text-[var(--color-secondary)]">
          {item.ctaLabel ?? "Book Now"} →
        </button>
      </div>

      <div className="absolute !left-4 md:!left-5 !bottom-4 flex items-center gap-2 lg:hidden z-20">
        {item.images.map((img) => (
          <button
            key={`mobile-${img.id}`}
            onClick={() => handleImageChange(img.src)}
            className={`!w-12 !h-10 rounded-md overflow-hidden !border transition-all duration-500 ${
              activeImage === img.src
                ? "!border-[var(--color-secondary)] scale-110"
                : "!border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <img
              src={img.thumb || img.src}
              alt={`${item.title} thumbnail`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="hidden lg:flex absolute !bottom-10 !right-10 z-20 flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          {item.images.map((img) => (
            <button
              key={img.id}
              onClick={() => handleImageChange(img.src)}
              className={`!w-16 !h-12 rounded-md overflow-hidden !border transition-all duration-500 ${
                activeImage === img.src
                  ? "!border-[var(--color-secondary)] scale-110"
                  : "!border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={img.thumb || img.src}
                alt={`${item.title} thumbnail`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevImage}
            className="h-9 w-9 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-[var(--color-secondary)]"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextImage}
            className="h-9 w-9 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-[var(--color-secondary)]"
            aria-label="Next image"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ExperienceInfoSection({ sections }: ExperienceInfoSectionProps) {
  const packageTabs: Array<ExperienceInfoItem["packageTab"]> = [
    "Day out package",
    "Rooms package",
    "Festive package",
  ];
  const [activeTab, setActiveTab] = useState<ExperienceInfoItem["packageTab"]>(packageTabs[0]);
  const filteredSections = useMemo(
    () => (sections ?? []).filter((item) => item.packageTab === activeTab),
    [sections, activeTab]
  );
  if (!sections?.length) return null;

  return (
    <section className="w-full flex flex-col items-center gap-0 !pb-0 md:!pb-0">
      {filteredSections.map((item, index) => (
        <ExperienceInfoCard
          key={item.id}
          item={item}
          topTabs={
            index === 0 ? (
              <ScrollSelectTabs
                items={packageTabs}
                active={activeTab}
                onChange={(value) => setActiveTab(value as ExperienceInfoItem["packageTab"])}
                disableDesktopShift
              />
            ) : undefined
          }
        />
      ))}
    </section>
  );
}
