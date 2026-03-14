export interface RoomContent {
  title: string;
  subtitle: string;
  desc: string;
  img1: string;
  img2: string;
}

export const roomData: Record<number, RoomContent> = {
  1: {
    title: "ROOMS",
    subtitle: "Luxury Stay Collection",
    desc: "Discover spacious suites and premium rooms designed for deep comfort, elegant interiors, and a complete resort-living experience.",
    img1: "/assets/pages/rooms/room1.webp",
    img2: "/assets/pages/rooms/room3.webp"
  },
  2: {
    title: "EVENTS",
    subtitle: "Weddings & Celebrations",
    desc: "Host unforgettable celebrations with curated decor, personalized planning support, and versatile spaces for intimate and grand occasions.",
    img1: "/assets/pages/hall/corporate1.jpg",
    img2: "/assets/pages/hall/corporate2.jpg"
  },
  3: {
    title: "EXPERIENCE & PACKAGES",
    subtitle: "Curated Resort Journeys",
    desc: "Choose from handpicked stay experiences that combine wellness, leisure, and signature hospitality for couples, families, and groups.",
    img1: "/assets/pages/activities/persona/persona1.jpg",
    img2: "/assets/pages/activities/persona/persona4.jpg"
  },
  4: {
    title: "ACTIVITIES",
    subtitle: "Adventure & Wellness",
    desc: "From pool sessions and cycling trails to indoor games and fitness programs, every activity is designed to energize your stay.",
    img1: "/assets/pages/activities/swimming/swim1.jpg",
    img2: "/assets/pages/activities/cycling/cycling1.jpg"
  },
  5: {
    title: "CONVENTION CENTER",
    subtitle: "Corporate & Conference Venue",
    desc: "Plan high-impact conferences, seminars, and corporate retreats with large-format halls, breakout zones, and technical event support.",
    img1: "/assets/herobackgrounds/convention/ocean1.webp",
    img2: "/assets/herobackgrounds/convention/ocean2.webp"
  },
  6: {
    title: "DINING",
    subtitle: "Signature Culinary Experiences",
    desc: "Savor multi-cuisine menus, chef-led specials, and refined ambience across our restaurants, lounge spaces, and curated dining events.",
    img1: "/assets/pages/dining/ambrosia.jpg",
    img2: "/assets/pages/dining/Buvette.jpg"
  },
  7: {
    title: "VIRTUAL TOUR",
    subtitle: "Explore Aldovia from Anywhere",
    desc: "Interactive 360° experiences and virtual walkthroughs of our premium suites, convention halls, and resort amenities. (Content coming soon)",
    img1: "/assets/pages/rooms/room1.webp",       // Placeholder image
    img2: "/assets/pages/hall/corporate1.jpg"     // Placeholder image
  }
};
