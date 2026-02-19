import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAssets } from "../../../app/hooks/useAssets";

// --- LOGO COMPONENT ---
const Logo_top = () => {
  return (
    <div className="logo-top relative w-12 h-12 z-[5000]">
      {/* <img
        src="assets/logo/aldovialogo.svg" 
        alt="Aldovia"
        className="logo-image w-full h-full object-contain block brightness-0 invert"
      /> */}
    </div>
  );
};

// --- ICON / MENU ITEM ---
const MenuIcon = ({ icon = "menu", title = "" }) => {
  return (
    <li className="menu-item flex text-[15px] items-center gap-3 cursor-pointer transition-all duration-300 hover:opacity-50">
      <span>
        <img 
          src={icon} 
          alt="" 
          className="w-5 h-5" 
          style={{ filter: "brightness(0) invert(1)" }} // Standard White Filter
        />
      </span>
      <span className="font-light tracking-[0.2em] uppercase text-white">
        {title}
      </span>
    </li>
  );
};

// --- MAIN FRAME ---
const MenuFrame = ({ masterTl }: any) => {
  const { icons } = useAssets();
  const frameRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    const target = ".logo-image";
    const ctx = gsap.context(() => {
      gsap.set(target, { autoAlpha: 0, y: 15, scale: 0.9 });
      if (masterTl?.current) {
        masterTl.current.to(target, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }, ">");
      } else {
        gsap.to(target, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 1,
          ease: "power3.out",
        });
      }
    }, frameRef);
    return () => ctx.revert();
  }, [masterTl]);

  return (
    <div
      ref={frameRef}
      className="menu-frame fixed inset-0 w-full h-full z-[999999] pointer-events-none"
    >
      {/* Top Bar - Lifted from top-10 to top-6 */}
      <div className="absolute left-10 right-10 top-6 flex items-center justify-between pointer-events-auto">
        
        {/* Logo */}
        <Logo_top />

        {/* Right Section */}
        <div className="flex items-center gap-8">
          
          {/* NAV LIST: Responsive behavior */}
          <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
            <ul className={`flex gap-8 items-center ${isOpen ? 'flex flex-col md:flex-row absolute md:relative top-20 md:top-0 right-0 md:right-0 bg-black/80 md:bg-transparent p-10 md:p-0 rounded-lg backdrop-blur-md md:backdrop-blur-none' : ''}`}>
               <a href="#" className="pointer-events-auto">
                 <MenuIcon icon={icons.rooms} title="Rooms" />
               </a>
               <MenuIcon icon={icons.dining} title="Dining" />
               <MenuIcon icon={icons.rooms} title="Events" />
               <MenuIcon icon={icons.activity} title="Activities" />
            </ul>
          </div>
          
          {/* BOOK NOW BUTTON */}
        <button 
  className="px-12 py-7 text-white text-[17px] tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-70 font-medium bg-transparent border-none"
>
  Book Now
</button>

          {/* HAMBURGER (FEET ICON) */}
          <div 
            id="hamburger" 
            className="cursor-pointer transition-transform duration-300 active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img 
              src="assets/icons/feet-icon.png" 
              alt="Menu" 
              className={`w-12 h-12 object-contain brightness-0 invert transition-all ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Right - White Copyright */}
      {/* <div 
        className="absolute right-10 bottom-10 text-[9px] tracking-[0.5em] uppercase text-white/60"
      >
        Aldovia Heritage © 2026
      </div> */}
    </div>
  );
};

export default MenuFrame;