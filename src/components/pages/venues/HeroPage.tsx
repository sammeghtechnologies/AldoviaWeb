import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import CarouselCards from "../../ui/CarouselCardEvents";
import CarouselControls from "../../ui/CarouselControls";
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
const conventionImages = [
  "/assets/herobackgrounds/convention/ocean1.webp",
  "/assets/herobackgrounds/convention/ocean2.webp",
  "/assets/herobackgrounds/convention/ocean3.webp",
];
const herobackgroundsSectionBg = "/assets/backgrounds/swanbrown.png";
const weddingReasons = [
  {
    title: "Stunning Venues",
    description:
      "Choose from expansive indoor ballrooms and open-air lawns, each designed for unforgettable wedding moments.",
    image: "/assets/herobackgrounds/wedding/wedding1.jpg",
  },
  {
    title: "Customizable Themes",
    description:
      "Our event experts help you shape every detail, from decor palette to ceremony flow, around your vision.",
    image: "/assets/herobackgrounds/wedding/wedding2.jpg",
  },
  {
    title: "Luxurious Accommodations",
    description:
      "Comfortable premium suites and rooms for families, close friends, and your full wedding party.",
    image: "/assets/rooms/luxury-room/s1.jpg",
  },
  {
    title: "Gourmet Dining",
    description:
      "Curated menus and signature service for welcome dinners, wedding feasts, and post-event brunches.",
    image: "/assets/pages/dining/ambrosia.jpg",
  },
  {
    title: "Complete Event Planning",
    description:
      "Curated menus and signature service for welcome dinners, wedding feasts, and post-event brunches.",
    image: "/assets/pages/dining/ambrosia.jpg",
  }
];
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
  "Ocean Convention Centre",
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
  "Ocean Convention Centre": {
    subtitle: "Grand Convention Destination",
    description:
      "A purpose-built convention venue crafted for large gatherings, industry expos, and high-impact conferences with seamless service and scale.",
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
  "Ocean Convention Centre": [
    "/assets/herobackgrounds/convention/ocean1.webp",
    "/assets/herobackgrounds/convention/ocean2.webp",
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
  const modeFromQuery = new URLSearchParams(location.search).get("mode");
  const modeFromState = location.state?.mode;
  const resolvedMode = modeFromState ?? modeFromQuery;
  const pageMode =
    resolvedMode === "wedding"
      ? "wedding"
      : resolvedMode === "corporate"
        ? "corporate"
        : resolvedMode === "convention"
          ? "convention"
        : "venue";
  const heroImages =
    pageMode === "wedding"
      ? weddingImages
      : pageMode === "corporate"
        ? corporateImages
        : pageMode === "convention"
          ? conventionImages
          : defaultVenueImages;
  const heroTitle =
    pageMode === "wedding"
      ? "Your Wedding, Your Way"
      : pageMode === "corporate"
        ? "Your professional Event Destination"
        : pageMode === "convention"
          ? "Ocean Convention Centre"
        : "Opulent Celebrations & Galas";
  const heroSubtitle =
    pageMode === "wedding"
      ? "Forty-five acres of grounds, twelve curated venues, and a team that understands that no two weddings should look the same. At Aldovia, we do not offer packages. We offer possibilities."
      : pageMode === "corporate"
        ? "State-of-the-art facilities for conferences, offsites, and team building. Forty minutes from Bangalore, but far enough to think clearly."
        : pageMode === "convention"
          ? "Designed for conventions, exhibitions, and large-scale summits with premium infrastructure and seamless event execution."
      : "Spacious and versatile venue is ideal for large-scale events, from glamorous weddings to corporate galas.";
  const breadcrumbLabel =
    pageMode === "wedding"
      ? "Weddings"
      : pageMode === "corporate"
        ? "Corporate Events"
        : pageMode === "convention"
          ? "Convention"
          : "Venues";
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
  const [active, setActive] = useState<(typeof venueTabs)[number]>("Galaxy Grand Ballroom");
  const tabsForCurrentMode = useMemo(
    () =>
      pageMode === "convention"
        ? (["Ocean Convention Centre"] as (typeof venueTabs)[number][])
        : ([...venueTabs] as (typeof venueTabs)[number][]),
    [pageMode]
  );
  useEffect(() => {
    if (pageMode === "convention") {
      setActive("Ocean Convention Centre");
      return;
    }
    if (!tabsForCurrentMode.includes(active)) {
      setActive("Galaxy Grand Ballroom");
    }
  }, [active, pageMode, tabsForCurrentMode]);
  const selectedCards =
    venueCardsByTab[active] ?? venueCardsByTab[tabsForCurrentMode[0]];
  const handleTabChange = (value: string) => {
    if (tabsForCurrentMode.includes(value as (typeof venueTabs)[number])) {
      setActive(value as (typeof venueTabs)[number]);
    }
  };

  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("Wedding");
  const [weddingWindowStart, setWeddingWindowStart] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  const weddingCardsRailRef = useRef<HTMLDivElement | null>(null);
  const weddingVisibleCards = isMobileViewport ? 1 : 4;
  const maxWeddingStartIndex = Math.max(0, weddingReasons.length - weddingVisibleCards);
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
  const getWeddingCardStep = () => {
    const rail = weddingCardsRailRef.current;
    if (!rail) return 0;
    const firstCard = rail.firstElementChild as HTMLElement | null;
    if (!firstCard) return 0;
    const styles = window.getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.offsetWidth + gap;
  };
  const handleWeddingRailScroll = () => {
    const rail = weddingCardsRailRef.current;
    if (!rail) return;
    const step = getWeddingCardStep();
    if (!step) return;
    const nextStart = Math.round(rail.scrollLeft / step);
    setWeddingWindowStart(Math.max(0, Math.min(maxWeddingStartIndex, nextStart)));
  };
  const scrollWeddingCards = (direction: "prev" | "next") => {
    const rail = weddingCardsRailRef.current;
    if (!rail) return;
    const targetIndex =
      direction === "next"
        ? Math.min(maxWeddingStartIndex, weddingWindowStart + 1)
        : Math.max(0, weddingWindowStart - 1);
    setWeddingWindowStart(targetIndex);
    if (isMobileViewport) {
      const targetCard = rail.children[targetIndex] as HTMLElement | undefined;
      if (!targetCard) return;
      const targetLeft =
        targetCard.offsetLeft - (rail.clientWidth - targetCard.clientWidth) / 2;
      rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
      return;
    }
    const step = getWeddingCardStep();
    if (!step) return;
    rail.scrollTo({ left: targetIndex * step, behavior: "smooth" });
  };
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
      setWeddingWindowStart(0);
      weddingCardsRailRef.current?.scrollTo({ left: 0, behavior: "auto" });
    };
    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
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
      {pageMode === "wedding" && (
        <section className="my-10 w-screen bg-[var(--color-secondary)] px-4 !py-12 sm:my-12 sm:px-6 sm:!py-14 md:my-14 md:px-8 md:!py-16 lg:my-16 lg:px-12 lg:!py-20 justify-center">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center md:relative md:left-1/2 md:-translate-x-1/2">
            <h2 className="font-lust !mb-8 text-center text-3xl text-[var(--color-primary)] sm:mb-10 md:text-4xl">
              Why Choose Aldovia for Your Wedding?
            </h2>
            <div className="relative mx-auto w-full !bg-transparent">
              <div
                ref={weddingCardsRailRef}
                onScroll={handleWeddingRailScroll}
                className="mx-auto flex w-full max-w-full gap-4 overflow-x-auto px-4 pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:w-[80vw] md:max-w-[80vw] md:gap-5 md:px-0"
                style={{ perspective: "1400px" }}
              >
              {weddingReasons.map((reason, index) => {
                const leftCenter = weddingWindowStart + 1;
                const rightCenter = weddingWindowStart + 2;
                const isCenterActive = isMobileViewport
                  ? index === weddingWindowStart
                  : index === leftCenter || index === rightCenter;
                const isSideInactive = isMobileViewport
                  ? Math.abs(index - weddingWindowStart) === 1
                  : index === weddingWindowStart || index === weddingWindowStart + 3;
                const sideRotate = isMobileViewport
                  ? 0
                  : index < leftCenter ? 10 : index > rightCenter ? -10 : 0;

                return (
                  <article
                    key={reason.title}
                    className="group relative min-h-[360px] w-[92%] basis-[92%] min-w-[92%] shrink-0 overflow-hidden rounded-[24px]  md:min-h-[500px] md:min-w-[calc((80vw-3*1.25rem)/4)] md:basis-[calc((80vw-3*1.25rem)/4)]"
                    style={{
                      transform: isCenterActive
                        ? "rotateY(0deg) scale(1)"
                        : isSideInactive
                          ? `rotateY(${sideRotate}deg) scale(0.93)`
                          : "rotateY(0deg) scale(0.86)",
                      transformOrigin: "center center",
                      transition: "transform 500ms ease, opacity 500ms ease, filter 500ms ease",
                      opacity: isCenterActive ? 1 : isSideInactive ? 0.72 : 0.45,
                      filter: isCenterActive ? "none" : "saturate(0.8)",
                    }}
                  >
                    <img
                      src={reason.image}
                      alt={reason.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1b2530]/55 via-[#2b1d18]/35 to-[#2a0f08]/92" />
                    <div className="absolute inset-0 flex items-end !p-7 sm:!p-8">
                      <div>
                        <p className=" font-area text-[.7em] uppercase tracking-[0.14em] text-[#f6d796]/90">
                          Weddings &amp; Social Events
                        </p>
                        <h3 className="font-lust !mt-4 text-[1.5em] leading-[0.98] text-[#f7f0e5]">
                          {reason.title}
                        </h3>
                        <p className="font-area !mt-5 max-w-[30ch] text-[15px] leading-[1.45] text-[#f3dfcf]/95">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
              {maxWeddingStartIndex > 0 && (
                <CarouselControls
                  total={maxWeddingStartIndex + 1}
                  index={weddingWindowStart}
                  onNext={() => scrollWeddingCards("next")}
                  onPrev={() => scrollWeddingCards("prev")}
                  progressTrackColor="rgba(80, 44, 34, 0.25)"
                  progressFillColor="var(--color-primary)"
                  buttonColor="var(--color-primary)"
                  iconColor="var(--color-primary)"
                  className="!mt-6 !max-w-none !justify-center !gap-6 !px-0 [&_button]:!bg-black/7 [&_button]:!border-white/30 [&_button]:!backdrop-blur-lg"
                  progressBarClassName="w-[180px] max-w-[180px] shrink-0"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="w-full" >
        <CarouselCards
          items={selectedCards}
          sectionBackgroundImage={herobackgroundsSectionBg}
          tabs={pageMode === "convention" ? [] : tabsForCurrentMode}
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
        venueOptions={tabsForCurrentMode}
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
