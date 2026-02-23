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

  // --- STATE REFS ---
  const viewRef = useRef(view);
  const indexRef = useRef(roomIndex);
  viewRef.current = view;
  indexRef.current = roomIndex;

  // --- SCROLL ENGINE REFS ---
  const timeOfLastChange = useRef(0);
  const accum = useRef(0); // The Trackpad Sponge
  const lastWheelTime = useRef(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. SILENT JS PRELOADER (THE SMOOTHNESS FIX) ---
  // This loads all background images AND gallery images into the browser cache
  // silently, without clogging the DOM and causing lag.
  useEffect(() => {
    const preloadImages = () => {
      roomsData.forEach(room => {
        if (room.bgImage) { const img = new Image(); img.src = room.bgImage; }
        if (room.staticImage) { const img = new Image(); img.src = room.staticImage; }
        
        // Preload the flying furniture
        room.layers?.forEach(layer => {
          if (layer.src) { const img = new Image(); img.src = layer.src; }
        });
        
        // Preload the large gallery images for RoomDetails
        room.gallery?.forEach(imgSrc => {
          if (imgSrc) { const img = new Image(); img.src = imgSrc; }
        });
      });
    };
    
    // Wait 500ms after the page loads before starting the heavy downloads
    // so the initial load is instant.
    const preloaderTimeout = setTimeout(preloadImages, 500);
    return () => clearTimeout(preloaderTimeout);
  }, []);

  const triggerPageChange = (deltaY: number) => {
    const totalRooms = roomsData.length;
    const currentView = viewRef.current;
    const currentIndex = indexRef.current;

    if (deltaY > 0) {
      if (currentView === 'hero') {
        setDirection('downToDetails');
        setView('details');
      } else {
        setDirection('downToNextHero');
        setRoomIndex((currentIndex + 1) % totalRooms);
        setView('hero');
      }
    } else {
      if (currentView === 'details') {
        setDirection('upToHero');
        setView('hero');
      } else {
        setDirection('upToPrevDetails');
        setRoomIndex((currentIndex - 1 + totalRooms) % totalRooms);
        setView('details');
      }
    }
  };

  // --- 2. THE FLUID SCROLL LOGIC ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); 
      const now = Date.now();

      // Reset sponge if user stops scrolling for 50ms
      if (now - lastWheelTime.current > 50) accum.current = 0;
      lastWheelTime.current = now;

      // Hard lock during the 800ms animation
      if (now - timeOfLastChange.current < 850) {
        accum.current = 0; 
        return;
      }

      // Add up tiny trackpad movements
      accum.current += e.deltaY;

      // Trigger once momentum hits 50px
      if (Math.abs(accum.current) > 50) {
        const delta = accum.current;
        accum.current = 0; 
        timeOfLastChange.current = now; 
        triggerPageChange(delta);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => e.preventDefault();

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - timeOfLastChange.current < 850) return;

      const distance = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(distance) > 40) {
        timeOfLastChange.current = now;
        triggerPageChange(distance);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); 

  // --- 3. 2D MATRIX ANIMATIONS ---
  const slideVariants = {
    enter: (dir: Direction) => {
      if (dir === 'downToDetails') return { y: '100%', x: '0%' };
      if (dir === 'downToNextHero') return { x: '100%', y: '0%' }; 
      if (dir === 'upToHero') return { y: '-100%', x: '0%' };
      if (dir === 'upToPrevDetails') return { x: '-100%', y: '0%' }; 
      return { x: '0%', y: '0%' };
    },
    center: {
      x: '0%', y: '0%'
    },
    exit: (dir: Direction) => {
      if (dir === 'downToDetails') return { y: '-100%', x: '0%' }; 
      if (dir === 'downToNextHero') return { x: '-100%', y: '0%' }; 
      if (dir === 'upToHero') return { y: '100%', x: '0%' }; 
      if (dir === 'upToPrevDetails') return { x: '100%', y: '0%' }; 
      return { x: '0%', y: '0%' };
    },
  };

  const pageKey = view === 'hero' ? 'hero-view' : `details-view-${roomIndex}`;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#111] font-sans">
      
      <div className="fixed top-0 w-full z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      {/* DOM PRELOADER DELETED. IT IS NOW HANDLED EFFICIENTLY IN JS ABOVE */}

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={pageKey} 
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          // Switched to a hyper-smooth Apple-style cubic bezier ease
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform" }}
          className="absolute inset-0 w-full h-full bg-[#111]"
        >
          {view === 'hero' ? (
            <HeroSection 
              activeRoom={roomsData[roomIndex]} 
              setActiveRoom={(room) => {
                const targetIdx = roomsData.findIndex(r => r.id === room.id);
                setRoomIndex(targetIdx);
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