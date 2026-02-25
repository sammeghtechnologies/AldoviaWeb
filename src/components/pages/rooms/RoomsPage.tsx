'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roomsData } from '../../../data/roomsData';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import RoomDetails from './RoomDetails';
import Footer from '../../sections/Footer';

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
    // 1. HARD HARDWARE LOCK: Discard everything while moving
    if (isAnimating.current) return;

    if (forceIndex !== undefined) {
      setRoomIndex(forceIndex);
      setView('hero');
      return;
    }

    if (delta > 0) {
      // GOING DOWN
      if (view === 'hero') {
        isAnimating.current = true;
        setDirection('toDetails');
        setView('details');
        detailsCooldown.current = true;
        setTimeout(() => { detailsCooldown.current = false; }, 1500);
      } else if (view === 'details') {
        const el = document.getElementById('details-scroll-container');
        // Only trigger footer if user is physically at the very end of Section 2
        if (el && (el.scrollHeight - el.scrollTop <= el.clientHeight + 2)) {
          if (detailsCooldown.current) return;
          isAnimating.current = true;
          setDirection('toFooter');
          setView('footer');
        }
      }
    } else if (delta < 0) {
      // GOING UP
      if (view === 'footer') {
        isAnimating.current = true;
        setDirection('fromFooter');
        setView('details');
        detailsCooldown.current = true;
        setTimeout(() => { detailsCooldown.current = false; }, 1500);
      } else if (view === 'details') {
        const el = document.getElementById('details-scroll-container');
        // Only trigger hero if user is physically at the top of Section 2
        if (el && el.scrollTop <= 2) {
          if (detailsCooldown.current) return;
          isAnimating.current = true;
          setDirection('toHero');
          setView('hero');
        }
      }
    }

    // Lock for full transition duration
    setTimeout(() => { isAnimating.current = false; }, 950);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // KILL MOMENTUM: If an animation is live, prevent all scroll events
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

        // Only hijack if at boundaries; otherwise let native scroll work
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
      <Navbar />
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
          {view === 'details' && <RoomDetails room={roomsData[roomIndex]} />}
          {view === 'footer' && <Footer />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RoomsPage;