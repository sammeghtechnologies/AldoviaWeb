import React from "react";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const LocationSection: React.FC = () => {
  // 👉 Replace with your real coordinates
  const latitude = 13.2068724;
  const longitude = 77.6338742;

  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="w-full bg-[#FBF6E6] !py-20 !px-6 md:!px-10 lg:!px-16 flex justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

        {/* Heading */}
        <SlidingTitleReveal
          lines={["Perfectly Located"]}
          className="text-[32px] md:text-[42px] font-medium text-[#1C1917] [font-family:'Playfair_Display']"
        />

        <p className="text-[#6B5E57] mt-3 text-[15px]">
          Easily accessible luxury resort
        </p>

        {/* Airport Badge */}
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-[#E9D6A5] text-[#3D2B1F] !px-4 !py-2 rounded-full text-sm font-medium">
            📍 15 minutes from Bangalore Airport
          </span>
        </div>

        {/* Map */}
        <div className="!mt-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Hotel Location"
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Get Directions Button */}
        <div className="!mt-10">
          <button
            onClick={() => window.open(googleMapsLink, "_blank")}
            className="bg-[#5A3326] hover:bg-[#47271C] text-white
                       !px-10 !py-3 rounded-full text-[1em]
                       transition duration-300 shadow-md"
          >
            ➤ Get Directions
          </button>
        </div>

      </div>
    </section>
  );
};

export default LocationSection;
