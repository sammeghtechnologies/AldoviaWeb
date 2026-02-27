'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roomsData, type RoomData } from '../rooms/roomsData';
import ScrollSelectTabs from '../../ui/ScrollSelectTabs';

interface Props {
  activeRoom: RoomData;
  setActiveRoom: (room: RoomData) => void;
}

const HeroSection = ({ activeRoom, setActiveRoom }: Props) => {
  const roomItems = roomsData.map((room) => room.navLabel || room.title);
  const mobileBgImage = '/assets/rooms/mobile/bg.png';
  const [isMobile, setIsMobile] = useState(false);
  const mobileAnimatedLayers = [
    { id: 'm-chair', src: '/assets/rooms/mobile/chair.png', slideFrom: 'left' as const, className: 'bottom-[10%] left-[-6%] w-[46%] object-contain' },
    { id: 'm-table', src: '/assets/rooms/mobile/table.png', slideFrom: 'right' as const, className: 'bottom-[10%] left-[60%] -translate-x-1/2 w-[44%] object-contain' },
    { id: 'm-bulbL', src: '/assets/rooms/mobile/bulbL.png', slideFrom: 'top' as const, className: 'top-[28%] left-[10%] w-[12%] object-contain' },
    { id: 'm-bulbR', src: '/assets/rooms/mobile/bulbR.png', slideFrom: 'top' as const, className: 'top-[27%] right-[10%] w-[10%] object-contain' },
    { id: 'm-drawer', src: '/assets/rooms/mobile/drawer.png', slideFrom: 'left' as const, className: 'bottom-[37%] left-[10%] w-[30%] object-contain' },
    { id: 'm-bed', src: '/assets/rooms/mobile/bed.png', slideFrom: 'top' as const, className: 'bottom-[36%] left-[76%] -translate-x-1/2 w-[100%] object-contain' },
    { id: 'm-bedbench', src: '/assets/rooms/mobile/bedbench.png', slideFrom: 'right' as const, className: 'bottom-[30%] right-[-10%] w-[24%] object-contain' },
  ];

  const handleRoomTabChange = (label: string) => {
    const selected = roomsData.find((room) => (room.navLabel || room.title) === label);
    if (selected) setActiveRoom(selected);
  };

  const getInitialPosition = (direction: string) => {
    switch (direction) {
      case 'bottom': return { y: '120vh', opacity: 0 };
      case 'top': return { y: '-120vh', opacity: 0 };
      case 'left': return { x: '-120vw', opacity: 0 };
      case 'right': return { x: '120vw', opacity: 0 };
      default: return { y: '120vh', opacity: 0 };
    }
  };

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#18110e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(195,136,66,0.30),rgba(27,18,14,0.92)_55%,rgba(18,12,10,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(22,13,10,0.92)_0%,rgba(22,13,10,0.35)_20%,rgba(22,13,10,0.15)_50%,rgba(22,13,10,0.35)_80%,rgba(22,13,10,0.92)_100%)]" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-0 pt-0 md:px-10 md:pt-20">
        <motion.div
          className="relative h-screen w-full max-w-full overflow-hidden rounded-none border-0 shadow-none md:h-[80vh] md:max-w-[1340px] md:rounded-[28px] md:border md:border-white/25 md:shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          animate={isMobile ? { y: 0, x: 0, rotate: 0 } : { y: [0, -12, 0], x: [0, 6, 0, -6, 0], rotate: [0, 0.35, 0, -0.35, 0] }}
          transition={isMobile ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Mobile view with original animation */}
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
                <img src={mobileBgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                {mobileAnimatedLayers.map((layer) => (
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
              </motion.div>
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
                  className={`${activeRoom.textClassName || "absolute bottom-[20%] left-[50%] -translate-x-1/2 w-[70%] object-contain z-20 pointer-events-none"} !top-[24%] !bottom-auto`}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Desktop view with original animation */}
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

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,6,0.32)_0%,rgba(20,12,8,0.28)_36%,rgba(19,11,8,0.55)_100%)] pointer-events-none" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)]" />
        </motion.div>
      </div>

      <div className="absolute bottom-28 z-40 flex w-full justify-center px-3 pointer-events-auto md:bottom-3 md:px-8">
        <ScrollSelectTabs
          items={roomItems}
          active={activeRoom.navLabel || activeRoom.title}
          onChange={handleRoomTabChange}
          disableDesktopShift
          compactMobile
          activeClassName="bg-[#F3EFE6] !text-[#4c3628] !font-bold shadow-md"
          inactiveClassName="bg-transparent !text-[#F3EFE6]/90 hover:!text-[#F3EFE6] hover:bg-white/10 !font-semibold"
        />
      </div>
    </section>
  );
};

export default HeroSection;
