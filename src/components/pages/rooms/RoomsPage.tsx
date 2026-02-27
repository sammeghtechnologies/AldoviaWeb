'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roomsData } from '../rooms/roomsData';
import HeroSection from './HeroSection';
import RoomDetails from './RoomDetails';
import Footer from '../../sections/Footer';
import MenuFrame from '../../MenuFrame/v2/MenuFrame';

type ViewState = 'hero' | 'details' | 'footer';
type Direction = 'toDetails' | 'toHero' | 'toFooter' | 'fromFooter';

const RoomsPage = () => {
  const [roomIndex, setRoomIndex] = useState(0);
  const [view, setView] = useState<ViewState>('hero');
  const [direction, setDirection] = useState<Direction>('toDetails');
  
  const isAnimating = useRef(false);
  const detailsCooldown = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    roomsData.forEach((room) => {
      if (room.bgImage) { const img = new Image(); img.src = room.bgImage; }
      if (room.gallery) { room.gallery.forEach((src) => { const img = new Image(); img.src = src; }); }
    });
  }, []);

  const triggerPageChange = (delta: number, forceIndex?: number) => {
    if (isAnimating.current) return;

    if (forceIndex !== undefined) {
      setRoomIndex(forceIndex);
      setView('hero');
      return;
    }

    if (delta > 0) {
      if (view === 'hero') {
        isAnimating.current = true;
        setDirection('toDetails');
        setView('details');
        detailsCooldown.current = true;
        setTimeout(() => { detailsCooldown.current = false; }, 1500);
      } else if (view === 'details') {
        const el = document.getElementById('details-scroll-container');
        if (el && (el.scrollHeight - el.scrollTop <= el.clientHeight + 2)) {
          if (detailsCooldown.current) return;
          isAnimating.current = true;
          setDirection('toFooter');
          setView('footer');
        }
      }
    } else if (delta < 0) {
      if (view === 'footer') {
        isAnimating.current = true;
        setDirection('fromFooter');
        setView('details');
        detailsCooldown.current = true;
        setTimeout(() => { detailsCooldown.current = false; }, 1500);
      } else if (view === 'details') {
        const el = document.getElementById('details-scroll-container');
        if (el && el.scrollTop <= 2) {
          if (detailsCooldown.current) return;
          isAnimating.current = true;
          setDirection('toHero');
          setView('hero');
        }
      }
    }

    setTimeout(() => { isAnimating.current = false; }, 950);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const el = document.getElementById('details-scroll-container');
      
      if (view === 'hero' || view === 'footer') {
        e.preventDefault();
        if (Math.abs(e.deltaY) > 30) triggerPageChange(e.deltaY);
      } else if (view === 'details' && el) {
        const isAtTop = el.scrollTop <= 2;
        const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 2;

        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
          e.preventDefault();
          triggerPageChange(e.deltaY);
        }
      }
    };

    const container = containerRef.current;
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [view]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating.current) return;
    const dist = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dist) > 60) triggerPageChange(dist);
  };

  const variants = {
    enter: (dir: Direction) => ({ y: (dir === 'toDetails' || dir === 'toFooter') ? '100%' : '-100%' }),
    center: { y: 0 },
    exit: (dir: Direction) => ({ y: (dir === 'toDetails' || dir === 'toFooter') ? '-100%' : '100%' }),
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <MenuFrame showBookNow={false} />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={view}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          {view === 'hero' && <HeroSection activeRoom={roomsData[roomIndex]} setActiveRoom={(room) => triggerPageChange(0, roomsData.indexOf(room))} />}
          
          {/* FIXED: Passed setActiveRoom down so the mobile menu works and clears the error */}
          {view === 'details' && (
            <RoomDetails 
              room={roomsData[roomIndex]} 
              setActiveRoom={(room) => setRoomIndex(roomsData.findIndex(r => r.id === room.id))} 
            />
          )}

          {view === 'footer' && (
            <div className="h-full w-full overflow-y-auto bg-[#0F1A2A]">
              <Footer />
            </div>
          )}
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RoomsPage;
