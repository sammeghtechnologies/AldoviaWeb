import { useRef, useState } from "react";
import MenuFrame from "./components/MenuFrame/v2/MenuFrame";
import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
import SwanInteraction from "./Sections/SwanInteraction/swan-scroller";
import ScrollLandingPage from "./Scroll/ScrollLanding";
import LogoRevealNew from "./Sections/LogoReveal/LogoRevealNew";

const Main = () => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#49261c] overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <MenuFrame masterTl={masterTl} />
      </div>

      <div id="landing-page" className="relative w-full h-full">
        
        {/* ✅ NEW: Manual Scroller Section replaces the old Auto-Logo */}
        {!introFinished && (
          <LogoRevealNew 
            key="logo-phase-new"
            onComplete={() => setIntroFinished(true)} 
          />
        )}

        {/* PHASE 2: SWAN (Triggered after manual scroll) */}
        {introFinished && !showBubbles && (
          <div className="relative z-40">
            <SwanInteraction 
              key="swan-phase"
              onComplete={() => setShowBubbles(true)} 
            />
          </div>
        )}

        {/* PHASE 3: BUBBLES */}
        {showBubbles && (
          <div className="fixed inset-0 z-30">
            <BubbleFeather_Interaction key="bubble-phase" />
          </div>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isScrollComplete, setIsScrollComplete] = useState(false);

  return (
    <>
      {/* INITIAL SCROLL COVER */}
      {!isScrollComplete && (
        <ScrollLandingPage onComplete={() => setIsScrollComplete(true)} />
      )}

      {/* MAIN CINEMATIC FLOW */}
      {isScrollComplete && <Main />}
    </>
  );
};

export default LandingPage;