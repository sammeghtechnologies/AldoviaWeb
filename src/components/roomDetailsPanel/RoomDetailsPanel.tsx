import type { RoomContent } from "./RoomData";

interface PanelProps {
  activeId: number | null;
  content: null | RoomContent;
  onClose: () => void;
}

const RoomDetailsPanel = ({ activeId, content, onClose }: PanelProps) => {
  return (
    <div 
      /* ✅ LIFTED TOP & SLIDE FROM RIGHT: 60% Width, No Blur */
      className={`fixed top-[5px] right-0 h-[calc(100vh-10px)] w-full md:w-[60%] bg-[#f5f5dc] z-[99999999] 
      transform transition-transform duration-700 ease-[0.22, 1, 0.36, 1] 
      flex flex-col border-l border-t border-[#49261c]/10 rounded-tl-[1rem]
      ${activeId ? 'translate-x-0' : 'translate-x-full'} 
      overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0)]`}
    >
      {content && (
        <div className="relative w-full h-full flex flex-col p-10 md:p-14 justify-between">
          
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col items-start w-full relative">
            <h2 className="text-[#49261c] text-3xl md:text-4xl font-light tracking-[3px] uppercase mb-8 ml-10">
              {content.title}
            </h2>
            
            <div className="flex items-center gap-10 w-full">
              <div className="w-[300px] md:w-[440px] aspect-[16/10] overflow-hidden border border-[#49261c]/10 ml-10">
                <img src={content.img1} alt="" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col gap-4">
                <button className="px-8 py-2 border border-[#49261c]/30 rounded-full text-[#49261c] text-[10px] tracking-[0.3em] uppercase hover:bg-[#49261c] hover:text-[#f5f5dc] transition-all">
                  Book Now
                </button>
                <div className="text-[10px] tracking-[0.2em] text-[#49261c]/40 uppercase">
                  Starting at <span className="text-[#49261c] ml-1">{content.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- BOTTOM SECTION --- */}
          <div className="flex flex-col items-end w-full relative mb-6">
            <h2 className="text-[#49261c] text-3xl md:text-4xl font-light tracking-[3px] uppercase mb-8 mr-10 text-right">
              {content.subtitle}
            </h2>
            
            <div className="flex items-end justify-end w-full gap-10">
              <div className="hidden lg:flex flex-col items-end gap-6 max-w-[280px] mb-4">
                <p className="text-[#49261c]/60 text-[10px] leading-relaxed tracking-[0.2em] uppercase italic text-right">
                  {content.desc}
                </p>
                <button className="px-8 py-2 border border-[#49261c]/30 rounded-full text-[#49261c] text-[10px] tracking-[0.3em] uppercase hover:bg-[#49261c] hover:text-[#f5f5dc] transition-all">
                  Book Now
                </button>
              </div>

              <div className="w-[300px] md:w-[440px] aspect-[16/10] overflow-hidden border border-[#49261c]/10 mr-4">
                <img src={content.img2} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* --- FOOTER (CLOSE BUTTON) --- */}
          <div className="w-full flex justify-between items-center text-[10px] tracking-[5px] uppercase text-[#49261c]/30 pt-6 border-t border-[#49261c]/10">
            <button 
              onClick={onClose} 
              className="hover:text-[#49261c] transition-colors cursor-pointer"
            >
              [ ← Back to Rooms ]
            </button>
            <div className="flex items-center gap-3">
              <span>Scroll</span>
              <span className="animate-bounce">↓</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RoomDetailsPanel;