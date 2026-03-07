'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { roomsData, type RoomData } from '../rooms/roomsData';
import ScrollSelectTabs from '../../ui/ScrollSelectTabs';

interface Props { 
  room?: RoomData; 
  setActiveRoom: (room: RoomData) => void; 
}

const RoomDetails = ({ room, setActiveRoom }: Props) => {
  const displayRoom = room || roomsData[0];
  const [expandedMobileImage, setExpandedMobileImage] = useState<number | null>(null);
  const roomItems = roomsData.map((r) => r.navLabel || r.title);
  const images = displayRoom.gallery || [displayRoom.staticImage, displayRoom.staticImage, displayRoom.staticImage];
  const isDeluxeSuite = displayRoom.id === 'deluxe-suite';
  const titleParts = displayRoom.title.split(' ');
  const secondPart = titleParts.length > 1 ? titleParts.pop() : '';
  const firstPart = titleParts.join(' ') || displayRoom.title;

  const handleRoomTabChange = (label: string) => {
    const selected = roomsData.find((r) => (r.navLabel || r.title) === label);
    if (selected) setActiveRoom(selected);
  };

  return (
    <section 
      id="details-scroll-container" 
      className="relative w-full h-screen bg-[var(--color-secondary)] overflow-y-auto overflow-x-hidden touch-pan-y overscroll-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-38%] z-0 translate-y-[64%] bg-no-repeat opacity-10 md:opacity-[0.15]"
        style={{
          backgroundImage: "url('/assets/logo/brownmini-bg.svg')",
          backgroundSize: "min(100vw, 2000px)",
          backgroundPosition: "right bottom",
          width: "min(94vw, 2000px)",
          height: "min(64vw, 2000px)",
        }}
      />
      
      {/* Tabs in details section */}
      <div className="absolute top-[20vh] left-0 right-0 z-50 pointer-events-auto">
        <ScrollSelectTabs
          items={roomItems}
          active={displayRoom.navLabel || displayRoom.title}
          onChange={handleRoomTabChange}
          floatingOnScroll
          disableDesktopShift
          inactiveClassName="bg-black/10 !text-[#4c3628]/85 hover:!text-[#4c3628] hover:bg-black/15 !font-semibold"
        />
      </div>

      <div className="top-[10vh] w-full md:w-[90%] max-w-[1280px] mx-auto min-h-full md:min-h-screen flex flex-col md:flex-row items-center justify-center md:gap-8 relative md:left-1/2 md:-translate-x-1/2 z-10">
        
        {/* Gallery: Desktop expands | Mobile stays as equal strips */}
        <div
          className={`group flex h-[30vh] md:h-[62vh] w-full gap-2 md:gap-4 z-10 mb-8 md:mb-0 px-4 md:px-0 !mt-[50px] md:mt-0 ${
            isDeluxeSuite ? 'md:w-[72%] lg:w-[68%]' : 'md:w-[90%]'
          }`}
        >
          {images.slice(0, 3).map((img, i) => (
            <motion.div 
              key={`${displayRoom.id}-${i}`} 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              onClick={() =>
                setExpandedMobileImage((prev) => (prev === i ? null : i))
              }
              className={`relative h-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-1/3 rounded-2xl cursor-pointer md:rounded-[2.5rem] md:shadow-xl md:cursor-pointer ${expandedMobileImage === null ? '' : expandedMobileImage === i ? 'max-md:!w-[70%]' : 'max-md:!w-[15%]'} ${i === 2 ? 'md:w-[50%]' : 'md:w-[25%]'} md:group-hover:w-[15%] md:hover:!w-[70%] ${i === 0 ? 'md:mt-16' : i === 1 ? 'md:mb-16' : 'md:mt-8'}`}
            >
              <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Text Details & Split-Title */}
        <div
          className={`!mt-5 !pl-2 flex flex-col relative w-full z-10 px-6 md:px-4 md:pl-0 pb-20 md:pb-0 !text-[var(--color-primary)] justify-center ${
            isDeluxeSuite ? 'md:w-[58%] lg:w-[62%]' : 'md:w-[48%]'
          }`}
        >
          <h2 className="font-lust text-[2.5rem] leading-[0.9] tracking-tight !text-[var(--color-primary)] md:hidden">
            {displayRoom.title}
          </h2>

          <div className="relative hidden md:block translate-y-[20px] pointer-events-none z-20 whitespace-nowrap">
            
            {/* Base Layer: Dark Brown (Visible on all devices) */}
            <h2 className="font-lust text-[2.5rem] md:text-[8rem] lg:text-[6.5rem] leading-[0.85] tracking-tight !text-[var(--color-primary)]">
              {firstPart}
            </h2>
            
          </div>
          
          <h2 className="hidden md:block font-lust text-[2.5rem] md:text-[6rem] lg:text-[4.5rem] leading-none !text-[var(--color-primary)] !mt-[15px] md:mt-[5px]">
            {secondPart}
          </h2>          
          
          <p
            className={`font-area text-[15px] md:text-[17px] !text-[var(--color-primary)] leading-relaxed !mt-4 md:!mt-8 ${
              isDeluxeSuite ? 'max-w-xl' : 'max-w-sm'
            }`}
          >
            {displayRoom.description}
          </p>

          {/* --- AMENITIES: Occupancy and Bed Type --- */}
          <div className="font-area-regular flex items-center gap-10 !mt-4 !mb-4 !text-[var(--color-primary)]/80 text-[15px] md:text-[16px]">
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span className='!text-[var(--color-primary)]'>2 adults + 2 children</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4v16"/><path d="M2 11h20"/><path d="M2 17h20"/><path d="M22 4v16"/><path d="M18 11V4"/><path d="M6 11V4"/>
              </svg>
              <span className='!text-[var(--color-primary)]'>King bed</span>
            </div>
          </div>

          <button className="font-area-semibold bg-[#00000000] border-2 !text-[var(--color-primary)] rounded-full uppercase w-fit !px-12 !py-5 mx-0 md:mx-0 text-[12px] tracking-[0.1em] mt-10 shadow-lg transition-transform hover:scale-105 active:scale-95">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
