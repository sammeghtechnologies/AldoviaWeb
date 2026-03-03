import type { RoomContent } from "../../roomDetailsPanel/RoomData";

interface PanelProps {
  activeId: number | null;
  content: null | RoomContent;
  onClose: () => void;
}

const RoomDetailsPanel = ({ activeId, content, onClose }: PanelProps) => {
  return (
    <div
      style={{ pointerEvents: activeId ? 'auto' : 'none' }}
      className={`fixed top-[90px] pt-5 !pl-5 right-0 h-[calc(100vh-90px)] w-full md:w-[50%] bg-[#f5f5dc] border-l border-white/5
        transform transition-transform duration-700 ease-[0.22,1,0.36,1]
        z-[99999] flex flex-col
        ${activeId ? "translate-x-0" : "translate-x-full"}`}
    >
      {content && (
        /* 🚀 INCREASED LEFT PADDING: Changed from px-8 to pl-16 (mobile) and pl-24 (desktop) */
        <div className="font-sans text-[#49261c] h-full relative flex flex-col justify-between pl-16 md:pl-24 pr-10 md:pr-14 pt-24 pb-10">

          {/* Fixed Close Button - Shifted right to left-10/14 to stay aligned with new padding */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 left-10 md:left-14 text-xs text-gray-500 hover:text-black transition-colors tracking-widest uppercase cursor-pointer z-[100001] p-2"
          >
            [ CLOSE ]
          </button>

        {/* Header - Kept right aligned but added slight right padding for balance */}
        <div className="mb-14 text-right pt-12 pr-4">
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-[#49261c] mb-3 leading-tight">
            {content.title}
          </h2>
          <p className="text-[10px] tracking-[0.3em] text-[#49261c]/60 uppercase border-b border-[#49261c]/10 pb-4 inline-block">
            {content.subtitle}
          </p>
        </div>

        {/* Content Section - Added overflow-y-auto to handle smaller screens */}
        <div className="flex flex-col gap-12 overflow-y-auto pr-4 custom-scrollbar">

          {/* Row 1: Left Image | Right Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="w-full h-[220px] md:h-[280px] overflow-hidden rounded-xl shadow-xl border border-black/5">
              <img
                src={content.img1}
                alt="Room View 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="text-[#49261c]/80 text-sm md:text-base leading-relaxed font-light">
              {content.desc}
            </div>
          </div>

          {/* Row 2: Left Text | Right Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-[#49261c]/80 text-sm md:text-base leading-relaxed font-light order-2 md:order-1">
              {content.desc}
            </div>

            <div className="w-full h-[220px] md:h-[280px] overflow-hidden rounded-xl shadow-xl border border-black/5 order-1 md:order-2">
              <img
                src={content.img2}
                alt="Room View 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#49261c]/10 pt-8 mt-10">
          <div>
            <span className="block text-[10px] text-[#49261c]/50 uppercase tracking-wider mb-1">
              Nightly Rate
            </span>
            <span className="text-3xl font-light text-[#49261c]">
              {content.price}
            </span>
          </div>
          
          <button className="border border-[#49261c]/30 rounded-full px-10 md:px-14 py-4 md:py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#49261c] hover:text-[#f5f5dc] transition-all duration-300">
            Book Now
          </button>
        </div>

      </div>
    )}
  </div>
  );
};

export default RoomDetailsPanel;