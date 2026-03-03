export interface RoomLayer {
  id: string;
  src: string;
  slideFrom: 'bottom' | 'right' | 'left' | 'top';
  className?: string; // Used to position tightly-cropped furniture
}

export interface RoomData {
  id: string;
  title: string;
  navLabel: string;
  mobileStaticImage?: string;
  mobileBgImage?: string;     // NEW: For animated mobile background
  mobileLayers?: RoomLayer[]; // NEW: For animated mobile furniture
  isStatic: boolean;
  staticImage?: string; 
  bgImage?: string;
  textLayer?: string;
  textClassName?: string;
  layers?: RoomLayer[];
  gallery: string[];
  description: string;
  occupancy: string;
  bedType: string;
}

// Reusable mobile layers to keep the code clean (you can customize these per room later)
const defaultMobileLayers: RoomLayer[] = [
  // { id: 'm-room', src: '/assets/rooms/mobile/room.png', slideFrom: 'top', className: 'bottom-[8%] left-[50%] -translate-x-1/2 w-[108%] object-contain' },
  { id: 'm-bed', src: '/assets/rooms/mobile/bed.png', slideFrom: 'left', className: 'bottom-[25%] left-[67%] -translate-x-1/2 w-[72%] object-contain rotate-1' },
  { id: 'm-table', src: '/assets/rooms/mobile/table.png', slideFrom: 'right', className: 'bottom-[28%] left-[0%] w-[26%] object-contain' },
];

const mobile1Layers: RoomLayer[] = [
  { id: 'm1-bed-main', src: '/assets/rooms/mobile1/bed.png', slideFrom: 'left', className: 'bottom-[20%] left-[84%] -translate-x-1/2 w-[28%] object-contain' },
  { id: 'm1-bed-front', src: '/assets/rooms/mobile1/bed2.png', slideFrom: 'right', className: 'bottom-[30%] left-[86%] -translate-x-1/2 w-[52%] object-contain' },
  { id: 'm1-lchair', src: '/assets/rooms/mobile1/lchair.png', slideFrom: 'left', className: 'bottom-[36%] left-[31%] w-[14%] object-contain' },
  { id: 'm1-rchair', src: '/assets/rooms/mobile1/rchair.png', slideFrom: 'right', className: 'bottom-[37.5%] left-[53%] w-[14%] object-contain' },
  { id: 'm1-round', src: '/assets/rooms/mobile1/round.png', slideFrom: 'top', className: 'bottom-[36%] left-[44%] w-[11%] object-contain' },
  { id: 'm1-sidetab', src: '/assets/rooms/mobile1/sidetab.png', slideFrom: 'right', className: 'bottom-[33%] left-[7%] w-[20%] object-contain' },
];

