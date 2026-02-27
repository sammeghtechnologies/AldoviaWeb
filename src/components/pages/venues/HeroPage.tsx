import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import CarouselCards from "../../ui/CarouselCardEvents";
import StartPlanEventModal from "../../ui/StartPlanEventModal";
import EventDetailsModal from "../../ui/EventDetailsModal";
import Footer from "../../sections/Footer";

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
  "Galaxy Grand Courtyard",
  "Eden Garden",
  "Galaxy Grand Dining",
  "Lotus",
  "Sunflower",
  "Rose",
  "Orchid",
  "Jasmine",
  "Tulip",
  "Lily",
  "Geneva Boardroom",
] as const;

type VenueTab = (typeof venueTabs)[number];
type VenueDimensions = {
  area?: string;
  height?: string;
  width?: string;
  length?: string;
};

type VenueSeating = {
  theater?: string;
  ushape?: string;
  classroom?: string;
  boardroom?: string;
  cluster?: string;
  cocktails?: string;
  round?: string;
  seater?: string;
};

type VenueTabContent = {
  subtitle: string;
  description: string;
  dimensions?: VenueDimensions;
  seating?: VenueSeating;
};

const parseSeaterCount = (value: string) => {
  const numeric = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 100;
};

const venueContentByTab: Record<VenueTab, VenueTabContent> = {
  "Galaxy Grand Ballroom": {
    subtitle: "Opulent Celebrations & Galas",
    description:
      "The flagship venue at Aldovia. Spacious and versatile, the Galaxy Grand Ballroom is built for events that demand grandeur without compromise. From large-scale weddings to high-profile corporate galas, the space adapts to the scale of your ambition. Soaring ceilings, state-of-the-art AV, and a service team experienced in both grand celebrations and intimate dinners.",

    dimensions: {
      area: "1,29,065 sq.ft",
      height: "21 ft",
      width: "311 ft",
      length: "415 ft",
    },

    seating: {
      theater: "3000",
      classroom: "1200",
    },
  },

  "Galaxy Grand Courtyard": {
    subtitle: "Elegant Outdoor Settings",
    description:
      "Beautiful outdoor space perfect for cocktail receptions, garden parties, and al fresco dining experiences.",

    dimensions: {
      area: "7,000 sq.ft",
    },

    seating: {
      round: "400",
    },
  },

  "Eden Garden": {
    subtitle: "Natural Beauty & Serenity",
    description:
      "Intimate garden venue surrounded by lush greenery, perfect for ceremonies and small gatherings.",

    seating: {
      round: "300",
    },
  },

  "Galaxy Grand Dining": {
    subtitle: "Exclusive Dining Experiences",
    description:
      "Sophisticated dining venue for intimate celebrations, private dinners, and exclusive gatherings.",

    dimensions: {
      area: "3,463 sq.ft",
    },

    seating: {
      round: "40",
    },
  },

  "Lotus": {
    subtitle: "Versatile Mid-Size Events",
    description:
      "Multi-purpose venue ideal for corporate meetings, medium-sized celebrations, and conferences.",

    dimensions: {
      area: "5,974 sq.ft",
    },

    seating: {
      seater: "400",
    },
  },

  "Sunflower": {
    subtitle: "Bright & Welcoming Space",
    description:
      "Well-appointed hall perfect for seminars, workshops, and social gatherings.",

    dimensions: {
      area: "2,837 sq.ft",
    },

    seating: {
      seater: "200",
    },
  },

  "Rose": {
    subtitle: "Elegant & Refined",
    description:
      "Sophisticated venue for corporate events, training sessions, and intimate celebrations.",

    dimensions: {
      area: "2,540 sq.ft",
    },

    seating: {
      seater: "160",
    },
  },

  "Orchid": {
    subtitle: "Boutique Event Space",
    description:
      "Intimate setting ideal for board meetings, private functions, and exclusive events.",

    dimensions: {
      area: "2,153 sq.ft",
    },

    seating: {
      seater: "150",
    },
  },

  "Jasmine": {
    subtitle: "Cozy & Professional",
    description:
      "Perfect for small meetings, workshops, and intimate gatherings with professional amenities.",

    dimensions: {
      area: "1,026 sq.ft",
    },

    seating: {
      seater: "70",
    },
  },

  "Tulip": {
    subtitle: "Intimate Meetings",
    description:
      "Sophisticated venue ideal for corporate events, training sessions, and intimate events.",

    dimensions: {
      area: "2,540 sq.ft",
    },

    seating: {
      seater: "160",
    },
  },

  "Lily": {
    subtitle: "Exclusive Small Gatherings",
    description:
      "Intimate setting ideal for board meetings, private functions, and exclusive events.",

    dimensions: {
      area: "2,153 sq.ft",
    },

    seating: {
      seater: "150",
    },
  },

  "Geneva Boardroom": {
    subtitle: "Executive Boardroom",
    description:
      "Perfect for small meetings, workshops, and intimate gatherings with professional amenities.",

    dimensions: {
      area: "1,026 sq.ft",
    },

    seating: {
      seater: "70",
    },
  },
};

