import React from "react";
import { useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import RestaurantSection from "../../sections/RestaurantSection";
import Footer from "../../sections/Footer";

const DiningHeroPage: React.FC = () => {
  const navigate = useNavigate();
  const diningImages = [
    "/assets/herobackgrounds/dining/Buvette.jpg",
    "/assets/herobackgrounds/dining/Buvette1.jpg",
    "/assets/herobackgrounds/dining/Buvette.jpg",
  ];

  return (
    <section className="relative min-h-screen w-full">
      <MenuFrame showBookNow={false} />
      <div className="absolute left-5 top-24 z-[2147483645] md:left-8 md:top-26">
        <HeroBreadcrumb
          label="Dining"
          onHomeClick={() => navigate("/home")}
        />
      </div>
      <AnimatedImageHero
        images={diningImages}
        title="Exquisite Dining"
        subtitle="Curated flavors, elegant ambiance, and memorable culinary experiences"
        buttonLabel="Explore Dining"
        enableEntryAnimation
        entryDuration={2.1}
        enableStaggeredTitle
        enableTypingSubtitle
        centerContentClassName="-translate-y-10 lg:translate-y-0 lg:!w-full lg:!mx-auto lg:text-center [&_p]:!mt-3"
        controlsWrapperClassName="absolute bottom-[10%] left-1/2 z-30 w-[min(92%,520px)] -translate-x-1/2"
        controlsClassName="!mt-0 !px-0"
        controlsProgressBarClassName="!w-[140px] !max-w-[140px] shrink-0"
      />
      <RestaurantSection/>
      <Footer/>
    </section>
  );
};

export default DiningHeroPage;
