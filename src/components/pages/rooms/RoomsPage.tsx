'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roomsData } from '../../../data/roomsData';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import RoomDetails from './RoomDetails';

type Direction = 'downToDetails' | 'downToNextHero' | 'upToHero' | 'upToPrevDetails';

const RoomsPage = () => {
  const [roomIndex, setRoomIndex] = useState(0);
  const [view, setView] = useState<'hero' | 'details'>('hero');
  const [direction, setDirection] = useState<Direction>('downToDetails');
  
  // Strict locks to prevent skipping
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerPageChange = (delta: number, forceIndex?: number) => {
    // 1. HARD LOCK: If we are already moving, kill all incoming events
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    const totalRooms = roomsData.length;

    if (forceIndex !== undefined) {
      setDirection('downToNextHero');
      setRoomIndex(forceIndex);
      setView('hero');
    } else {
      // 2. LOGIC: Move only one step regardless of how large delta is
      if (delta > 0) {
        if (view === 'hero') { 
          setDirection('downToDetails'); 
          setView('details'); 
        } else { 
          setDirection('downToNextHero'); 
          setRoomIndex(p => (p + 1) % totalRooms); 
          setView('hero'); 
        }
      } else {
        if (view === 'details') { 
          setDirection('upToHero'); 
          setView('hero'); 
        } else { 
          setDirection('upToPrevDetails'); 
          setRoomIndex(p => (p - 1 + totalRooms) % totalRooms); 
          setView('details'); 
        }
      }
    }

    // 3. RELEASE LOCK: Match this exactly to your transition duration (0.8s)
    setTimeout(() => { 
      isAnimating.current = false; 
    }, 850); 
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // 4. SENSITIVITY THRESHOLD: Ignore micro-scrolls/noise
      if (Math.abs(e.deltaY) < 30) return;

      // Only trigger the change; the Hard Lock handles the rest
      triggerPageChange(e.deltaY);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [view, roomIndex]);

  // Preload ALL room images on component mount to eliminate any loading lag during transitions
  // This assumes the number of rooms is small; if large, consider lazy preloading only for current/adjacent
  // If roomsData has additional images (e.g., room.gallery: string[]), preload those here too
  useEffect(() => {
    roomsData.forEach(room => {
      if (room.bgImage) {
        const img = new Image();
        img.src = room.bgImage;
      }
      // Example if there are more images:
      // room.gallery?.forEach(src => {
      //   const img = new Image();
      //   img.src = src;
      // });
    });
  }, []);

  // Optional: Still preload adjacent for any dynamic changes, but with all preloaded, this is redundant
  useEffect(() => {
    const nextIdx = (roomIndex + 1) % roomsData.length;
    const prevIdx = (roomIndex - 1 + roomsData.length) % roomsData.length;
    [roomIndex, nextIdx, prevIdx].forEach(idx => {
      const img = new Image();
      if (roomsData[idx].bgImage) img.src = roomsData[idx].bgImage!;
      // Add other images here if applicable
    });
  }, [roomIndex]);

  const slideVariants = {
    enter: (dir: Direction) => ({
      y: dir.includes('downToDetails') ? '100%' : dir.includes('upToHero') ? '-100%' : 0,
      x: dir === 'downToNextHero' ? '100%' : dir === 'upToPrevDetails' ? '-100%' : 0,
    }),
    center: { x: 0, y: 0 },
    exit: (dir: Direction) => ({
      y: dir.includes('downToDetails') ? '-100%' : dir.includes('upToHero') ? '100%' : 0,
      x: dir === 'downToNextHero' ? '-100%' : dir === 'upToPrevDetails' ? '100%' : 0,
    }),
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <Navbar />

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={`${view}-${roomIndex}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            duration: 0.8, 
            ease: [0.19, 1, 0.22, 1] // High-end "Apple" quintic ease
          }}
          style={{ 
            position: 'absolute',
            inset: 0,
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {view === 'hero' ? (
            <HeroSection 
              activeRoom={roomsData[roomIndex]} 
              setActiveRoom={(room) => {
                const targetIdx = roomsData.findIndex(r => r.id === room.id);
                triggerPageChange(0, targetIdx);
              }} 
            />
          ) : (
            <RoomDetails room={roomsData[roomIndex]} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RoomsPage;