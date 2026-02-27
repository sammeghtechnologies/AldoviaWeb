export interface RoomContent {
  title: string;
  subtitle: string;
  desc: string;
  img1: string;
  img2: string;
  price: string;
}

export const roomData: Record<number, RoomContent> = {
  1: {
    title: "LUXURY SUITE",
    subtitle: "Oceanfront View",
    desc: "Indulge in the epitome of elegance. Our Luxury Suites offer breathtaking ocean views and bespoke furnishings.",
    price: "$450",
    img1: "assets/pages/rooms/room1.webp",
    img2: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop"
  },
  2: {
    title: "DELUXE ROOM",
    subtitle: "Cityscape Retreat",
    desc: "Modern aesthetics meet classic comfort. Ideal for the discerning traveler seeking a quiet sanctuary.",
    price: "$280",
    img1: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop"
  },
  3: {
    title: "PRESIDENTIAL VILLA",
    subtitle: "Private Infinity Pool",
    desc: "Experience unparalleled privacy with your own infinity pool, 24-hour butler service, and expansive living areas.",
    price: "$1,200",
    img1: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
  },
  4: {
    title: "GARDEN VIEW",
    subtitle: "Tropical Sanctuary",
    desc: "Immerse yourself in nature. These rooms open directly onto our award-winning tropical gardens.",
    price: "$320",
    img1: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600&auto=format&fit=crop"
  },
  5: {
    title: "SKYLINE LOFT",
    subtitle: "Urban Luxury",
    desc: "Floor-to-ceiling windows offering breathtaking views of the city skyline. Urban luxury defined.",
    price: "$550",
    img1: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop"
  },
  6: {
    title: "EXECUTIVE STUDIO",
    subtitle: "Business & Leisure",
    desc: "Designed for productivity and rest. Includes high-speed lounge access and premium amenities.",
    price: "$380",
    img1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop",
    img2: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop"
  }
};