import { useRef, useState } from "react";
import MenuFrame from "./components/MenuFrame/v2/MenuFrame";
import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
import ScrollLandingPage from "./Scroll/ScrollLanding";
import LogoRevealNew from "./Sections/LogoReveal/LogoRevealNew";

const Main = ({ isVideoFinished }: { isVideoFinished: boolean }) => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* PERSISTENT NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <MenuFrame masterTl={masterTl} introFinished={introFinished} />
      </div>

      <div id="landing-page" className="relative w-full">
        {/* PHASE 1: LOGO REVEAL (SWAN)
           Mounted as soon as the video timeline reaches its end.
           It sits on top of the video to hide any unmounting glitch.
        */}
        {isVideoFinished && !introFinished && (
          <div className="relative z-20 w-full">
            <LogoRevealNew 
              key="logo-phase-new"
              onComplete={() => {
                window.scrollTo(0, 0);
                setIntroFinished(true);
              }} 
            />
          </div>
        )}

        {/* PHASE 2: BUBBLES INTERACTION */}
        {introFinished && (
          <div className="relative z-30 w-full">
            <BubbleFeather_Interaction key="bubble-phase" />
          </div>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* VIDEO SECTION 
          Always visible until the Swan section is fully completed.
          This prevents the black screen glitch because the last blurred frame stays visible.
      */}
      <div className={`absolute inset-0 z-10 ${isVideoFinished ? 'pointer-events-none' : ''}`}>
        <ScrollLandingPage onComplete={() => setIsVideoFinished(true)} />
      </div>
      
      {/* MAIN CONTENT (Swan then Feathers) */}
      {isVideoFinished && <Main isVideoFinished={isVideoFinished} />}
    </div>
  );
};

export default LandingPage;