'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { roomsData, type RoomData } from '../../../data/roomsData';

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
      
      {/* --- RESPONSIVE ROOM SELECTION BAR --- 
          Dynamic positioning: Top (mobile) | Bottom (desktop)
      */}
 
 <div className="absolute top-[95px] md:top-auto md:bottom-8 w-full z-40 px-4 md:px-8 flex justify-center pointer-events-auto">
        <div 
          className="flex items-center gap-4 md:gap-6 bg-[#00000000] backdrop-blur-xl/1 !p-3 md:!p-4 rounded-3xl md:rounded-full border-2 border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-x-auto w-full max-w-[98%] md:max-w-max !min-h-[50px] md:!min-h-[60px] relative bottom-[-20px]"
          // --- FORCING NO SCROLLBAR VISUALLY ---
          style={{
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
          }}
        >
          {/* Injecting Webkit hide to ensure it works on Chrome/Safari */}
          <style>{`
            div::-webkit-scrollbar { display: none !important; }
          `}</style>

          {roomsData.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`!px-6 md:px-8 !py-2 md:py-4 rounded-lg md:rounded-full text-[13px] md:text-[14px] whitespace-nowrap transition-all duration-300 ${
                activeRoom.id === room.id 
                  ? 'bg-[#C19B54] text-black shadow-lg font-bold' // Gold active state
                  : 'text-white/80 hover:text-white hover:bg-white/10 font-semibold'
              }`}
            >
              {room.navLabel || room.title}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full z-0">
        {/* --- MOBILE VIEW: DYNAMIC STATIC BACKGROUND --- 
            Pulling directly from activeRoom. No more hard-coding.
        */}
        <div className="md:hidden absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img 
              key={`bg-${activeRoom.id}`}
              // Dynamically loads the specific mobile image for the active room
              src={activeRoom.mobileStaticImage || activeRoom.staticImage} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              alt="Room Background" 
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

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

        {/* --- DESKTOP VIEW: DYNAMIC FALLING LAYERS --- */}
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
                <img 
                  src={activeRoom.staticImage} 
                  alt={activeRoom.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src={activeRoom.bgImage} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  
                  {/* Preserved Desktop Furniture Animation */}
                  {activeRoom.layers?.map((layer) => (
                    <motion.img
                      key={layer.id}
                      src={layer.src}
                      draggable={false}
                      initial={getInitialPosition(layer.slideFrom)}
                      animate={{ x: "0%", y: "0%", opacity: 1 }} 
                      transition={{ 
                        type: 'tween', 
                        ease: 'easeOut', 
                        duration: 0.6, 
                        delay: 0.1 
                      }}
                      className={`absolute ${layer.className || 'inset-0 w-full h-full object-contain'}`}
                    />
                  ))}

                  {activeRoom.textLayer && (
                    <motion.img
                      src={activeRoom.textLayer}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.5, 
                        duration: 0.4, 
                        ease: "easeOut" 
                      }}
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