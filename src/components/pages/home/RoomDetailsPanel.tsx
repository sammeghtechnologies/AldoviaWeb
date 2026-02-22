import type { RoomContent } from "../../roomDetailsPanel/RoomData";

interface PanelProps {
  activeId: number | null;
  content: null | RoomContent;
  onClose: () => void;
}

const RoomDetailsPanel = ({ activeId, content, onClose }: PanelProps) => {
  return (
    <div
    className={`fixed top-[90px] pt-5 right-0 h-[calc(100vh-90px)] w-full md:w-[50%] bg-[#f5f5dc] border-l border-white/5
transform transition-transform duration-700 ease-[0.22,1,0.36,1]
z-[9999] flex flex-col pointer-events-none
${activeId ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
  >

    {content && (
      <div className="font-sans text-[#49261c] h-full relative flex flex-col justify-between px-8 md:px-12 pt-24 pb-10">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-xs text-gray-500 hover:text-white transition-colors tracking-widest uppercase"
        >
          [ CLOSE ]
        </button>

        {/* Header */}
        <div className="mb-10 text-right pt-12">
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-[#49261c] mb-2 leading-tight">
            {content.title}
          </h2>
          <p className="text-xs tracking-[0.3em] text-[#49261c]-400 uppercase border-b border-white/20 pb-4 inline-block">
            {content.subtitle}
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-10">

          {/* Row 1: Left Image | Right Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="w-full h-[220px] md:h-[260px] overflow-hidden rounded-xl shadow-2xl border border-white/10">
              <img
                src={content.img1}
                alt="Room View 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="text-[#49261c]-300 text-sm md:text-base leading-relaxed font-light">
              {content.desc}
            </div>
          </div>

          {/* Row 2: Left Text | Right Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-[#49261c]-300 text-sm md:text-base leading-relaxed font-light">
              {content.desc}
            </div>

            <div className="w-full h-[220px] md:h-[260px] overflow-hidden rounded-xl shadow-2xl border border-white/10">
              <img
                src={content.img2}
                alt="Room View 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-10">
          <div>
            <span className="block text-xs text-[#49261c]-500 uppercase tracking-wider mb-1 mr-5">
              Nightly Rate
            </span>
            <span className="text-3xl font-light text-[#49261c]">
              {content.price}
            </span>
          </div>
          
          <button className="border border-white/80 rounded-full px-14 py-6 text-sm font-small tracking-[0.15em]  hover:bg-white hover:text-black transition-all duration-300">
          Book Now
        </button>




        </div>

      </div>
    )}
  </div>
  );
};

export default RoomDetailsPanel;