import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import CarouselCards from "../../ui/CarouselCardEvents";
import SplitActionButtons from "../../ui/SplitActionButtons";
import StartPlanEventModal from "../../ui/StartPlanEventModal";
import EventDetailsModal from "../../ui/EventDetailsModal";

type VenueCard = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  dimensions: {
    area: string;
    height: string;
    width: string;
    length: string;
  };
  seating: {
    theater: string;
    ushape: string;
    classroom: string;
    boardroom: string;
    cluster: string;
    cocktails: string;
    round: string;
  };
  capacity: string;
};

const defaultVenueImages = [
  "assets/herobackgrounds/herobanner/galaxy1.jpg",
  "assets/herobackgrounds/herobanner/corridor.jpg",
  "assets/herobackgrounds/herobanner/lotus.jpg",
];

const weddingImages = [
  "/assets/herobackgrounds/wedding/wedding1.jpg",
  "/assets/herobackgrounds/wedding/wedding2.jpg",
  "/assets/herobackgrounds/wedding/wedding3.jpg",
  "/assets/herobackgrounds/wedding/wedding4.JPG",
];
const corporateImages = [
  "/assets/herobackgrounds/corporate/corporate1.jpg",
  "/assets/herobackgrounds/corporate/corporate2.jpg",
  "/assets/herobackgrounds/corporate/corporate3.jpg",
];
const herobackgroundsSectionBg = "/assets/backgrounds/swanbrown.png";

const venueTabs = [
  "Galaxy Grand Ballroom",
  "Emerald Hall",
  "Royal Pavilion",
  "Sapphire Lounge",
  "Crystal Court",
  "Diamond Arena",
] as const;

type VenueTab = (typeof venueTabs)[number];
type VenueDimensions = {
  area: string;
  height: string;
  width: string;
  length: string;
};

type herobackgroundseating = {
  theater: string;
  ushape: string;
  classroom: string;
  boardroom: string;
  cluster: string;
  cocktails: string;
  round: string;
};

type VenueTabContent = {
  subtitle: string;
  description: string;
  dimensions: VenueDimensions;
  seating: herobackgroundseating;
};

const parseSeaterCount = (value: string) => {
  const numeric = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 100;
};

const venueContentByTab: Record<VenueTab, VenueTabContent> = {
  "Galaxy Grand Ballroom": {
    subtitle: "Opulent Celebrations & Galas",
    description:
      "Spacious and versatile venue is ideal for large-scale events, from glamorous weddings to corporate galas.",

    dimensions: {
      area: "1,29,065 sq.ft",
      height: "21 ft",
      width: "311 ft",
      length: "415 ft",
    },

    seating: {
      theater: "3000",
      ushape: "450",
      classroom: "1800",
      boardroom: "250",
      cluster: "1200",
      cocktails: "3500",
      round: "2000",
    },
  },

  "Emerald Hall": {
    subtitle: "Elegant Receptions & Ceremonies",
    description:
      "A luxurious venue crafted for high-style receptions, engagement ceremonies, and timeless social evenings.",

    dimensions: {
      area: "95,400 sq.ft",
      height: "18 ft",
      width: "240 ft",
      length: "330 ft",
    },

    seating: {
      theater: "2200",
      ushape: "320",
      classroom: "1400",
      boardroom: "180",
      cluster: "950",
      cocktails: "2600",
      round: "1500",
    },
  },

  "Royal Pavilion": {
    subtitle: "Grand Banquets & Conferences",
    description:
      "Designed for premium banquets and business events with expansive floor space and refined architecture.",

    dimensions: {
      area: "78,250 sq.ft",
      height: "20 ft",
      width: "210 ft",
      length: "280 ft",
    },

    seating: {
      theater: "1800",
      ushape: "280",
      classroom: "1100",
      boardroom: "160",
      cluster: "800",
      cocktails: "2100",
      round: "1200",
    },
  },

  "Sapphire Lounge": {
    subtitle: "Intimate Premium Events",
    description:
      "A polished space for private events, curated parties, and executive social evenings.",

    dimensions: {
      area: "38,900 sq.ft",
      height: "14 ft",
      width: "150 ft",
      length: "210 ft",
    },

    seating: {
      theater: "850",
      ushape: "120",
      classroom: "500",
      boardroom: "90",
      cluster: "350",
      cocktails: "1100",
      round: "600",
    },
  },

  "Crystal Court": {
    subtitle: "Refined Mid-Scale Gatherings",
    description:
      "Elegant design and adaptable seating create an ideal setting for refined social and corporate events.",

    dimensions: {
      area: "45,700 sq.ft",
      height: "16 ft",
      width: "170 ft",
      length: "230 ft",
    },

    seating: {
      theater: "1050",
      ushape: "160",
      classroom: "650",
      boardroom: "120",
      cluster: "450",
      cocktails: "1300",
      round: "750",
    },
  },

  "Diamond Arena": {
    subtitle: "Large-Format Productions",
    description:
      "Built for massive productions, entertainment showcases, and full-scale wedding spectacles.",

    dimensions: {
      area: "1,42,500 sq.ft",
      height: "28 ft",
      width: "350 ft",
      length: "450 ft",
    },

    seating: {
      theater: "4200",
      ushape: "600",
      classroom: "2500",
      boardroom: "400",
      cluster: "1800",
      cocktails: "5000",
      round: "3000",
    },
  },
};

const venueImagesByTab: Record<VenueTab, string[]> = {
  "Galaxy Grand Ballroom": [
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
    "/assets/herobackgrounds/herobanner/corridor.jpg",
  ],
  "Emerald Hall": [
    "/assets/herobackgrounds/herobanner/orchid.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
    "/assets/herobackgrounds/herobanner/corridor.jpg"
  ],
  "Royal Pavilion": [
    "/assets/herobackgrounds/herobanner/lotus.jpg",
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
  ],
  "Sapphire Lounge": [
    "/assets/herobackgrounds/herobanner/corridor.jpg",
    "/assets/herobackgrounds/herobanner/lotus.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
  ],
  "Crystal Court": [
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/corridor.jpg",
    "/assets/herobackgrounds/herobanner/lotus.jpg",
  ],
  "Diamond Arena": [
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/lotus.jpg",
  ],
};

const venueCardsByTab: Record<VenueTab, VenueCard[]> = venueTabs.reduce(
  (acc, tab) => {
    const content = venueContentByTab[tab];
    const idPrefix = tab.toLowerCase().replace(/\s+/g, "-");
    acc[tab] = venueImagesByTab[tab].map((image, index) => ({
      id: `${idPrefix}-${index + 1}`,
      image,
      title: tab,
      subtitle: content.subtitle,
      description: content.description,
      dimensions: content.dimensions,
      seating: content.seating,
      capacity: `${content.seating.theater} seater`,
    }));
    return acc;
  },
  {} as Record<VenueTab, VenueCard[]>
);

const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageMode =
    location.state?.mode === "wedding"
      ? "wedding"
      : location.state?.mode === "corporate"
        ? "corporate"
        : "venue";
  const heroImages =
    pageMode === "wedding" ? weddingImages : pageMode === "corporate" ? corporateImages : defaultVenueImages;
  const heroTitle =
    pageMode === "wedding"
      ? "Crafted Around Your Love Story."
      : pageMode === "corporate"
        ? "Your professional Event Destination"
        : "Our Venues";
  const heroSubtitle =
    pageMode === "wedding"
      ? "Savour the finest flavours in our curated dining destination"
      : pageMode === "corporate"
        ? "state-of-the-art facilities for conferences, offsites, and team building"
      : "Savor the finest flavors in our curated dining destinations.";
  const breadcrumbLabel =
    pageMode === "wedding" ? "Weddings" : pageMode === "corporate" ? "Corporate Events" : "Venues";
  const handleRequestProposal = () => {
    if (pageMode === "wedding") {
      setSelectedEventType("Wedding");
      setDetailsOpen(true);
      return;
    }
    if (pageMode === "corporate") {
      setSelectedEventType("Corporate");
      setDetailsOpen(true);
      return;
    }
    setOpen(true);
  };
  const [active, setActive] = useState<(typeof venueTabs)[number]>(
    "Galaxy Grand Ballroom"
  );
  const selectedCards = venueCardsByTab[active];
  const handleTabChange = (value: string) => {
    if (venueTabs.includes(value as (typeof venueTabs)[number])) {
      setActive(value as (typeof venueTabs)[number]);
    }
  };

  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("Wedding");
  const [showSplitActions, setShowSplitActions] = useState(false);
  const venueMaxGuestsByTab = venueTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab] = parseSeaterCount(venueContentByTab[tab].seating.theater);
    return acc;
  }, {});

  useEffect(() => {
    const onScroll = () => {
      setShowSplitActions(window.scrollY > window.innerHeight * 0.9);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  return (
    <>
      <MenuFrame showBookNow={false} />
      <div className="absolute left-5 top-24 z-[2147483645] md:left-8 md:top-26">
        <HeroBreadcrumb
          label={breadcrumbLabel}
          onHomeClick={() => navigate("/home")}
        />
      </div>
      <AnimatedImageHero
        images={heroImages}
        title={heroTitle}
        subtitle={heroSubtitle}
        buttonLabel="Plan Your Event"
        onButtonClick={handleRequestProposal}
        enableTypingSubtitle
        centerContentClassName="-translate-y-10 lg:translate-y-0 lg:!w-full lg:!mx-auto lg:text-center "
        controlsWrapperClassName="absolute bottom-[10%] left-1/2 z-30 w-[min(92%,520px)] -translate-x-1/2"
        controlsClassName="!mt-0 !px-0"
        controlsProgressBarClassName="!w-[140px] !max-w-[140px] shrink-0"
      />

      <section className="w-full" >
        <CarouselCards
          items={selectedCards}
          sectionBackgroundImage={herobackgroundsSectionBg}
          tabs={[...venueTabs]}
          activeTab={active}
          onTabChange={handleTabChange}
        />
      </section>
      {!open && !detailsOpen && showSplitActions && (
        <SplitActionButtons
          primaryLabel="Request Proposal"
          secondaryLabel="Download Brochure"
          onPrimaryClick={handleRequestProposal}
          className="!fixed !bottom-0 !left-0 !right-0 !z-[2147483645] !mx-auto lg:!hidden"
        />
      )}

      <StartPlanEventModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(eventType) => {
          const normalized = String(eventType)
            .replace(/[-_]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
          setSelectedEventType(normalized || "Wedding");
          setOpen(false);
          setDetailsOpen(true);
        }}
      />
      <EventDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onBack={() => {
          setDetailsOpen(false);
          setOpen(true);
        }}
        eventType={selectedEventType}
        venue={active}
        venueOptions={[...venueTabs]}
        venueMaxGuestsByTab={venueMaxGuestsByTab}
        eventTypeOptions={["Wedding", "Corporate"]}
        onDone={(payload) => {
          console.log("Event inquiry payload:", payload);
          setDetailsOpen(false);
          navigate("/home");
        }}
      />
    </>
  );
};

export default HeroPage;
