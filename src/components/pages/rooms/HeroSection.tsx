'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { roomsData, type RoomData } from '../rooms/roomsData';

interface Props {
  activeRoom: RoomData;
  setActiveRoom: (room: RoomData) => void;
}

const HeroSection = ({ activeRoom, setActiveRoom }: Props) => {
  const getInitialPosition = (direction: string) => {
    switch (direction) {
      case 'bottom': return { y: '120vh', opacity: 0 };
      case 'top': return { y: '-120vh', opacity: 0 };
      case 'left': return { x: '-120vw', opacity: 0 };
      case 'right': return { x: '120vw', opacity: 0 };
      default: return { y: '120vh', opacity: 0 };
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#111] overflow-hidden">
      
      {/* --- DESKTOP ONLY MENU: Hidden on mobile (hidden md:flex) --- */}
      <div className="hidden md:flex absolute bottom-8 w-full z-40 px-8 justify-center pointer-events-auto">
        <div 
          className="flex items-center gap-6 bg-[#00000000] backdrop-blur-xl/1 !p-2 rounded-full border-2 border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-x-auto max-w-max !min-h-[60px]"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none !important; }`}</style>
          {roomsData.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`!px-7 !py-3 rounded-full text-[14px] whitespace-nowrap transition-all duration-300 ${
                activeRoom.id === room.id 
                  ? 'bg-[#F3EFE6] text-[#4c3628] font-bold shadow-md' // Client change: Beige bg, Brown text
                  : 'text-[#F3EFE6]/90 hover:text-[#F3EFE6] hover:bg-white/10 font-semibold' // Client change: Beige text for inactive
              }`}
            >
              {room.navLabel || room.title}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full z-0">
        
        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-bg-${activeRoom.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              {/* If we have mobile layers, animate them! Otherwise, fallback to static image */}
              {activeRoom.mobileLayers && activeRoom.mobileBgImage ? (
                <>
                  <img src={activeRoom.mobileBgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                  
                  {/* Mobile Furniture Animation */}
                  {activeRoom.mobileLayers.map((layer) => (
                    <motion.img
                      key={layer.id}
                      src={layer.src}
                      draggable={false}
                      initial={getInitialPosition(layer.slideFrom)}
                      animate={{ x: "0%", y: "0%", opacity: 1 }} 
                      transition={{ type: 'tween', ease: 'easeOut', duration: 0.6, delay: 0.1 }}
                      className={`absolute ${layer.className || 'inset-0 w-full h-full object-contain'}`}
                    />
                  ))}
                </>
              ) : (
                <img 
                  src={activeRoom.mobileStaticImage || activeRoom.staticImage} 
                  alt="Room Background" 
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Text Layer (Rooms & Suits) */}
          <AnimatePresence mode="wait">
            {activeRoom.textLayer && (
              <motion.img
                key={`text-${activeRoom.id}`}
                src={activeRoom.textLayer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`${activeRoom.textClassName || "absolute bottom-[20%] left-[50%] -translate-x-1/2 w-[70%] object-contain z-20 pointer-events-none"}`}
              />
            )}
          </AnimatePresence>
        </div>

        {/* --- DESKTOP VIEW (Completely Untouched Layout) --- */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              {activeRoom.isStatic ? (
                <img src={activeRoom.staticImage} alt={activeRoom.title} className="w-full h-full object-cover" />
              ) : (
                <>
                  <img src={activeRoom.bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                  {activeRoom.layers?.map((layer) => (
                    <motion.img
                      key={layer.id}
                      src={layer.src}
                      draggable={false}
                      initial={getInitialPosition(layer.slideFrom)}
                      animate={{ x: "0%", y: "0%", opacity: 1 }} 
                      transition={{ type: 'tween', ease: 'easeOut', duration: 0.6, delay: 0.1 }}
                      className={`absolute ${layer.className || 'inset-0 w-full h-full object-contain'}`}
                    />
                  ))}
                  {activeRoom.textLayer && (
                    <motion.img
                      src={activeRoom.textLayer}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                      className={`${activeRoom.textClassName || "absolute bottom-[15%] left-[50%] -translate-x-1/2 w-[40%] object-contain z-20 pointer-events-none"}`}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-30 hidden md:block" />
    </section>
  );
};

export default HeroSection;