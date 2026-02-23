interface VenueInfoProps {
  title: string;
  subtitle: string;
  description: string;
  dimensions: {
    area: string;
    height: string;
    width: string;
    length: string;
  };
  seatings: {
    theater: string;
    ushape: string;
    classroom: string;
    boardroom: string;
    cluster: string;
    cocktails: string;
    round: string;
  };
  capacity: string;
  backgroundImage: string;
}

const layoutItems = [
  { key: "theater", label: "Theater", icon: "/assets/layouts/theater.png" },
  { key: "ushape", label: "U-Shape", icon: "/assets/layouts/ushape.png" },
  { key: "classroom", label: "Classroom", icon: "/assets/layouts/ushape.png" },
  { key: "boardroom", label: "Boardroom", icon: "/assets/layouts/ushape.png" },
  { key: "cluster", label: "Cluster", icon: "/assets/layouts/ushape.png" },
  { key: "cocktails", label: "Cocktails", icon: "/assets/layouts/ushape.png" },
  { key: "round", label: "Round", icon: "/assets/layouts/ushape.png" },
] as const;

export default function VenueInfo({
  title,
  subtitle,
  description,
  dimensions,
  seatings,
  capacity,
  backgroundImage,
}: VenueInfoProps) {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-40"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C2214]/35 via-[#1A120A]/80 to-[#120D08]/95" />

      <div className="relative z-10 !px-4 !pt-6 !pb-8 md:!px-7 md:!pt-8 md:!pb-10 text-white">
        <h2 className="[font-family:'Playfair_Display'] text-[50px] md:text-[56px] leading-[0.9] tracking-tight text-white">
          {title}
        </h2>

        <span className="block !mt-3 h-[3px] w-16 rounded-full bg-[#CFAB57]" />

        <p className="!mt-2 text-sm md:text-base text-white/82">{subtitle}</p>

        <p className="!mt-8 text-[17px] leading-8 text-white/90 max-w-[95%]">
          {description}
        </p>

        <div className="!mt-8 flex items-center gap-6 text-sm md:text-base text-white/92">
          <div className="flex items-center gap-2">
            <span className="text-[#CFAB57] text-base">↗</span>
            <span>{dimensions.area}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#CFAB57] text-base">👥</span>
            <span>{capacity}</span>
          </div>
        </div>

        <div className="!mt-6 grid grid-cols-3 gap-3 text-center text-white/90">
          <div className="rounded-lg bg-white/10 !py-2">
            <p className="text-xs text-white/65">Height</p>
            <p className="text-sm font-medium">{dimensions.height}</p>
          </div>
          <div className="rounded-lg bg-white/10 !py-2">
            <p className="text-xs text-white/65">Width</p>
            <p className="text-sm font-medium">{dimensions.width}</p>
          </div>
          <div className="rounded-lg bg-white/10 !py-2">
            <p className="text-xs text-white/65">Length</p>
            <p className="text-sm font-medium">{dimensions.length}</p>
          </div>
        </div>

        <h3 className="!mt-7 text-xl font-semibold">Seating Layout</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 bg-transparent">          {layoutItems.map((item) => (
          <div
          key={item.key}
          className="rounded-lg bg-white/10 !p-3 flex flex-col items-center text-center"
        >
          <img
            src={item.icon}
            alt={item.label}
            className="h-8 w-8 object-contain"
          />
        
          <p className="mt-2 text-[11px] text-white/70">
            {item.label}
          </p>
        
          <p className="text-sm font-semibold text-white">
            {seatings[item.key]}
          </p>
        </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 bottom-7 h-16 w-[2px] rounded-full bg-white/25" />
    </div>
  );
}
