import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import ScrollIndicator from "./ScrollIndicator";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import DeferredSection from "../../sections/DeferredSection";

const CarouselSection = lazy(() => import("../../sections/CarouselSection"));
const ImmersiveSection = lazy(() => import("../../sections/ImmersiveSection"));
const RoomsSection = lazy(() => import("../../sections/RoomsSection"));
const ExperienceSection = lazy(() => import("../../sections/ExperienceSection"));
const LocationSection = lazy(() => import("../../sections/LocationSection"));
const Footer = lazy(() => import("../../sections/Footer"));
const SplitActionButtons = lazy(() => import("../../ui/SplitActionButtons"));

const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const [showStickyActions, setShowStickyActions] = React.useState(false);

  React.useEffect(() => {
    // Warm lazy chunks after initial render so first paint stays fast
    // while reducing delay when users scroll into deferred sections.
    const prefetch = () => {
      void import("../../sections/CarouselSection");
      void import("../../sections/ImmersiveSection");
      void import("../../sections/RoomsSection");
      void import("../../sections/ExperienceSection");
      void import("../../sections/LocationSection");
      void import("../../sections/Footer");
      void import("../../ui/SplitActionButtons");
    };

    const idleCallback = (window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;
    const cancelIdleCallback = (window as Window & {
      cancelIdleCallback?: (id: number) => void;
    }).cancelIdleCallback;

    if (idleCallback) {
      const id = idleCallback(prefetch);
      return () => {
        if (cancelIdleCallback) cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(prefetch, 1200);
    return () => window.clearTimeout(timer);
  }, []);

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
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="https://res.cloudinary.com/dla9ezffr/video/upload/v1773313435/home_q988lh.mp4" type="video/mp4" />
        </motion.video>

        {/* Keep center lights visible while preserving text readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,220,160,0.14)_0%,rgba(255,220,160,0.06)_28%,rgba(0,0,0,0)_56%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.20)_38%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.52)_100%)]" />

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

      <div id="home-experience-section" className="scroll-mt-[12vh]">
        <DeferredSection placeholderClassName="min-h-[70vh] bg-[#FBF6E6]" rootMargin="300px 0px">
          <Suspense fallback={<div className="min-h-[70vh] bg-[#FBF6E6]" />}>
            <ExperienceSection/>
          </Suspense>
        </DeferredSection>
      </div>

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
        <Suspense fallback={<div className="h-12 w-full md:w-[492px]" />}>
          <SplitActionButtons
            onPrimaryClick={() => navigate("/rooms")}
            onSecondaryClick={() => navigate("/venues")}
            className="!w-full md:!w-[492px]"
          />
        </Suspense>
      </div>
    </>
  );
};

export default HeroPage;
