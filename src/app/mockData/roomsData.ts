export interface Room {
  id: number;
  image: string;
  title: string;
  description: string;
  size: string;
  guests: string;
  price: string;
}

export const roomsData: Room[] = [
  {
    id: 1,
    image: "/assets/pages/rooms/room1.webp",
    title: "Deluxe Room",
    description: "Contemporary comfort with garden views",
    size: "412 - 350 sq. ft.",
    guests: "2 guests",
    price: "8,500"
  },
  {
    id: 2,
    image: "/assets/pages/rooms/room2.webp",
    title: "Luxury Room",
    description: "Spacious elegance with premium interiors",
    size: "350 sq. ft.",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 3,
    image: "/assets/pages/rooms/room3.webp",
    title: "1 Bedroom Suite",
    description: "Spacious elegance with premium interiors",
    size: "532 sq. ft.",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 4,
    image: "/assets/pages/rooms/room4.webp",
    title: "2 Bedroom Suite",
    description: "Spacious elegance with premium interiors",
    size: "730 sq. ft.",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 5,
    image: "/assets/pages/rooms/room5.webp",
    title: "Deluxe Suite",
    description: "Spacious elegance with premium interiors",
    size: "620 sq. ft.",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 6,
    image: "/assets/pages/rooms/room1.webp",
    title: "Executive Suite",
    description: "Spacious elegance with premium interiors",
    size: "1846 sq. ft.",
    guests: "3 guests",
    price: "15,000"
  }
];
