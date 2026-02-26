import React from "react";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import ExperienceInfoSection, { type ExperienceInfoItem } from "../../sections/ExperienceInfoSection";
import Footer from "../../sections/Footer";

const ExperienceHeroPage: React.FC = () => {
  const experienceImages = [
    "/assets/herobackgrounds/dining/ambrosia.jpg",
    "/assets/herobackgrounds/dining/Buvette.jpg",
    "/assets/herobackgrounds/activities/activity2.jpg",
  ];
  const infoSections: ExperienceInfoItem[] = [
    {
      id: "gold-package",
      packageTab: "Day out package",
      title: "Gold Package",
      subtitle: "Curated Day-out experience",
      price: "₹4,800",
      priceNote: "+ taxes",
      description:
        "Enjoy a complete day retreat with curated meals, recreation access, and premium hospitality throughout your stay.",
      includes: [
        "Welcome drink, Buffet Lunch, Hi-tea, Dinner",
        "All Indoor and Outdoor Activities",
        "Pool and wellness access",
      ],
      ctaLabel: "Book Gold",
      images: [
        {
          id: 1,
          src: "/assets/herobackgrounds/dining/ambrosia.jpg",
          thumb: "/assets/herobackgrounds/dining/ambrosia.jpg",
        },
        {
          id: 2,
          src: "/assets/herobackgrounds/dining/Buvette.jpg",
          thumb: "/assets/herobackgrounds/dining/Buvette.jpg",
        },
        {
          id: 3,
          src: "/assets/herobackgrounds/activities/activity2.jpg",
          thumb: "/assets/herobackgrounds/activities/activity2.jpg",
        },
      ],
    },
    {
      id: "silver-dayout-package",
      packageTab: "Day out package",
      title: "Silver Day-out",
      subtitle: "Relaxed daytime escape",
      price: "₹3,600",
      priceNote: "+ taxes",
      description:
        "A value day-out plan with curated meals and access to key leisure amenities across the property.",
      includes: [
        "Welcome drink and lunch",
        "Indoor activities access",
        "Poolside leisure time",
      ],
      ctaLabel: "Book Silver",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/Buvette.jpg", thumb: "/assets/herobackgrounds/dining/Buvette.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity1.jpg", thumb: "/assets/herobackgrounds/activities/activity1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/ambrosia.jpg", thumb: "/assets/herobackgrounds/dining/ambrosia.jpg" },
      ],
    },
    {
      id: "diamond-dayout-package",
      packageTab: "Day out package",
      title: "Diamond Day-out",
      subtitle: "Premium all-day indulgence",
      price: "₹6,200",
      priceNote: "+ taxes",
      description:
        "Elevated day-out with premium dining benefits, wellness access, and added curated experiences.",
      includes: [
        "Breakfast, lunch, hi-tea, dinner",
        "Indoor + outdoor activities",
        "Wellness and spa credits",
      ],
      ctaLabel: "Book Diamond",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.jpg", thumb: "/assets/herobackgrounds/dining/ambrosia.jpg" },
        { id: 2, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
      ],
    },
    {
      id: "platinum-package",
      packageTab: "Rooms package",
      title: "Platinum Package",
      subtitle: "Luxury stay and celebration bundle",
      price: "₹8,900",
      priceNote: "+ taxes",
      description:
        "Upgrade to premium inclusions with exclusive dining moments, spa sessions, and elevated accommodation benefits.",
      includes: [
        "Premium room stay benefits",
        "Chef-curated dining experience",
        "Spa and wellness therapies",
      ],
      ctaLabel: "Book Platinum",
      images: [
        {
          id: 1,
          src: "/assets/herobackgrounds/dining/Buvette1.jpg",
          thumb: "/assets/herobackgrounds/dining/Buvette1.jpg",
        },
        {
          id: 2,
          src: "/assets/herobackgrounds/dining/ambrosia.jpg",
          thumb: "/assets/herobackgrounds/dining/ambrosia.jpg",
        },
        {
          id: 3,
          src: "/assets/herobackgrounds/activities/activity1.jpg",
          thumb: "/assets/herobackgrounds/activities/activity1.jpg",
        },
      ],
    },
    {
      id: "deluxe-rooms-package",
      packageTab: "Rooms package",
      title: "Deluxe Stay Package",
      subtitle: "Comfort-first room experience",
      price: "₹7,400",
      priceNote: "+ taxes",
      description:
        "A balanced stay package with elegant rooms, breakfast inclusions, and access to resort facilities.",
      includes: [
        "Deluxe room accommodation",
        "Daily breakfast",
        "Access to leisure amenities",
      ],
      ctaLabel: "Book Deluxe",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity1.jpg", thumb: "/assets/herobackgrounds/activities/activity1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/Buvette.jpg", thumb: "/assets/herobackgrounds/dining/Buvette.jpg" },
      ],
    },
    {
      id: "royal-rooms-package",
      packageTab: "Rooms package",
      title: "Royal Suite Package",
      subtitle: "Signature luxury retreat",
      price: "₹11,800",
      priceNote: "+ taxes",
      description:
        "A premium suite package with luxury room benefits, curated dining, and enhanced personalized service.",
      includes: [
        "Suite category stay",
        "Curated dinner experience",
        "Priority concierge support",
      ],
      ctaLabel: "Book Royal",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.jpg", thumb: "/assets/herobackgrounds/dining/ambrosia.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
      ],
    },
    {
      id: "festive-package",
      packageTab: "Festive package",
      title: "Festive Package",
      subtitle: "Celebration-ready seasonal package",
      price: "₹12,500",
      priceNote: "+ taxes",
      description:
        "Celebrate special occasions with festive decor, curated feasts, and event-ready hospitality tailored for family and group gatherings.",
      includes: [
        "Decor and festive setup assistance",
        "Curated lunch and dinner menus",
        "Indoor-outdoor recreation access",
      ],
      ctaLabel: "Book Festive",
      images: [
        {
          id: 1,
          src: "/assets/herobackgrounds/dining/Buvette.jpg",
          thumb: "/assets/herobackgrounds/dining/Buvette.jpg",
        },
        {
          id: 2,
          src: "/assets/herobackgrounds/dining/Buvette1.jpg",
          thumb: "/assets/herobackgrounds/dining/Buvette1.jpg",
        },
        {
          id: 3,
          src: "/assets/herobackgrounds/activities/activity3.jpg",
          thumb: "/assets/herobackgrounds/activities/activity3.jpg",
        },
      ],
    },
    {
      id: "celebration-festive-package",
      packageTab: "Festive package",
      title: "Celebration Package",
      subtitle: "Family and group celebrations",
      price: "₹9,900",
      priceNote: "+ taxes",
      description:
        "Celebrate with festive meal plans, curated setup support, and access to activity spaces for group fun.",
      includes: [
        "Festive lunch and dinner spreads",
        "Decor setup assistance",
        "Group activities access",
      ],
      ctaLabel: "Book Celebration",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/Buvette.jpg", thumb: "/assets/herobackgrounds/dining/Buvette.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity3.jpg", thumb: "/assets/herobackgrounds/activities/activity3.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
      ],
    },
    {
      id: "grand-festive-package",
      packageTab: "Festive package",
      title: "Grand Festive Package",
      subtitle: "Large-scale festive hosting",
      price: "₹15,500",
      priceNote: "+ taxes",
      description:
        "Designed for bigger occasions with enhanced event support, expanded menus, and premium guest experiences.",
      includes: [
        "Premium festive decor support",
        "Expanded curated dining menus",
        "Priority event coordination",
      ],
      ctaLabel: "Book Grand",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.jpg", thumb: "/assets/herobackgrounds/dining/ambrosia.jpg" },
        { id: 2, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
      ],
    },
  ];

  return (
    <section className="relative min-h-screen w-full">
      <MenuFrame showBookNow={false} />
      <AnimatedImageHero
        images={experienceImages}
        title="Experiences & Packages"
        subtitle="Explore curated stays, celebrations, dining, and signature moments."
        buttonLabel="Explore Experiences"
        enableEntryAnimation
        entryDuration={2.1}
        enableStaggeredTitle
        enableTypingSubtitle
        centerContentClassName="-translate-y-10 lg:translate-y-0 lg:!w-full lg:!mx-auto lg:text-center [&_h1]:!text-[var(--color-secondary)] [&_h1_*]:!text-[var(--color-secondary)] [&_p]:!mt-3"
        controlsWrapperClassName="absolute bottom-[10%] left-1/2 z-30 w-[min(92%,520px)] -translate-x-1/2"
        controlsClassName="!mt-0 !px-0"
        controlsProgressBarClassName="!w-[140px] !max-w-[140px] shrink-0"
      />
      <ExperienceInfoSection sections={infoSections} />
      <Footer/>
    </section>
  );
};

export default ExperienceHeroPage;