export const roomsData: RoomData[] = [
  {
    id: 'deluxe-room',
    title: 'Deluxe Rooms',
    navLabel: 'Deluxe Rooms',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile/empty.jpg',
    mobileLayers: defaultMobileLayers,
    isStatic: false, 
    bgImage: '/assets/rooms/room1/emptyroom.png',
    textLayer: '/assets/rooms/1-bedroom-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
      { id: 'bed', src: '/assets/rooms/room1/bed.png', slideFrom: 'left', className: 'bottom-[-12%] left-[38%] w-[36%] object-contain drop-shadow-[50px_25px_80px_rgba(0,0,0,0.45)] -rotate-3' },
      { id: 'table', src: '/assets/rooms/room1/table.png', slideFrom: 'top', className: 'bottom-[-18%] left-[12%] w-[20%] object-contain rotate-6' },
      { id: 'chairR', src: '/assets/rooms/room1/chair.png', slideFrom: 'top', className: 'bottom-[-45%] left-[-12%] w-[20%] object-contain' },     ],
   
    gallery: [
      '/assets/rooms/deluxe-room/s1.jpg',
      '/assets/rooms/deluxe-room/s2.jpg',
      '/assets/rooms/deluxe-room/s3.jpg'
    ],
    description: 'With its muted interiors, soft headboard and evocative ceiling accents, the Deluxe Room exudes an air of sophistication.',
    occupancy: '2 adults + 2 children',
    bedType: 'King bed'
  },
  {
    id: 'luxury-room',
    title: 'Luxury Rooms',
    navLabel: 'Luxury Rooms',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile1/empty.jpg',
    mobileLayers: mobile1Layers,
    isStatic: false,
    bgImage: '/assets/rooms/1-bedroom-suite/empty.png',
    textLayer: '/assets/rooms/1-bedroom-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
      { id: 'bed', src: '/assets/rooms/1-bedroom-suite/bed.png', slideFrom: 'left', className: 'bottom-[-6%] right-[11%] w-[53%] object-contain -rotate-2' },
      { id: 'chairL', src: '/assets/rooms/1-bedroom-suite/chair.png', slideFrom: 'top', className: 'bottom-[30%] left-[39%] w-[13.5%] object-contain' },
      { id: 'table', src: '/assets/rooms/1-bedroom-suite/table.png', slideFrom: 'top', className: 'bottom-[2%] left-[85%] w-[15.2%] object-contain' },
      { id: 'chairR', src: '/assets/rooms/1-bedroom-suite/roundtab.png', slideFrom: 'top', className: 'bottom-[27%] left-[35%] w-[7%] object-contain' },
      { id: 'chairS', src: '/assets/rooms/1-bedroom-suite/schair.png', slideFrom: 'top', className: 'bottom-[4%] left-[-2%] w-[11.2%] object-contain' },
    ],
    gallery: [
      '/assets/rooms/luxury-room/s1.jpg',
      '/assets/rooms/luxury-room/s2.jpg',
      '/assets/rooms/luxury-room/s3.jpg'
    ],
    description: 'A seamless blend of comfort and style, the Luxury Room offers expansive space and premium, carefully curated amenities.',
    occupancy: '2 adults + 1 child',
    bedType: 'King bed'
  },
  {
    id: '1-bedroom-suite',
    title: '1 Bedroom Suite',
    navLabel: '1 Bedroom Suite',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile/empty.png',
    mobileLayers: defaultMobileLayers,
    isStatic: false,
    bgImage: '/assets/rooms/1-bedroom-suite/empty.png',
    textLayer: '/assets/rooms/1-bedroom-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
      { id: 'bed', src: '/assets/rooms/1-bedroom-suite/bed.png', slideFrom: 'left', className: 'bottom-[-6%] right-[11%] w-[53%] object-contain -rotate-2' },
      { id: 'chairL', src: '/assets/rooms/1-bedroom-suite/chair.png', slideFrom: 'top', className: 'bottom-[30%] left-[39%] w-[13.5%] object-contain' },
      { id: 'table', src: '/assets/rooms/1-bedroom-suite/table.png', slideFrom: 'top', className: 'bottom-[3%] left-[86%] w-[15.2%] object-contain' },
      { id: 'chairR', src: '/assets/rooms/1-bedroom-suite/roundtab.png', slideFrom: 'top', className: 'bottom-[27%] left-[35%] w-[7%] object-contain' },
      { id: 'chairS', src: '/assets/rooms/1-bedroom-suite/schair.png', slideFrom: 'top', className: 'bottom-[4%] left-[-2%] w-[11.2%] object-contain' },
    ],
     gallery: [
      '/assets/rooms/1-bedroom-suite/s1.jpg',
      '/assets/rooms/1-bedroom-suite/s2.jpg',
      '/assets/rooms/1-bedroom-suite/s3.jpg'
    ],
    description: 'Experience unparalleled comfort in our spacious 1 Bedroom Suite, featuring a beautifully separated living and relaxation area.',
    occupancy: '2 adults + 2 children',
    bedType: 'King bed'
  },
  {
    id: '2-bedroom-suite',
    title: '2 Bedroom Suite',
    navLabel: '2 Bedroom Suite',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile/empty.png',
    mobileLayers: defaultMobileLayers,
    isStatic: false,
    bgImage: '/assets/rooms/2-bedroom-suite/bg.png',
    textLayer: '/assets/rooms/2-bedroom-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
       { id: 'dressing', src: '/assets/rooms/2-bedroom-suite/dressing.png', slideFrom: 'top', className: 'bottom-[26%] left-[40%] w-[13%] object-contain' },
      { id: 'bed', src: '/assets/rooms/2-bedroom-suite/bed.png', slideFrom: 'left', className: 'bottom-[-10%] left-[0%] w-[60%] object-contain' },
      { id: 'chairL', src: '/assets/rooms/2-bedroom-suite/chairL.png', slideFrom: 'top', className: 'bottom-[41%] right-[31.2%] w-[11%] object-contain' },
      { id: 'table', src: '/assets/rooms/2-bedroom-suite/table.png', slideFrom: 'top', className: 'bottom-[32%] right-[27.3%] w-[9.5%] object-contain' },
      { id: 'chairR', src: '/assets/rooms/2-bedroom-suite/chairR.png', slideFrom: 'top', className: 'bottom-[29%] right-[16.2%] w-[11.2%] object-contain' },
      { id: 'chairTable', src: '/assets/rooms/2-bedroom-suite/chair-table.png', slideFrom: 'right', className: 'bottom-[-5%] right-[0%] w-[20.1%] object-contain' }
    ],
    gallery: [
      '/assets/rooms/2-bedroom-suite/s1.jpg',
      '/assets/rooms/2-bedroom-suite/s2.jpg',
      '/assets/rooms/2-bedroom-suite/s3.jpg'
    ],
    description: 'Perfect for families or groups, this suite offers two distinct bedrooms, a grand living area, and uncompromising luxury.',
    occupancy: '4 adults + 2 children',
    bedType: '2 King beds'
  },
  {
    id: 'deluxe-suite',
    title: 'Deluxe Suite',
    navLabel: 'Deluxe Suite',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile/empty.png',
    mobileLayers: defaultMobileLayers,
    isStatic: false,
    bgImage: '/assets/rooms/deluxe-suite/bg.png',
    textLayer: '/assets/rooms/deluxe-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
       { id: 'dressing', src: '/assets/rooms/deluxe-suite/dressing.png', slideFrom: 'top', className: 'bottom-[26%] left-[40%] w-[13%] object-contain' },
      { id: 'bed', src: '/assets/rooms/deluxe-suite/bed.png', slideFrom: 'left', className: 'bottom-[-10%] left-[0%] w-[60%] object-contain' },
      { id: 'chairL', src: '/assets/rooms/deluxe-suite/chairL.png', slideFrom: 'top', className: 'bottom-[41%] right-[31.2%] w-[11%] object-contain' },
      { id: 'table', src: '/assets/rooms/deluxe-suite/table.png', slideFrom: 'top', className: 'bottom-[32%] right-[27.3%] w-[9.5%] object-contain' },
      { id: 'chairR', src: '/assets/rooms/deluxe-suite/chairR.png', slideFrom: 'top', className: 'bottom-[29%] right-[16.2%] w-[11.2%] object-contain' },
      { id: 'chairTable', src: '/assets/rooms/deluxe-suite/chair-table.png', slideFrom: 'right', className: 'bottom-[-5%] right-[0%] w-[20.1%] object-contain' }
    ],
    gallery: [
      '/assets/rooms/deluxe-suite/s1.jpg',
      '/assets/rooms/deluxe-suite/s2.jpg',
      '/assets/rooms/deluxe-suite/s3.jpg'
    ],
    description: 'Step into elevated elegance. The Deluxe Suite features upgraded furnishings and a perfectly appointed relaxation area.',
    occupancy: '2 adults + 2 children',
    bedType: 'King bed'
  },
  {
    id: 'executive-suite',
    title: 'Executive Suite',
    navLabel: 'Executive Suite',
    mobileStaticImage: '/assets/rooms/mobilebg.jpg',
    mobileBgImage: '/assets/rooms/mobile/empty.png',
    mobileLayers: defaultMobileLayers,
    isStatic: false,
    bgImage: '/assets/rooms/executive-suite/bg.png',
    textLayer: '/assets/rooms/executive-suite/RoomsSuits.png',
    textClassName: 'absolute -translate-x-1/2 object-contain z-20 pointer-events-none w-[75%] bottom-[15%] left-[50%] md:w-[35%] md:bottom-[44%] md:left-[18%]',
    layers: [
       { id: 'dressing', src: '/assets/rooms/executive-suite/dressing.png', slideFrom: 'top', className: 'bottom-[26%] left-[40%] w-[13%] object-contain' },
      { id: 'bed', src: '/assets/rooms/executive-suite/bed.png', slideFrom: 'left', className: 'bottom-[-10%] left-[0%] w-[60%] object-contain' },
      { id: 'chairL', src: '/assets/rooms/executive-suite/chairL.png', slideFrom: 'top', className: 'bottom-[41%] right-[31.2%] w-[11%] object-contain' },
      { id: 'table', src: '/assets/rooms/executive-suite/table.png', slideFrom: 'top', className: 'bottom-[32%] right-[27.3%] w-[9.5%] object-contain' },
      { id: 'chairR', src: '/assets/rooms/executive-suite/chairR.png', slideFrom: 'top', className: 'bottom-[29%] right-[16.2%] w-[11.2%] object-contain' },
      { id: 'chairTable', src: '/assets/rooms/executive-suite/chair-table.png', slideFrom: 'right', className: 'bottom-[-5%] right-[0%] w-[20.1%] object-contain' }
    ],
    gallery: [
      '/assets/rooms/executive-suite/s1.jpg',
      '/assets/rooms/executive-suite/s2.jpg',
      '/assets/rooms/executive-suite/s3.jpg'
    ],
    description: 'Designed for the modern traveler, the Executive Suite blends functional space with top-tier comfort and panoramic views.',
    occupancy: '2 adults + 1 child',
    bedType: 'King bed'
  }
];
