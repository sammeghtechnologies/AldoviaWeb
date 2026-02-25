'use client';

import { motion } from 'framer-motion';
import { roomsData, type RoomData } from '../../../data/roomsData';

interface Props { 
  room?: RoomData; 
  setActiveRoom: (room: RoomData) => void; 
}

const RoomDetails = ({ room, setActiveRoom }: Props) => {
  const displayRoom = room || roomsData[0];
  const images = displayRoom.gallery || [displayRoom.staticImage, displayRoom.staticImage, displayRoom.staticImage];
  const titleParts = displayRoom.title.split(' ');
  const secondPart = titleParts.length > 1 ? titleParts.pop() : '';
  const firstPart = titleParts.join(' ') || displayRoom.title;

  return (
    <section 
      id="details-scroll-container" 
      className="relative w-full h-screen bg-[#F3EFE6] overflow-y-auto overflow-x-hidden touch-pan-y overscroll-none"
      // --- FIXED: Added the transparent sticker background on top of the beige color ---
      style={{
        backgroundImage: "url('/assets/rooms/section2.png')",
        backgroundSize: "cover", // Adjust to "contain" if the stickers get cut off
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Add `backgroundAttachment: "fixed"` here later if you want the stickers to stay completely still while scrolling
      }}
    >
      
      {/* --- MOBILE ONLY MENU: Top of Section 2 --- */}
      <div className="md:hidden absolute top-[100px] w-full z-50 px-4 flex justify-center pointer-events-auto">
        <div 
          className="flex items-center !gap-3 bg-black/5 backdrop-blur-xl !p-2 rounded-2xl border border-white/20 shadow-xl overflow-x-auto no-scrollbar w-full max-w-[95%]"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none !important; }`}</style>
          {roomsData.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoom(r)}
              className={`!px-3 !py-1.5 rounded-lg text-[14px] whitespace-nowrap transition-all duration-300 ${
                displayRoom.id === r.id 
                  ? 'bg-[#F3EFE6] text-[#4c3628] font-bold shadow-md' // Client change: Beige bg, Brown text
                  : 'text-[#F3EFE6]/90 hover:text-[#F3EFE6] font-semibold' // Client change: Beige text for inactive
              }`}
            >
              {r.navLabel || r.title}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full min-h-full flex flex-col md:flex-row items-center justify-center md:p-16 py-20 relative z-10">
        
        {/* Gallery: Desktop expands | Mobile stays as equal strips */}
        <div className="group flex h-[30vh] md:h-[75vh] w-full md:w-1/2 gap-2 md:gap-4 z-10 mb-8 md:mb-0 px-4 md:px-0 !mt-[50px] md:mt-0">
          {images.slice(0, 3).map((img, i) => (
            <motion.div 
              key={`${displayRoom.id}-${i}`} 
              initial={{ y: 50, opacity: 0, scale: 0.85 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className={`relative h-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-1/3 rounded-2xl md:rounded-[2.5rem] md:shadow-xl md:cursor-pointer ${i === 2 ? 'md:w-[50%]' : 'md:w-[25%]'} md:group-hover:w-[15%] md:hover:!w-[70%] ${i === 0 ? 'md:mt-16' : i === 1 ? 'md:mb-16' : 'md:mt-8'}`}
            >
              <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Text Details & Split-Title */}
        <div className="flex flex-col relative w-full md:w-1/2 z-10 px-6 md:px-0 md:pl-16 pb-20 md:pb-0 text-[#4c3628] justify-center">
          <div className="relative max-md:-translate-x-[40px] md:-translate-x-[200px] lg:-translate-x-[280px] translate-y-[20px] pointer-events-none z-20 whitespace-nowrap left-[10.5%]">
            
            {/* Base Layer: Dark Brown (Visible on all devices) */}
            <h2 className="text-[2.5rem] md:text-[8rem] lg:text-[6.5rem] font-serif leading-[0.85] tracking-tight text-[#4c3628]">
              {firstPart}
            </h2>
            
            {/* Overlay Layer: Beige (Hidden on mobile, visible on desktop) */}
            <h2 className="hidden md:block text-[2.5rem] md:text-[8rem] lg:text-[6.5rem] font-serif leading-[0.85] tracking-tight text-[#f3efe6] absolute top-0 left-0 md:[clip-path:polygon(0_0,200px_0,200px_100%,0_100%)]">
              {firstPart}
            </h2>
          </div>
          
          <h2 className="text-[2.5rem] md:text-[6rem] lg:text-[4.5rem] font-serif italic leading-none text-[#4c3628] !ml-[30px] !mt-[15px] md:mt-[5px]">
            {secondPart}
          </h2>          
          
          <p className="text-[15px] md:text-[17px] text-[#423229] max-w-sm leading-relaxed !mt-4 md:!mt-8 !ml-4 md:!ml-7 font-medium">
            {displayRoom.description}
          </p>

          {/* --- AMENITIES: Occupancy and Bed Type --- */}
          <div className="flex items-center gap-10 !mt-4 !mb-4 !ml-7 text-[#4c3628]/80 font-medium text-[15px] md:text-[16px]">
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>2 adults + 2 children</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4v16"/><path d="M2 11h20"/><path d="M2 17h20"/><path d="M22 4v16"/><path d="M18 11V4"/><path d="M6 11V4"/>
              </svg>
              <span>King bed</span>
            </div>
          </div>

          <button className="bg-[#00000000] border-2 text-[#4c3628] rounded-full uppercase w-fit !px-12 !py-5 mx-auto md:mx-0 !ml-20 md:!ml-7 text-[12px] font-bold tracking-[0.1em] mt-10 shadow-lg transition-transform hover:scale-105 active:scale-95">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;