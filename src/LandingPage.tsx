import { useState } from "react";
import { useNavigate } from "react-router";
import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
import LogoRevealNew from "./Sections/LogoReveal/LogoRevealNew";

const Main = () => {
  const navigate = useNavigate();
  const [introFinished, setIntroFinished] = useState(false);
  const [showBookNow, setShowBookNow] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {showBookNow && (
        <div className="fixed top-6 right-6 z-50 pointer-events-none">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="pointer-events-auto font-lust px-8 py-4 text-white text-[14px] md:text-[16px] tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-70 bg-transparent border-none"
          >
            Book Now
          </button>
        </div>
      )}

      <div id="landing-page" className="relative w-full">
        {/* PHASE 1: LOGO REVEAL (VIDEO + SWAN COMBINED)
            This is now the starting point of the application.
        */}
        {!introFinished && (
          <div className="relative z-20 w-full">
            <LogoRevealNew 
              key="logo-phase-new"
              onLogoCornerReached={() => setShowBookNow(true)}
              onBookNowVisibilityChange={setShowBookNow}
              onComplete={() => {
                window.scrollTo(0, 0); // Clear scroll height for the next section
                setShowBookNow(true);
                setIntroFinished(true);
              }} 
              // Handles reversing back into the video/swan from phase 2
              // onReverse={() => {
              //   // Already in Phase 1, no reverse needed here
              // }}
            />
          </div>
        )}

        {/* PHASE 2: BUBBLES INTERACTION
            Mounts after the LogoRevealNew sequence finishes its splash.
        */}
        {introFinished && (
          <div className="relative z-30 w-full">
            <BubbleFeather_Interaction 
              key="bubble-phase" 
              // ✅ REVERSE TRIGGER: Returns user to the Swan reveal
              // onReverse={() => {
              //   setIntroFinished(false);
              // }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Starting directly with the Main component. 
          No redundant video-only loaders needed anymore.
      */}
      <Main />
    </div>
  );
};

export default LandingPage;
