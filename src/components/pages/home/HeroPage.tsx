import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import DeferredSection from "../../sections/DeferredSection";
import ExperienceSection from "../../sections/ExperienceSection";
import LocationSection from "../../sections/LocationSection";
import Footer from "../../sections/Footer";
import SplitActionButtons from "../../ui/SplitActionButtons";

const CarouselSection = lazy(() => import("../../sections/CarouselSection"));
const ImmersiveSection = lazy(() => import("../../sections/ImmersiveSection"));
const RoomsSection = lazy(() => import("../../sections/RoomsSection"));

const HeroPage: React.FC = () => {
  const [showStickyActions, setShowStickyActions] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShowStickyActions(window.scrollY >= window.innerHeight * 0.9);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <MenuFrame showBookNow={false} />

      <section className="relative h-screen w-full overflow-hidden text-white">

        {/* Background Image */}
        <motion.img
          src="/assets/hero/hero.jpg"
          alt="Luxury Resort"
          loading="eager"
          fetchPriority="high"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Luxury Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative z-10 h-full px-6 py-8 md:px-16">
          <div className="flex h-full items-center justify-center">
            <DeferredSection placeholderClassName="h-[40vh] w-full" rootMargin="0px 0px">
              <HeroContent />
            </DeferredSection>
          </div>

          <div className="absolute bottom-30 left-1/2 -translate-x-1/2">
            <HeroStats />
          </div>
          <ScrollIndicator />
        </div>
      </section>

      <DeferredSection placeholderClassName="min-h-[70vh] bg-[var(--color-secondary)]" rootMargin="400px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[var(--color-secondary)]" />}>
          <CarouselSection />
        </Suspense>
      </DeferredSection>

      <DeferredSection placeholderClassName="min-h-[70vh] bg-[rgba(33,20,15,0.80)]" rootMargin="400px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[rgba(33,20,15,0.80)]" />}>
          <ImmersiveSection />
        </Suspense>
      </DeferredSection>

      <DeferredSection placeholderClassName="min-h-[70vh] bg-[#FBF6E6]" rootMargin="300px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[#FBF6E6]" />}>
          <RoomsSection />
        </Suspense>
      </DeferredSection>

      <DeferredSection placeholderClassName="min-h-[70vh] bg-[#FBF6E6]" rootMargin="300px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[#FBF6E6]" />}>
          <ExperienceSection/>
        </Suspense>
      </DeferredSection>

      <DeferredSection placeholderClassName="min-h-[70vh] bg-[#FBF6E6]" rootMargin="300px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[#FBF6E6]" />}>
          <LocationSection/>
        </Suspense>
      </DeferredSection>
      <DeferredSection placeholderClassName="min-h-[70vh] bg-[#FBF6E6]" rootMargin="300px 0px">
        <Suspense fallback={<div className="min-h-[70vh] bg-[#FBF6E6]" />}>
          <Footer/>
        </Suspense>
      </DeferredSection>

      <div
        className={`fixed !bottom-0 !left-0 !right-0 !w-screen !z-[99999] !flex !flex-row !items-center !justify-center !transition-all !duration-300 ${
          showStickyActions ? "!translate-y-0 !opacity-100" : "!translate-y-6 !opacity-0 !pointer-events-none"
        }`}
      >
        <SplitActionButtons className="!w-full md:!w-[492px]" />
      </div>
    </>
  );
};

export default HeroPage;
