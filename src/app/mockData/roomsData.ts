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
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Deluxe Room",
    description: "Contemporary comfort with garden views",
    size: "350 sq ft",
    guests: "2 guests",
    price: "8,500"
  },
  {
    id: 2,
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Premium Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 3,
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Delux Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 4,
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 5,
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  },
  {
    id: 6,
    image: "/assets/rooms/1BHKroom.jpg",
    title: "Luxury Suite",
    description: "Spacious elegance with premium interiors",
    size: "550 sq ft",
    guests: "3 guests",
    price: "15,000"
  }
];