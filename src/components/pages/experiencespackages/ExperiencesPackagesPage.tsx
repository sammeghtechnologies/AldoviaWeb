'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { experiencesPackagesData } from '../../../data/experiencesPackagesData';

const GridIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const DiningIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" /></svg>;
const BedIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7m18 0H3" /></svg>;
const StarIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;

const categories = [
  { name: 'All', icon: <GridIcon /> },
  { name: 'Day out Package', icon: <DiningIcon /> },
  { name: 'Rooms Package', icon: <BedIcon /> },
  { name: 'Dining', icon: <DiningIcon /> },
  { name: 'Festive Packages', icon: <StarIcon /> }
];

const LongArrowIcon = () => (
  <svg 
    width="48" 
    height="12" 
    viewBox="0 0 48 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block ml-4"
  >
    <path 
      d="M0 6H46M46 6L41 1M46 6L41 11" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const ExperiencesPackagesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [reelIndex, setReelIndex] = useState(0); 
  const [bgIndex, setBgIndex] = useState(0);
  const touchStartY = useRef(0);

  const filteredReels = experiencesPackagesData.filter(reel => 
    activeCategory === 'All' || reel.type === 'home' || reel.category === activeCategory
  );

  const currentReel = filteredReels[reelIndex] || filteredReels[0];
  const activeBg = currentReel.internalBgs ? currentReel.internalBgs[bgIndex] : currentReel.mainBg;

  useEffect(() => { setBgIndex(0); }, [reelIndex]);

  const handleNext = () => { if (reelIndex < filteredReels.length - 1) setReelIndex(v => v + 1); };
  const handlePrev = () => { if (reelIndex > 0) setReelIndex(v => v - 1); };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const distance = touchStartY.current - e.changedTouches[0].clientY;
    if (distance > 70 && reelIndex < filteredReels.length - 1) setReelIndex(v => v + 1);
    if (distance < -70 && reelIndex > 0) setReelIndex(v => v - 1);
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black text-white"
      style={{ fontFamily: "area-normal-regular" }}
      onTouchStart={e => touchStartY.current = e.touches[0].clientY}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- MENU BAR --- */}
      <AnimatePresence>
        {currentReel.type !== 'home' && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 w-full z-50 flex gap-3 p-5 overflow-x-auto no-scrollbar bg-gradient-to-b from-black/95 via-black/50 to-transparent"
          >
            {categories.map((cat) => (
              <button 
                key={cat.name} 
                onClick={() => {
                  setActiveCategory(cat.name);
                  const targetIdx = experiencesPackagesData.findIndex(r => r.category === cat.name && r.type === 'package');
                  setReelIndex(targetIdx !== -1 ? filteredReels.findIndex(r => r.id === experiencesPackagesData[targetIdx].id) : 1);
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[14px] whitespace-nowrap border-2 transition-all duration-300`}
                style={{ 
                    fontFamily: activeCategory === cat.name ? "area-normal-bold" : "area-normal-semibold",
                    backgroundColor: activeCategory === cat.name ? "#C19B54" : "rgba(0,0,0,0.6)",
                    borderColor: activeCategory === cat.name ? "#C19B54" : "rgba(255,255,255,0.1)",
                    color: activeCategory === cat.name ? "#000" : "rgba(255,255,255,0.8)"
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BACKGROUND --- */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeBg} 
          initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={activeBg} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 pb-12 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div key={currentReel.id} variants={staggerContainer} initial="hidden" animate="show" className="pointer-events-auto">
            
            {currentReel.type === 'home' ? (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center mt-[15vh] relative bottom-[40%]">
                 {/* --- PREMIUM EXPERIENCES BADGE FIX --- */}
<motion.span 
  variants={fadeInUp} 
  className="bg-[#C19B54] text-black rounded-md text-[11px] uppercase mb-5 flex items-center justify-center w-fit mx-auto"
  style={{ 
    fontFamily: "area-normal-bold", 
    letterSpacing: '0.15em',
    padding: '8px 10px',    // Explicitly forced padding
    display: 'inline-flex'  // Forces the span to respect padding
  }}
>
  Premium Experiences
</motion.span>
                  <motion.h1 variants={fadeInUp} style={{ fontFamily: "lust-text-medium" }} className="text-6xl md:text-7xl mb-6 leading-[1.05]">Elevate Your<br/>Stay</motion.h1>
                  <motion.p variants={fadeInUp} className="opacity-80 mb-10 max-w-[320px] text-[27px] leading-relaxed">Curated wellness, dining, and activity packages to enhance your Aldovia experience</motion.p>
                  <motion.button 
                    variants={fadeInUp} 
                    onClick={() => setReelIndex(1)} 
                    className="bg-[#4A3424] rounded-full text-[18px] font-bold shadow-2xl tracking-wide uppercase relative"
                    style={{ fontFamily: "area-normal-bold", padding: '20px 56px', bottom: '-70px' }}
                  >
                    Book Your Stay
                  </motion.button>
                </div>

                {/* --- FOOTER: SLIDER & ARROWS --- */}
                <div className="flex justify-between items-end w-full px-4 mb-4">
                  <div className="flex flex-col gap-4 w-[120px] relative left-[10%] bottom-[60px]">
                    <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-white" initial={{ width: "0%" }} animate={{ width: `${((reelIndex + 1) / filteredReels.length) * 100}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                  <div className="flex gap-4 relative right-[5%] bottom-[30px] ">
                    <button onClick={handlePrev} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md text-white">←</button>
                    <button onClick={handleNext} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md text-white">→</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col relative bottom-[8%] left-[3%]">
                <motion.h1 variants={fadeInUp} style={{ fontFamily: "lust-text-medium" }} className="text-[42px] mb-1 leading-tight relative bottom-[35px]">{currentReel.title}</motion.h1>
                <motion.p variants={fadeInUp} style={{ fontFamily: "area-normal-semibold" }} className="text-gray-300 text-[15px] mb-4 relative bottom-[30px]">{currentReel.subtitle}</motion.p>
                <motion.div variants={fadeInUp} style={{ fontFamily: "area-normal-bold" }} className="text-[48px] mb-5 flex items-baseline gap-2 relative bottom-[30px]">₹{currentReel.price?.toLocaleString()} <span className="text-[15px] opacity-70 uppercase tracking-tighter">+ taxes</span></motion.div>
                <motion.p variants={fadeInUp} className="text-[16px] opacity-90 mb-8 max-w-[340px] leading-relaxed relative bottom-[30px]">{currentReel.description}</motion.p>
                
                <motion.ul variants={fadeInUp} className="space-y-4 mb-10 relative bottom-[30px]">
                  {currentReel.features?.map(f => (
                    <li key={f} className="flex items-center gap-3 text-[16px]">
                      <span className="text-green-500 text-xl font-bold">✓</span> {f}
                    </li>
                  ))}
                </motion.ul>

                {/* --- FIXED BUTTON WITH letterSpacing --- */}
               {/* --- FORCED PADDING BOOK NOW BUTTON --- */}
<motion.button 
  variants={fadeInUp} 
  onClick={() => setReelIndex(1)} 
  className="rounded-full border-2 text-[18px] uppercase relative flex items-center justify-center"
  style={{ 
    fontFamily: "area-normal-bold", 
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Translucent black background
    borderColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent border
    padding: '16px 15px',  
    width: '50%',    // Lowered vertical and horizontal padding
    minWidth: '30%',         // Controlled minimum width
    whiteSpace: 'nowrap',      
    bottom: '15px',
    color: '#FFF'
  }}
>
  BOOK YOUR STAY <LongArrowIcon />
</motion.button>

                <div className="flex justify-between items-end w-full">
                  <div className="flex flex-col gap-4">
                    {currentReel.internalBgs && (
                      <div className="flex flex-row gap-3">
                        {currentReel.internalBgs.map((img, idx) => (
                          <button key={idx} onClick={() => setBgIndex(idx)} className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all ${bgIndex === idx ? 'border-[#C19B54] scale-110 shadow-2xl' : 'border-transparent opacity-40'}`}>
                            <img src={img} className="w-full h-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                    <div style={{ fontFamily: "area-normal-bold" }} className="bg-[#C19B54]/20 backdrop-blur-xl px-5 py-2 rounded-lg text-[11px] uppercase tracking-[0.3em] border border-[#C19B54]/30 w-fit text-[#C19B54]">
                      {currentReel.category}
                    </div>
                  </div>
                  {currentReel.internalBgs && (
                    <div className="flex gap-4 relative right-[5%]">
                      <button onClick={() => setBgIndex(p => (p - 1 + currentReel.internalBgs!.length) % currentReel.internalBgs!.length)} className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/60 backdrop-blur-md text-xl">←</button>
                      <button onClick={() => setBgIndex(p => (p + 1) % currentReel.internalBgs!.length)} className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/60 backdrop-blur-md text-xl">→</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExperiencesPackagesPage;