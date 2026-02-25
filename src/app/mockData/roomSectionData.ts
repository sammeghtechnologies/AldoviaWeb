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
   
   export const roomsData: RoomData[] = [
     {
       id: 'deluxe-room',
       title: 'Deluxe Rooms',
       navLabel: 'Deluxe Rooms',
       isStatic: true, 
       staticImage: '/assets/rooms/deluxe-room/room.png',
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
       isStatic: false,
       // bgImage: '/assets/rooms/luxury-room/bg.png',
       // textLayer: '/assets/rooms/luxury-room/RoomsSuits.png',
        bgImage: '/assets/rooms/executive-suite/bg.png',
       textLayer: '/assets/rooms/executive-suite/RoomsSuits.png',
       textClassName: 'absolute bottom-[-5%] left-[60%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none',
      
       layers: [
       //   // Adjust w-[...%] to change size, and bottom/left/right to move them around
       //   { id: 'bed', src: '/assets/rooms/luxury-room/bed.png', slideFrom: 'bottom', className: 'bottom-0 left-0 w-[55%] object-contain' },
       //   { id: 'chair', src: '/assets/rooms/luxury-room/chair.png', slideFrom: 'left', className: 'bottom-[10%] right-[20%] w-[25%] object-contain' },
       //   { id: 'table', src: '/assets/rooms/luxury-room/table.png', slideFrom: 'right', className: 'bottom-[5%] right-[5%] w-[15%] object-contain' },
       //
         { id: 'dressing', src: '/assets/rooms/executive-suite/dressing.png', slideFrom: 'top', className: 'bottom-[26%] left-[40%] w-[13%] object-contain' },
         { id: 'bed', src: '/assets/rooms/executive-suite/bed.png', slideFrom: 'left', className: 'bottom-[-10%] left-[0%] w-[60%] object-contain' },
         { id: 'chairL', src: '/assets/rooms/executive-suite/chairL.png', slideFrom: 'top', className: 'bottom-[41%] right-[31.2%] w-[11%] object-contain' },
         { id: 'table', src: '/assets/rooms/executive-suite/table.png', slideFrom: 'top', className: 'bottom-[32%] right-[27.3%] w-[9.5%] object-contain' },
         { id: 'chairR', src: '/assets/rooms/executive-suite/chairR.png', slideFrom: 'top', className: 'bottom-[29%] right-[16.2%] w-[11.2%] object-contain' },
         { id: 'chairTable', src: '/assets/rooms/executive-suite/chair-table.png', slideFrom: 'right', className: 'bottom-[-5%] right-[0%] w-[20.1%] object-contain' }
      
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
       isStatic: false,
       bgImage: '/assets/rooms/1-bedroom-suite/bg.png',
       textLayer: '/assets/rooms/1-bedroom-suite/RoomsSuits.png',
      textClassName: 'absolute bottom-[-5%] left-[60%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none',
       layers: [
          { id: 'dressing', src: '/assets/rooms/1-bedroom-suite/dressing.png', slideFrom: 'top', className: 'bottom-[26%] left-[40%] w-[13%] object-contain' },
         { id: 'bed', src: '/assets/rooms/1-bedroom-suite/bed.png', slideFrom: 'left', className: 'bottom-[-10%] left-[0%] w-[60%] object-contain' },
         { id: 'chairL', src: '/assets/rooms/1-bedroom-suite/chairL.png', slideFrom: 'top', className: 'bottom-[41%] right-[31.2%] w-[11%] object-contain' },
         { id: 'table', src: '/assets/rooms/1-bedroom-suite/table.png', slideFrom: 'top', className: 'bottom-[32%] right-[27.3%] w-[9.5%] object-contain' },
         { id: 'chairR', src: '/assets/rooms/1-bedroom-suite/chairR.png', slideFrom: 'top', className: 'bottom-[29%] right-[16.2%] w-[11.2%] object-contain' },
         { id: 'chairTable', src: '/assets/rooms/1-bedroom-suite/chair-table.png', slideFrom: 'right', className: 'bottom-[-5%] right-[0%] w-[20.1%] object-contain' }
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
       isStatic: false,
       bgImage: '/assets/rooms/2-bedroom-suite/bg.png',
       textLayer: '/assets/rooms/2-bedroom-suite/RoomsSuits.png',
      textClassName: 'absolute bottom-[-5%] left-[60%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none',
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
       isStatic: false,
       bgImage: '/assets/rooms/deluxe-suite/bg.png',
       textLayer: '/assets/rooms/deluxe-suite/RoomsSuits.png',
       textClassName: 'absolute bottom-[-5%] left-[60%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none',
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
       isStatic: false,
       bgImage: '/assets/rooms/executive-suite/bg.png',
       textLayer: '/assets/rooms/executive-suite/RoomsSuits.png',
       textClassName: 'absolute bottom-[-5%] left-[60%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none',
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