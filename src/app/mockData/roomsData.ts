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
    size: "350 sq ft",
    guests: "2 guests",
    price: "8,500"
  },
  {
    id: 2,
    image: "/assets/pages/rooms/room2.webp",
    title: "Premium Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 3,
    image: "/assets/pages/rooms/room3.webp",
    title: "Delux Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 4,
    image: "/assets/pages/rooms/room4.webp",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 5,
    image: "/assets/pages/rooms/room5.webp",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 6,
    image: "/assets/pages/rooms/room1.webp",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  }
];