import React from "react";
import { useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";

const venueImages = [
  "assets/venues/herobanner/galaxy1.jpg",
  "assets/venues/herobanner/corridor.jpg",
  "assets/venues/herobanner/lotus.jpg",
];

const HeroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <MenuFrame showBookNow={false} />
      <div className="fixed left-5 top-24 z-[2147483645] md:left-8 md:top-26">
        <HeroBreadcrumb
          label="Venues"
          onHomeClick={() => navigate("/home")}
        />
      </div>
      <AnimatedImageHero
        images={venueImages}
        title="Our Venues"
        subtitle="Savor the finest flavors in our curated dining destinations."
        buttonLabel="Plan Your Event"
        onButtonClick={() => navigate("/home")}
        enableTypingSubtitle
        centerContentClassName="-translate-y-10 lg:!w-full lg:!mx-auto lg:text-center"
        controlsWrapperClassName="absolute bottom-[10%] left-1/2 z-30 w-[min(92%,520px)] -translate-x-1/2"
        controlsClassName="!mt-0 !px-0"
        controlsProgressBarClassName="!w-[140px] !max-w-[140px] shrink-0"
      />
    </>
  );
};

export default HeroPage;
