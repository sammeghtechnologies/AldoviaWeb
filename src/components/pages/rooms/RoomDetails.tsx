import { type RoomData } from '../../../data/roomsData';

const RoomDetails = ({ room }: { room: RoomData }) => {
  // 1. SMART TITLE SPLIT
  // Instead of taking the first word, we take the LAST word (e.g., "Rooms" or "Suite")
  // and leave everything else grouped together (e.g., "1 Bedroom" or "Executive").
  const titleParts = room.title.split(' ');
  const secondPart = titleParts.length > 1 ? titleParts.pop() : '';
  const firstPart = titleParts.join(' ') || room.title;

  return (
    <section 
      className="relative w-full min-h-screen py-24 px-10 md:px-20 flex items-center bg-[#F4F1E8] overflow-hidden"
    >
      <div 
        className="absolute right-[-5%] bottom-[-5%] w-[60vw] h-[90vh] bg-no-repeat bg-right-bottom bg-contain opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: `url('/assets/rooms/background/page2bg.png')` }}
      />

      <div className="max-w-[1300px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">

        {/* --- LEFT: The Expanding 3-Image Gallery --- */}
        <div className="group flex h-[400px] md:h-[550px] w-full md:w-[55%] gap-4 shrink-0 relative">
          {room.gallery.slice(0, 3).map((imgSrc, index) => (
            <div 
              key={index}
              className={`
                relative h-full overflow-hidden rounded-[2rem] shadow-lg cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${index === 2 ? 'w-[60%]' : 'w-[20%]'}
                group-hover:w-[15%]
                hover:!w-[70%]
              `}
            >
              <img 
                src={imgSrc || '/fallback.jpg'} 
                alt={`${room.title} view ${index + 1}`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          ))}
        </div>

        {/* --- RIGHT: Text & Split-Color Title --- */}
        <div className="flex flex-col relative w-full md:w-[45%] md:pl-10 lg:pl-12 justify-center">

          {/* THE MATHEMATICAL OVERLAP FIX 
              We use whitespace-nowrap to prevent long names ("1 Bedroom") from breaking into two lines.
          */}
          <div className="relative max-lg:-translate-x-[80px] lg:-translate-x-[280px] translate-y-[20px] lg:translate-y-[40px] pointer-events-none z-20 whitespace-nowrap">
            
            {/* Layer 1: Dark Brown Base */}
            <h2 className="text-[6rem] lg:text-[10.5rem] font-serif leading-[0.85] tracking-tight text-[#4c3628]">
              {firstPart}
            </h2>
            
            {/* Layer 2: Beige Overlay 
                MATH MAGIC: Because we translated the wrapper left by exactly 200px on desktop (and 80px on mobile),
                we use a polygon clip-path to make this layer exactly 200px wide (80px on mobile).
                This ensures the cut-line flawlessly hits the column boundary every single time, 
                no matter how long the text is.
            */}
            <h2 
              className="text-[6rem] lg:text-[10.5rem] font-serif leading-[0.85] tracking-tight text-[#f5f5dc] absolute top-0 left-0 max-lg:[clip-path:polygon(0_0,80px_0,80px_100%,0_100%)] lg:[clip-path:polygon(0_0,200px_0,200px_100%,0_100%)]"
            >
              {firstPart}
            </h2>
            
          </div>

          {/* SECOND PART ("Rooms", "Suite") */}
          <h2 className="text-[4rem] lg:text-[7.5rem] font-serif italic leading-none text-[#4c3628] mt-[10px] lg:mt-[20px]">
            {secondPart}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-sm md:text-[15px] text-[#423229] max-w-sm leading-[1.7] mt-8 lg:mt-10 font-medium z-10 relative">
            With its muted interiors, soft headboard and evocative ceiling accents, the {room.title} exudes an air of sophistication.
          </p>

          {/* ICONS & DETAILS */}
          <div className="flex flex-wrap gap-8 py-6 text-[#423229] z-10 relative">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">2 adults + 2 children</span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 11v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 11h18m-9 0v-8m-9 8h18" />
              </svg>
              <span className="text-sm font-medium">King bed</span>
            </div>
          </div>

          {/* BUTTON */}
          <button 
            className="w-fit border border-[#4c3628]/40 rounded-full text-[11px] font-bold tracking-[0.25em] text-[#4c3628] hover:bg-[#4c3628] hover:text-[#f5f5dc] transition-all duration-300 z-10 relative uppercase"
            style={{ 
              marginTop: '25px', 
              paddingTop: '18px', 
              paddingBottom: '18px', 
              paddingLeft: '48px', 
              paddingRight: '48px' 
            }}
          >
            BOOK NOW
          </button>

        </div>

      </div>
    </section>
  );
};

export default RoomDetails;