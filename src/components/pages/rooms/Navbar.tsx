import Logo from '../../../app/assets/Logo';
import Navhamburger from '../../../app/assets/Navhamburger';

const Navbar = () => {
  return (
    // Added a smooth gradient from black (60% opacity) to transparent
<nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-12 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">      
      {/* Left side spacer */}
      <div className="flex-1"></div>
      
      {/* Center Logo - pointer-events-auto allows it to be clicked if needed later */}
      <div className="flex-1 flex justify-center items-center mt-2 pointer-events-auto">
        <Logo /> 
      </div>
      
      {/* Right side Menu */}
      <div className="flex-1 flex items-center justify-end gap-10 pointer-events-auto">
        <button className="text-white text-sm tracking-[0.15em] font-medium uppercase hover:opacity-80 transition-opacity">
          Book Now
        </button>
        {/* Fixed width and height so the SVG never gets crushed */}
        <button className="w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform">
          <Navhamburger />
        </button>
      </div>
      
    </nav>
  );
};

export default Navbar;