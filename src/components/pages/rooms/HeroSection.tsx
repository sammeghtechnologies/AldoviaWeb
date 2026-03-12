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
  const DESKTOP_SCENE_STYLE = {
    width: '1340px',
    height: '760px',
  } as const;
  const roomItems = roomsData.map((room) => room.navLabel || room.title);
  const [isMobile, setIsMobile] = useState(false);

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

  const renderHeroTitle = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={`hero-title-${activeRoom.id}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
        className="pointer-events-none absolute left-[7%] top-[20%] z-20 text-[var(--color-secondary)]/85 select-none md:left-[3.5%] md:top-[16%]"
      >
        <div className="relative leading-none">
          <span className="block font-lust text-[3.6rem] tracking-[-0.08em] md:text-[8rem]">
            Rooms
          </span>
          <div className="-mt-4 flex items-end gap-1 md:-mt-10 md:gap-2">
            <span className="font-lust text-[5.6rem] leading-[0.8] md:text-[9rem]">
              &
            </span>
            <span className="font-lust text-[3.25rem] italic tracking-[-0.05em] md:pb-4 md:text-[6rem]">
              Suites
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

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
                <img
                  src={activeRoom.mobileBgImage || '/assets/rooms/mobile/empty.png'}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {(activeRoom.mobileLayers || []).map((layer) => (
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

            {renderHeroTitle()}
          </div>

          {/* Desktop view with original animation */}
          <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoom.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2"
                style={DESKTOP_SCENE_STYLE}
              >
                {activeRoom.isStatic ? (
                  <img
                    src={activeRoom.staticImage}
                    alt={activeRoom.title}
                    className="h-full w-full max-w-none object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={activeRoom.bgImage}
                      alt="Background"
                      className="absolute inset-0 h-full w-full max-w-none object-cover"
                    />
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
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {renderHeroTitle()}
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,6,0.32)_0%,rgba(20,12,8,0.28)_36%,rgba(19,11,8,0.55)_100%)] pointer-events-none" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,rgba(8,5,4,0)_0%,rgba(8,5,4,0.20)_48%,rgba(8,5,4,0.46)_100%)]" />
        </motion.div>
      </div>

      <div className="absolute bottom-28 z-40 flex w-full justify-center px-3 pointer-events-auto md:bottom-3 md:px-8">
        <ScrollSelectTabs
          items={roomItems}
          active={activeRoom.navLabel || activeRoom.title}
          onChange={handleRoomTabChange}
          disableDesktopShift
          compactMobile
          activeClassName="!bg-transparent !text-[#FFE694] !font-bold !shadow-none"
          inactiveClassName="bg-transparent !text-[#F3EFE6]/90 hover:!text-[#F3EFE6] hover:bg-white/10 !font-semibold"
        />
      </div>
    </section>
  );
};

export default HeroSection;