const venueImagesByTab: Partial<Record<VenueTab, string[]>> = {
  "Galaxy Grand Ballroom": [
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
    "/assets/herobackgrounds/herobanner/corridor.jpg",
  ],
  "Galaxy Grand Courtyard": [
    "/assets/herobackgrounds/herobanner/corridor.jpg",
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/lotus.jpg",
  ],
  "Eden Garden": [
    "/assets/herobackgrounds/herobanner/lotus.jpg",
    "/assets/herobackgrounds/herobanner/corridor.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
  ],
  "Galaxy Grand Dining": [
    "/assets/herobackgrounds/herobanner/orchid.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/tulip.jpg",
  ],
  "Lotus": [
    "/assets/herobackgrounds/herobanner/lotus.jpg",
    "/assets/herobackgrounds/herobanner/galaxy.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
  ],
  "Sunflower": [
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/orchid.jpg",
  ],
  "Rose": [
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/orchid.jpg",
  ],
  "Orchid": [
    "/assets/herobackgrounds/herobanner/orchid.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/tulip.jpg",
  ],
  "Jasmine": [
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/orchid.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
  ],
  "Tulip": [
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
    "/assets/herobackgrounds/herobanner/orchid.jpg",
  ],
  "Lily": [
    "/assets/herobackgrounds/herobanner/orchid.jpg",
    "/assets/herobackgrounds/herobanner/tulip.jpg",
    "/assets/herobackgrounds/herobanner/rose.jpg",
  ],
  "Geneva Boardroom": [
    "/assets/herobackgrounds/herobanner/corridor.jpg",
    "/assets/herobackgrounds/herobanner/lotus.jpg",
    "/assets/herobackgrounds/herobanner/galaxy1.jpg",
  ],
};

const venueCardsByTab: Record<VenueTab, VenueCard[]> = venueTabs.reduce(
  (acc, tab) => {
    const content =
      venueContentByTab[tab] ??
      venueContentByTab["Galaxy Grand Ballroom"];
    const fallbackDimensions = {
      area: "N/A",
      height: "N/A",
      width: "N/A",
      length: "N/A",
    };
    const dimensions = {
      ...fallbackDimensions,
      ...(content?.dimensions ?? {}),
    };
    const seating = {
      theater: "0",
      ushape: "0",
      classroom: "0",
      boardroom: "0",
      cluster: "0",
      cocktails: "0",
      round: "0",
      ...(content?.seating ?? {}),
    };
    const maxSeating =
      content?.seating?.theater ??
      content?.seating?.seater ??
      content?.seating?.round ??
      "0";
    const idPrefix = tab.toLowerCase().replace(/\s+/g, "-");
    const tabImages = venueImagesByTab[tab] ?? defaultVenueImages;
    acc[tab] = tabImages.map((image, index) => ({
      id: `${idPrefix}-${index + 1}`,
      image,
      title: tab,
      subtitle: content?.subtitle ?? "Venue Details",
      description: content?.description ?? "Venue details will be updated soon.",
      dimensions,
      seating,
      capacity: `${maxSeating} seater`,
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
      ? "Your Wedding, Your Way"
      : pageMode === "corporate"
        ? "Your professional Event Destination"
        : "Opulent Celebrations & Galas";
  const heroSubtitle =
    pageMode === "wedding"
      ? "Forty-five acres of grounds, twelve curated venues, and a team that understands that no two weddings should look the same. At Aldovia, we do not offer packages. We offer possibilities."
      : pageMode === "corporate"
        ? "State-of-the-art facilities for conferences, offsites, and team building. Forty minutes from Bangalore, but far enough to think clearly."
      : "Spacious and versatile venue is ideal for large-scale events, from glamorous weddings to corporate galas.";
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
  const handlePlanEvent = () => {
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
  const venueMaxGuestsByTab = venueTabs.reduce<Record<string, number>>((acc, tab) => {
    const maxSeats =
      venueContentByTab[tab]?.seating?.theater ??
      venueContentByTab[tab]?.seating?.seater ??
      venueContentByTab[tab]?.seating?.round ??
      venueContentByTab["Galaxy Grand Ballroom"]?.seating?.theater ??
      "100";
    acc[tab] = parseSeaterCount(maxSeats);
    return acc;
  }, {});



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
        buttonLabel={pageMode === "wedding" || pageMode === "corporate" ? "Request Proposal" : "Plan Your Event"}
        onButtonClick={handleRequestProposal}
        secondaryButtonLabel={pageMode === "wedding" || pageMode === "corporate" ? "Download Brochure" : undefined}
        onSecondaryButtonClick={pageMode === "wedding" || pageMode === "corporate" ? handlePlanEvent : undefined}
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
        eventTypeOptions={[
          "Wedding",
          "Corporate Event",
          "Social Gathering",
          "Birthday",
          "Anniversary",
          "Other",
        ]}
        onDone={(payload) => {
          console.log("Event inquiry payload:", payload);
          setDetailsOpen(false);
          navigate("/home");
        }}
      />
      <Footer/>
    </>
  );
};

export default HeroPage;
