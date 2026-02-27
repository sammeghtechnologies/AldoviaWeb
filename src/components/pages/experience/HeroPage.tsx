import React from "react";
import { useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import ExperienceInfoSection, { type ExperienceInfoItem } from "../../sections/ExperienceInfoSection";
import Footer from "../../sections/Footer";

const ExperienceHeroPage: React.FC = () => {
  const navigate = useNavigate();
  const experienceImages = [
    "/assets/herobackgrounds/dining/ambrosia.webp",
    "/assets/herobackgrounds/dining/Buvette.jpg",
    "/assets/herobackgrounds/activities/activity2.jpg",
  ];
  const infoSections: ExperienceInfoItem[] = [
    {
      id: "gold-package",
      packageTab: "Day out package",
      title: "Gold Package",
      subtitle: "Curated Day-out experience",
      duration: "Full Day",
      price: "₹4,800",
      priceNote: "+ taxes",
      description:
        "Indulge in a luxurious couples spa experience with aromatherapy and relaxation techniques.",
      includes: [
        "Welcome drink, Buffet Lunch, Hi-tea, Dinner",
        "All Indoor and Outdoor Activities",
        "Pool and wellness access",
        "Steam & Sauna access",
        "Herbal tea & refreshments",
        "Private treatment room"
      ],
      ctaLabel: "Book Gold",
      images: [
        {
          id: 1,
          src: "/assets/herobackgrounds/dining/ambrosia.webp",
          thumb: "/assets/herobackgrounds/dining/ambrosia.webp",
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
      id: "Candlelight Dinner",
      packageTab: "Day out package",
      title: "Candlelight Dinner",
      subtitle: "Romance Under Soft Candlelight",
      duration: "3-4 Hours",
      price: "₹3,600",
      priceNote: "+ taxes",
      description:
        "An intimate dining experience designed for unforgettable moments. Surrounded by soft candlelight, elegant décor, and personalized service, the setting creates the perfect atmosphere for romantic evenings, celebrations, and cherished conversations over exquisite cuisine.",
      includes: [
        "Candlelight private setup",
        "5-course gourmet menu",
        "Live music on select nights",
        "Complimentary wine pairing"
      ],
      ctaLabel: "Book Candlelight",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/Buvette.jpg", thumb: "/assets/herobackgrounds/dining/Buvette.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity1.jpg", thumb: "/assets/herobackgrounds/activities/activity1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/ambrosia.webp", thumb: "/assets/herobackgrounds/dining/ambrosia.webp" },
      ],
    },
    {
      id: "diamond-dayout-package",
      packageTab: "Day out package",
      title: "Diamond Day-out",
      subtitle: "Premium all-day indulgence",
      duration: "Full Day",
      price: "₹6,200",
      priceNote: "+ taxes",
      description:
        "Elevated day-out with premium dining benefits, wellness access, and added curated experiences.",
      includes: [
        "Welcome drink, Breakfast, lunch, hi-tea, dinner",
        "All Indoor and Outdoor Activities",
        "Pool and wellness access",
        "Steam & Sauna access",
        "Herbal tea & refreshments",
        "Private treatment room"
      ],
      ctaLabel: "Book Diamond",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.webp", thumb: "/assets/herobackgrounds/dining/ambrosia.webp" },
        { id: 2, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
      ],
    },
    {
      id: "urban-getaway",
      packageTab: "Rooms package",
      title: "Urban Getaway",
      subtitle: "The City Escape",
      duration: "1 Night / 2 Days",
      price: "₹8,900",
      priceNote: "+ taxes",
      description:
        "One night at Aldovia. That is all it takes to reset. The Urban Getaway is built for couples and solo travelers who need distance from the city without the logistics of a long trip. Check in, slow down, check out different.",
      includes: [
        "1 night luxury accommodation",
        "Breakfast for two",
        "Access to pool and fitness center",
        "Late checkout (subject to availability)"
      ],
      ctaLabel: "Book Urban",
      images: [
        {
          id: 1,
          src: "/assets/herobackgrounds/dining/Buvette1.jpg",
          thumb: "/assets/herobackgrounds/dining/Buvette1.jpg",
        },
        {
          id: 2,
          src: "/assets/herobackgrounds/dining/ambrosia.webp",
          thumb: "/assets/herobackgrounds/dining/ambrosia.webp",
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
      title: "Family Funtastic",
      subtitle: "The Weekend They Will Remember",
      duration: "2 Nights / 3 Days",
      price: "₹7,400",
      priceNote: "+ taxes",
      description:
        "A weekend package that gives the children everything they want and the parents everything they need. Activities, dining, pool time, and enough space to let everyone find their own rhythm.",
      includes: [
        "2 nights family accommodation",
        "Breakfast and dinner daily",
        "Kids Club access",
        "Pool and activity access",
        "One complimentary spa session for adults"
      ],
      ctaLabel: "Book Funtastic",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity1.jpg", thumb: "/assets/herobackgrounds/activities/activity1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/Buvette.jpg", thumb: "/assets/herobackgrounds/dining/Buvette.jpg" },
      ],
    },
    {
      id: "royal-rooms-package",
      packageTab: "Rooms package",
      title: "Weekend Escape",
      subtitle: "48 Hours of Nothing You Have To Do",
      duration: "2 Nights / 3 Days",
      price: "₹11,800",
      priceNote: "+ taxes",
      description:
        "No itinerary. No meetings. No obligations. The Weekend Escape is two nights of doing exactly what you want, whether that is sitting by the pool, eating three different meals at three different restaurants, or simply sleeping in a bed that someone else makes.",
      includes: [
        "2 nights luxury accommodation",
        "All meals included",
        "Spa credit",
        "Activitu access"
      ],
      ctaLabel: "Book Weekend",
      images: [
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.webp", thumb: "/assets/herobackgrounds/dining/ambrosia.webp" },
        { id: 2, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
        { id: 3, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
      ],
    },
    {
      id: "festive-package",
      packageTab: "Festive package",
      title: "Rock the Season",
      subtitle: "Celebration-ready seasonal package",
      duration: "2 Nights / 3 Days",
      price: "₹12,500",
      priceNote: "+ taxes",
      description:
        "Celebrate the festive season with specially curated experiences, themed decorations, and exclusive events. The kind of holiday where the resort does all the planning and you do all the living.",
      includes: [
        "2 nights luxury accommodation",
        "Festive themed dinner",
        "Live entertainment",
        "Welcome drinks & amenities",
        "Exclusive festive activities",
        "Access to all resort facilities"
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
      duration: "1 Day",
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
      duration: "2 Nights / 3 Days",
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
        { id: 1, src: "/assets/herobackgrounds/dining/ambrosia.webp", thumb: "/assets/herobackgrounds/dining/ambrosia.webp" },
        { id: 2, src: "/assets/herobackgrounds/dining/Buvette1.jpg", thumb: "/assets/herobackgrounds/dining/Buvette1.jpg" },
        { id: 3, src: "/assets/herobackgrounds/activities/activity2.jpg", thumb: "/assets/herobackgrounds/activities/activity2.jpg" },
      ],
    },
  ];

  return (
    <section className="relative min-h-screen w-full">
      <MenuFrame showBookNow={false} />
      <div className="absolute left-5 top-24 z-[2147483645] md:left-8 md:top-26">
        <HeroBreadcrumb
          label="Experience"
          onHomeClick={() => navigate("/home")}
        />
      </div>
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
