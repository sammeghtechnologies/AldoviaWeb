import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

// 1. Existing Swan Imports
import { SwanModel, WaterPlane, SplashWalls, SplashDroplets } from "./Sections/LogoReveal/LogoRevealNew";

// 2. NEW: Feather Imports
import NaturalFeather from "./components/NaturalFeather/NaturalFeather";
import CameraFocusController from "./components/CameraFocusController/CameraFocusController";

gsap.registerPlugin(ScrollTrigger);

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const CameraZoomController = ({ mountFeathers, startOffset }: { mountFeathers: boolean, startOffset: number }) => {
  const { camera } = useThree();

  useGSAP(() => {
    if (!mountFeathers) return;

    const zoomStart = startOffset + 900;
    const zoomEnd = startOffset + 2000;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: `${zoomStart}px top`,
        end: `${zoomEnd}px top`,
        scrub: 1.5,
      }
    });

    // We keep ONLY the automatic zoom forward
    tl.to(camera.position, {
      x: 7.0,
      y: 5.0,
      z: 24, 
      ease: "power2.inOut"
    });
  }, [mountFeathers, startOffset]);

  return null;
};


const MainCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // GPU Toggles (Both unmount securely now)
  const [mount3D, setMount3D] = useState(false);
  const [mountFeathers, setMountFeathers] = useState(false);

  // Swan States
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transformProgress, setTransformProgress] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);

  // Feather & Bubble States
  const [activeId, setActiveId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [allBubblesReady, setAllBubblesReady] = useState(false);
  const [burstAll, setBurstAll] = useState(false);

  // Inside MainCanvas component
const [swanOpacity, setSwanOpacity] = useState(1);

  const TOTAL_FRAMES = 499;
  const BLUR_START_FRAME = TOTAL_FRAMES - 25;
  const FRAME_PATH = (i: number) => `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;

  useEffect(() => {
    const loadedArray: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        loadedArray[i] = img;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setImages(loadedArray);
        setIsLoaded(true);
      };
    }
  }, []);

// Inside MainCanvas.tsx

  useGSAP(() => {
    if (!isLoaded || images.length === 0) return;

    // We expanded the track by 4000px to stop the "Slide Up" bug!
    const totalScroll = 16000; 
    const centerLogoWidth = isMobile ? "280px" : "420px";

    gsap.set(logoRef.current, { 
      autoAlpha: 0, scale: 0.8, top: "50%", left: "50%", 
      xPercent: -50, yPercent: -50, filter: "blur(60px)", width: centerLogoWidth 
    });
    gsap.set(canvasWrapperRef.current, { autoAlpha: 0, filter: "blur(120px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1.5,
 onUpdate: (self) => {
  const raw = self.progress;

  // 1. Calculate Opacity Fade (0.70 to 0.75)
  const fadeStart = 0.70;
  const fadeEnd = 0.75;
  const opacity = raw < fadeStart ? 1 : Math.max(0, 1 - (raw - fadeStart) / (fadeEnd - fadeStart));
  setSwanOpacity(opacity);

  // 2. Existing Swan Logic
  const swanRaw = Math.min(raw / 0.75, 1.0);
  if (swanRaw > 0.4) {
    setScrollProgress(swanRaw < 0.60 ? 0 : (swanRaw - 0.60) / 0.40);
    setTransformProgress(swanRaw < 0.60 ? 0 : swanRaw > 0.85 ? 1 : (swanRaw - 0.60) / 0.25);
    setSplashProgress(swanRaw < 0.90 ? 0 : (swanRaw - 0.90) / 0.10);
  }

  // 3. Feather Handoff
  if (raw >= 0.73 && raw < 0.99) {
      setMountFeathers(true);
      setAllBubblesReady(true);
      setBurstAll(raw > 0.732); 
  } else {
      setMountFeathers(false);
      setAllBubblesReady(false);
  }

  // 4. Cleanup (Keep unmount at 0.75 so the fade finishes first)
  if (raw >= 0.75) {
      setMount3D(false); 
  } else if (raw > 0.4) {
      setMount3D(true);
  }
}
      }
    });

    // STEP A: Play Video Sequence
    const frameObj = { frame: 0 };
    tl.to(frameObj, {
      frame: TOTAL_FRAMES - 1, snap: "frame", duration: 4.0,
      onUpdate: () => renderHero(frameObj.frame)
    });

    // STEP B: The "Mount" Trigger for Swan
    tl.to({}, {
      duration: 0.1,
      onStart: () => setMount3D(true), 
      onReverseComplete: () => setMount3D(false)
    }, ">");

    // STEP C & D: Fade and Logo moves
    tl.to(canvasWrapperRef.current, { autoAlpha: 1, filter: "blur(40px)", duration: 0.5 }, ">");
    tl.to(logoRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5 }, "<");
    tl.to(frameCanvasRef.current, { autoAlpha: 0, duration: 0.5 }, "<");
    tl.to(logoRef.current, { top: "37px", left: "48px", xPercent: 0, yPercent: 0, width: "56px", duration: 1.5, ease: "power2.inOut" }, ">");
    tl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 1.5, ease: "power2.inOut" }, "<");

    // STEP E: Pad for the flight animation (Original Padding)
    tl.to({}, { duration: 4.0 });

    // 🔥 STEP F: NEW PAD FOR FEATHERS! 
    // This perfectly locks the container in place so it DOES NOT slide up while the feathers fall.
    tl.to({}, { duration: 3.366 }); 

    function renderHero(index: number) {
      const ctx = frameCanvasRef.current?.getContext("2d", { alpha: false });
      if (!ctx || !images[index]) return;
      frameCanvasRef.current!.width = 1920;
      frameCanvasRef.current!.height = 1080;
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      if (frameIndex >= BLUR_START_FRAME) {
        const progress = (frameIndex - BLUR_START_FRAME) / 25;
        ctx.filter = `blur(${progress * 100}px)`;
      } else {
        ctx.filter = "none";
      }
      ctx.drawImage(images[index], 0, 0);
    }
  }, [isLoaded, images]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={frameCanvasRef} className="absolute inset-0 z-10 w-full h-full object-cover" />

      <div ref={canvasWrapperRef} className="absolute inset-0 z-20 overflow-hidden">
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}>
          <color attach="background" args={["#000000"]} />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={isMobile ? 65 : 40} />
            <ambientLight intensity={0.5} />
            <Environment preset="city" />             


             <CameraZoomController 
                mountFeathers={mountFeathers} 
                startOffset={11680} 
                />
            
            {mount3D && (
                <group>
                    {/* Pass swanOpacity to all components in the group */}
                <SwanModel 
                    scrollProgress={scrollProgress} 
                    transformProgress={transformProgress} 
                                />
                    <WaterPlane splashProgress={splashProgress} opacity={swanOpacity} />
                    <SplashWalls splashProgress={splashProgress} opacity={swanOpacity} />
                    <SplashDroplets splashProgress={splashProgress} opacity={swanOpacity} />
                </group>
                )}

            {mountFeathers && (
              <group>
                <CameraFocusController target={focusTarget} enabled={!!focusTarget} />
                
                {/* Offset is now explicitly locked at 12000 so the GSAP coordinates align perfectly */}
             
            {mountFeathers && (
              <group>
                <CameraFocusController target={focusTarget} enabled={!!focusTarget} />
                <NaturalFeather id={5} variant="mid-drift" startPos={[-11.0, 12, 1]} targetPos={[-17.0, 2.5, 1]} started={true} delay={0.8} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={2} variant="small-drag" startPos={[-6.5, 14, -2]} targetPos={[-16.5, -19.0, -2]} started={true} delay={0.6} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={3} variant="upper-pendulum" startPos={[-2.0, 10, -3]} targetPos={[7.0, 5.0, -3]} started={true} delay={0.3} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={1} variant="main" startPos={[2.5, 16, 0]} targetPos={[2.5, -10.0, 0]} started={true} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={4} variant="side-roll-upper" startPos={[7.0, 12, -1]} targetPos={[30.0, -4.0, -1]} started={true} delay={0.5} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={6} variant="high-drag-zig" startPos={[11.5, 18, 0]} targetPos={[17.5, -20.0, 0]} started={true} delay={0.2} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
              </group>
            )}
             </group>
            )}
          </Suspense>
        </Canvas>
      </div>

      <div ref={logoRef} className="absolute z-30 pointer-events-none" style={{ visibility: "hidden" }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>
  </div>
  );
};

export default MainCanvas;