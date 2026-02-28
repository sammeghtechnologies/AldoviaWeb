import { useRef, useState } from "react";
import MenuFrame from "./components/MenuFrame/v2/MenuFrame";
import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
import LogoRevealNew from "./Sections/LogoReveal/LogoRevealNew";

const Main = () => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* PERSISTENT NAVBAR 
          Visible during both phases. 'introFinished' toggles its internal states.
      */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <MenuFrame masterTl={masterTl} introFinished={introFinished} disableTopBarBackground />
      </div>

      <div id="landing-page" className="relative w-full">
        {/* PHASE 1: LOGO REVEAL (VIDEO + SWAN COMBINED)
            This is now the starting point of the application.
        */}
        {!introFinished && (
          <div className="relative z-20 w-full">
            <LogoRevealNew 
              key="logo-phase-new"
              onComplete={() => {
                window.scrollTo(0, 0); // Clear scroll height for the next section
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
