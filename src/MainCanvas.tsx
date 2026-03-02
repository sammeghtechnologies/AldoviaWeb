import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

import { SwanModel, WaterPlane, SplashWalls, SplashDroplets } from "./Sections/LogoReveal/LogoRevealNew";
import NaturalFeather from "./components/NaturalFeather/NaturalFeather";
import CameraFocusController from "./components/CameraFocusController/CameraFocusController";
import WaterSurface from "./components/WaterSurface/WaterSurface";

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

    tl.to(camera.position, {
      x: 7.0,
      y: 5.0,
      z: 24, 
      ease: "power2.inOut"
    });
  }, [mountFeathers, startOffset, camera]);

  return null;
};

const MainCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [mount3D, setMount3D] = useState(false);
  const [mountFeathers, setMountFeathers] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [transformProgress, setTransformProgress] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [allBubblesReady, setAllBubblesReady] = useState(false);
  const [burstAll, setBurstAll] = useState(false);

  const [mountWater, setMountWater] = useState(false);
  const [fallProgress, setFallProgress] = useState(0);
  const [swanProgress, setSwanProgress] = useState(0);
  const feather3Ref = useRef<any>(null);

  const [swanOpacity, setSwanOpacity] = useState(1);
  
  // 🚀 NEW: States for the tiny ending swan
  const [mountEndSwan, setMountEndSwan] = useState(false);
  const [endSwanOpacity, setEndSwanOpacity] = useState(0);

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

  useGSAP(() => {
    if (!isLoaded || images.length === 0) return;

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
          const currentScroll = raw * 16000;
          
          const fadeStart = 0.70;
          const fadeEnd = 0.75;
          const opacity = raw < fadeStart ? 1 : Math.max(0, 1 - (raw - fadeStart) / (fadeEnd - fadeStart));
          setSwanOpacity(opacity);

          const swanRaw = Math.min(raw / 0.75, 1.0);
          if (swanRaw > 0.4) {
            setScrollProgress(swanRaw < 0.60 ? 0 : (swanRaw - 0.60) / 0.40);
            setTransformProgress(swanRaw < 0.60 ? 0 : swanRaw > 0.85 ? 1 : (swanRaw - 0.60) / 0.25);
            setSplashProgress(swanRaw < 0.90 ? 0 : (swanRaw - 0.90) / 0.10);
          }

          if (raw >= 0.73 && raw < 0.99) {
              setMountFeathers(true);
              setAllBubblesReady(true);
              setBurstAll(raw > 0.732); 
          } else {
              setMountFeathers(false);
              setAllBubblesReady(false);
          }

          const waterMountThreshold = 0.83; 
          // 🚀 FIX: Removed the early unmount bug (raw < 0.98) so it doesn't snap!
          if (raw >= waterMountThreshold) {
            setMountWater(true);
          } else {
            setMountWater(false);
          }

          const riseStart = 13280;
          const riseEnd = 13380;
          const fProg = THREE.MathUtils.clamp((currentScroll - riseStart) / (riseEnd - riseStart), 0, 1);
          setFallProgress(fProg);

          const landStart = 13980;
          const landEnd = 15800;
          const sProg = THREE.MathUtils.clamp((currentScroll - landStart) / (landEnd - landStart), 0, 1);
          setSwanProgress(sProg);

          // 🚀 NEW: The Swan Returns Logic
          if (currentScroll >= 13900) {
            setMountEndSwan(true);
          } else {
            setMountEndSwan(false);
          }
          const endSwanFade = THREE.MathUtils.smoothstep(sProg, 0.26, 0.60);
          setEndSwanOpacity(endSwanFade);

          if (raw >= 0.75) {
              setMount3D(false); 
          } else if (raw > 0.4) {
              setMount3D(true);
          }
        }
      }
    });

    const frameObj = { frame: 0 };
    tl.to(frameObj, {
      frame: TOTAL_FRAMES - 1, snap: "frame", duration: 4.0,
      onUpdate: () => renderHero(frameObj.frame)
    });

    tl.to({}, { duration: 0.1, onStart: () => setMount3D(true), onReverseComplete: () => setMount3D(false) }, ">");
    tl.to(canvasWrapperRef.current, { autoAlpha: 1, filter: "blur(40px)", duration: 0.5 }, ">");
    tl.to(logoRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5 }, "<");
    tl.to(frameCanvasRef.current, { autoAlpha: 0, duration: 0.5 }, "<");
    tl.to(logoRef.current, { top: "37px", left: "48px", xPercent: 0, yPercent: 0, width: "56px", duration: 1.5, ease: "power2.inOut" }, ">");
    tl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 1.5, ease: "power2.inOut" }, "<");
    tl.to({}, { duration: 4.0 });
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

             <CameraZoomController mountFeathers={mountFeathers} startOffset={11680} />
            
            {mount3D && (
                <group>
                  <SwanModel scrollProgress={scrollProgress} transformProgress={transformProgress} />
                  <WaterPlane splashProgress={splashProgress} opacity={swanOpacity} />
                  <SplashWalls splashProgress={splashProgress} opacity={swanOpacity} />
                  <SplashDroplets splashProgress={splashProgress} opacity={swanOpacity} />
                </group>
            )}

            {mountWater && (
              <WaterSurface 
                fallProgress={fallProgress} 
                swanProgress={swanProgress} 
                id3Ref={feather3Ref} 
              />
            )}

            {mountFeathers && (
              <group>
                <CameraFocusController target={focusTarget} enabled={!!focusTarget} />
                <NaturalFeather id={5} variant="mid-drift" startPos={[-11.0, 12, 1]} targetPos={[-17.0, 2.5, 1]} started={true} delay={0.8} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={2} variant="small-drag" startPos={[-6.5, 14, -2]} targetPos={[-16.5, -19.0, -2]} started={true} delay={0.6} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                
                {/* 🚀 CRITICAL FIX: The missing ref is now attached here! */}
                <NaturalFeather ref={feather3Ref} id={3} variant="upper-pendulum" startPos={[-2.0, 10, -3]} targetPos={[7.0, 5.0, -3]} started={true} delay={0.3} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                
                <NaturalFeather id={1} variant="main" startPos={[2.5, 16, 0]} targetPos={[2.5, -10.0, 0]} started={true} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={4} variant="side-roll-upper" startPos={[7.0, 12, -1]} targetPos={[30.0, -4.0, -1]} started={true} delay={0.5} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
                <NaturalFeather id={6} variant="high-drag-zig" startPos={[11.5, 18, 0]} targetPos={[17.5, -20.0, 0]} started={true} delay={0.2} activeId={activeId} burstAll={burstAll}  allBubblesReady={allBubblesReady} startOffset={11680} />
              </group>
            )}

            {/* 🚀 NEW: The tiny reflection swan mounting at the end */}
            {mountEndSwan && (
              <group
                position={[7.0, 0.85, -3.0]} 
                rotation={[Math.PI, 0, 0]} 
                scale={0.0015} 
              >
                <SwanModel 
                  scrollProgress={1.0}     
                  transformProgress={1.0} 
                  opacity={endSwanOpacity} 
                  isReflection={true} 
                />
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