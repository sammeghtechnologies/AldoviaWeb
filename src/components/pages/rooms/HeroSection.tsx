import React from 'react';
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
      <div className="absolute inset-0 w-full h-full z-0">
        
        <AnimatePresence>
          <motion.div
            key={activeRoom.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }} // Sped up exit
            transition={{ duration: 0.4, ease: "easeInOut" }} // Sped up base load from 0.8s to 0.4s
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {activeRoom.isStatic ? (
              <img 
                src={activeRoom.staticImage} 
                alt={activeRoom.title} 
                className="w-full h-full object-cover"
                decoding="async" 
              />
            ) : (
              <>
                <img 
                  src={activeRoom.bgImage} 
                  alt="Background" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  decoding="async" 
                />
                
                {activeRoom.layers?.map((layer) => (
                  <motion.img
                    key={layer.id}
                    src={layer.src}
                    draggable={false}
                    decoding="async"
                    initial={getInitialPosition(layer.slideFrom)}
                    animate={{ x: "0%", y: "0%", opacity: 1 }} 
                    transition={{ 
                      type: 'tween', 
                      ease: 'easeOut', 
                      duration: 0.6, // SPED UP: Was 1.2
                      delay: 0.1     // SPED UP: Was 0.5
                    }}
                    className={`absolute ${layer.className || 'inset-0 w-full h-full object-contain'}`}
                  />
                ))}

               {activeRoom.textLayer && (
                  <motion.img
                    src={activeRoom.textLayer}
                    decoding="async"
                    draggable={false}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.5,     // SPED UP: Was 1.8 (Text now appears right as furniture lands)
                      duration: 0.4,  // SPED UP: Was 0.6
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

      {/* Cinematic Bottom Navigation */}
      <div className="absolute bottom-0 w-full flex flex-col items-center gap-y-5 z-30 pointer-events-auto bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-32 pb-8">
        
        <div className="flex items-center justify-center gap-x-8 md:gap-x-16 w-full z-10">
          {roomsData.slice(0, 3).map((room, idx) => (
            <React.Fragment key={room.id}>
              <button
                onClick={() => setActiveRoom(room)}
                className={`text-sm md:text-[15px] tracking-wider transition-all duration-300 ${
                  activeRoom.id === room.id 
                    ? 'text-white font-semibold border-b border-white pb-1 drop-shadow-lg' 
                    : 'text-white/80 hover:text-white drop-shadow-lg'
                }`}
              >
                {room.navLabel}
              </button>
              {idx < 2 && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-center gap-x-8 md:gap-x-16 w-full z-10">
          {roomsData.slice(3, 6).map((room, idx) => (
            <React.Fragment key={room.id}>
              <button
                onClick={() => setActiveRoom(room)}
                className={`text-sm md:text-[15px] tracking-wider transition-all duration-300 ${
                  activeRoom.id === room.id 
                    ? 'text-white font-semibold border-b border-white pb-1 drop-shadow-lg' 
                    : 'text-white/80 hover:text-white drop-shadow-lg'
                }`}
              >
                {room.navLabel}
              </button>
              {idx < 2 && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;