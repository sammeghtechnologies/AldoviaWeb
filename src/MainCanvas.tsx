import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { PerspectiveCamera, Environment} from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router";
import * as THREE from "three";
import { useMemo } from "react";
import { SwanModel, WaterPlane, SplashDroplets,SplashWalls } from "./Sections/LogoReveal/LogoRevealNew";
import NaturalFeather from "./components/NaturalFeather/NaturalFeather";
import CameraFocusController from "./components/CameraFocusController/CameraFocusController";
import WaterSurface from "./components/WaterSurface/WaterSurface";

// UI Components
import RoomDetailsPanel from "./components/pages/home/RoomDetailsPanel";

gsap.registerPlugin(ScrollTrigger);
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
// const bubbleRouteMap: Record<number, string> = {
//   1: "/rooms",
//   2: "/venues",
//   3: "/venues?mode=convention",
//   4: "/rooms",
//   5: "/venues",
//   6: "/venues?mode=convention",
// };

// --- ADVANCED CAMERA CONTROLLER ---
const CameraZoomController = ({ mountFeathers, activeId, startOffset }: { mountFeathers: boolean, activeId: number | null, startOffset: number }) => {
  const { camera } = useThree();
  const scrollProxy = useRef({ x: 0, y: 0, z: 70 });
  const activeIdRef = useRef(activeId);
  const isReturning = useRef(false);
  const hasOpened = useRef(false);

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // Handle Scroll Zoom
  useGSAP(() => {
    if (!mountFeathers) return;

    scrollProxy.current = { x: 0, y: 0, z: 70 };
    const zoomStart = startOffset + 900;
    const zoomEnd = startOffset + 2000;

    gsap.to(scrollProxy.current, {
      x: 7.0, y: 5.0, z: 24,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: document.body,
        start: `${zoomStart}px top`,
        end: `${zoomEnd}px top`,
        scrub: 1.5,
      },
      onUpdate: () => {
        // Only move camera with scroll if NO feather is selected and we aren't currently gliding back
        if (activeIdRef.current === null && !isReturning.current) {
          camera.position.set(scrollProxy.current.x, scrollProxy.current.y, scrollProxy.current.z);
        }
      }
    });
  }, [mountFeathers, startOffset, camera]);

  // Handle Return from Click-Zoom
  useEffect(() => {
    if (activeId !== null) {
      hasOpened.current = true;
      isReturning.current = false;
    } else if (activeId === null && hasOpened.current && mountFeathers) {
      isReturning.current = true;
      gsap.to(camera.position, {
        x: scrollProxy.current.x,
        y: scrollProxy.current.y,
        z: scrollProxy.current.z,
        duration: 1.5,
        ease: "expo.inOut",
        overwrite: "auto",
        onComplete: () => { isReturning.current = false; }
      });
      gsap.to(camera.rotation, {
        x: 0, y: 0, z: 0,
        duration: 1.5,
        ease: "expo.inOut",
        overwrite: "auto"
      });
    }
  }, [activeId, mountFeathers, camera]);

  return null;
};


// --- THE INFINITE LOOP CAMERA CONTROLLER ---

// --- THE INFINITE LOOP CONTROLLER (1-FRAME GLITCH FIXED) ---
const CameraDiveController = ({ diveProgress, activeId }: { diveProgress: number, activeId: number | null }) => {
  const { camera } = useThree();
  
  const hasDived = useRef(false);
  const preDiveRotation = useRef(new THREE.Euler());
  const preDiveUp = useRef(new THREE.Vector3());

  useFrame(() => {
    if (activeId !== null) return;

    if (diveProgress === 0) {
      if (hasDived.current) {
        if (window.scrollY < 10000) {
            camera.position.set(0, 0, 70);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, -5, 0);
        } else {
            camera.rotation.copy(preDiveRotation.current);
            camera.up.copy(preDiveUp.current);
        }
        hasDived.current = false;
      }
      return; 
    }

    if (!hasDived.current) {
      preDiveRotation.current.copy(camera.rotation);
      preDiveUp.current.copy(camera.up);
      hasDived.current = true;
    }

    const freezePoint = 0.60; 

    // 🚀 PHASE 1: YOUR EXACT SOMERSAULT DIVE
    // THE FIX: Changed to Strictly Less Than (<). 
    // This forces the camera to instantly teleport to the sky the exact millisecond it hits 0.60
    if (diveProgress < freezePoint) {
      const swanX = 6.0;    const swanY = -5.5;   const swanZ = -3.0;
      const featherX = 7.0; const featherY = 5.0; const featherZ = -3.0;
      const startX = 7.0;   const startY = 5.0;   const startZ = 24.0;

      const startRadius = Math.hypot(startY - swanY, startZ - swanZ);
      const startAngle = Math.atan2(startY - swanY, startZ - swanZ);

      const endX = swanX;
      const endAngle = startAngle - (Math.PI * 1.2); 
      const endRadius = startRadius * 0.85;  

      const p = diveProgress; 
      const currentRadius = THREE.MathUtils.lerp(startRadius, endRadius, p);
      const currentAngle = THREE.MathUtils.lerp(startAngle, endAngle, p);
      
      const targetX = THREE.MathUtils.lerp(startX, endX, p);
      const targetY = swanY + currentRadius * Math.sin(currentAngle);
      const targetZ = swanZ + currentRadius * Math.cos(currentAngle);

      camera.position.set(targetX, targetY, targetZ);

      const focusX = THREE.MathUtils.lerp(featherX, swanX, p);
      const focusY = THREE.MathUtils.lerp(featherY, swanY, p);
      const focusZ = THREE.MathUtils.lerp(featherZ, swanZ, p);

      camera.up.set(0, Math.cos(currentAngle), -Math.sin(currentAngle));
      camera.lookAt(focusX, focusY, focusZ);
    } 
    // 🚀 PHASE 2: TELEPORT TO TOP OF START SWAN & SWEEP DOWN
    else {
      const p2 = (diveProgress - freezePoint) / (1.0 - freezePoint);

      const swanY = -5.0; 

      const startRadius = 40.0;
      const endRadius = Math.hypot(0 - swanY, 70.0 - 0); 
      
      const startAngle = Math.PI / 2;
      const endAngle = Math.atan2(0 - swanY, 70.0 - 0); 
      
      const currentRadius = THREE.MathUtils.lerp(startRadius, endRadius, p2);
      const currentAngle = THREE.MathUtils.lerp(startAngle, endAngle, p2);

      const lockOffset = THREE.MathUtils.lerp(0.01, 0, p2);

      camera.position.set(
        0,
        swanY + currentRadius * Math.sin(currentAngle),
        lockOffset + currentRadius * Math.cos(currentAngle)
      );

      camera.up.set(0, 1, 0); 
      camera.lookAt(0, swanY, 0); 
    }
  });

  return null;
};


// --- THE SWAN REFLECTION FX WRAPPER ---
// --- THE SWAN REFLECTION FX WRAPPER ---
const EndSwanWrapper = ({ opacity, scale, whiteness, clipY }: { opacity: number, scale: number, whiteness: number, clipY: number }) => {
  const groupRef = useRef<THREE.Group>(null);
const whiteColor = useMemo(() => new THREE.Color(2.5, 2.5, 2.5), []);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child: any) => {
        if (child.isMesh && child.material && child.material.color) {
          if (child.userData.origColor === undefined) {
            child.userData.origColor = child.material.color.clone();
          }
          child.material.color.lerpColors(child.userData.origColor, whiteColor, whiteness);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[6.0, -5.5, -3.0]} rotation={[Math.PI, Math.PI / 40, 0]} scale={scale}>
      <SwanModel scrollProgress={0.0} transformProgress={0.0} opacity={opacity} isReflection={true} clipY={clipY} />
    </group>
  );
};


const MainCanvas = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Core Toggles
  const [mount3D, setMount3D] = useState(false);
  const [mountFeathers, setMountFeathers] = useState(false);
  const [mountWater, setMountWater] = useState(false);
  const [mountEndSwan, setMountEndSwan] = useState(false);

  const [mountBackWater, setMountBackWater] = useState(false);

  const [globalFade, setGlobalFade] = useState(1);


  // Animation Progress States
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transformProgress, setTransformProgress] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);
  const [fallProgress, setFallProgress] = useState(0);
  const [swanProgress, setSwanProgress] = useState(0);
  
  // Visual States
  const [swanOpacity, setSwanOpacity] = useState(1);
  const [endSwanOpacity, setEndSwanOpacity] = useState(0);

  const [endSwanScale, setEndSwanScale] = useState(0.32);    
  const [endSwanWhite, setEndSwanWhite] = useState(0);
  const [endSwanClipY, setEndSwanClipY] = useState(-0.01); // 👈 ADD THIS

  // Interaction States
  const [activeId, setActiveId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [allBubblesReady, setAllBubblesReady] = useState(false);
  const [burstAll, setBurstAll] = useState(false);
  const [showCornerActions, setShowCornerActions] = useState(false);
  const [useCornerLogo, setUseCornerLogo] = useState(false);

  const feather3Ref = useRef<any>(null);
  const cornerActionsVisibleRef = useRef(false);

  // --- DIVE STATE ---
  const [diveProgress, setDiveProgress] = useState(0);
  

  // Image Sequence Loading
  const TOTAL_FRAMES = 499;
  const BLUR_START_FRAME = TOTAL_FRAMES - 25;
  const FRAME_PATH = (i: number) => `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;

  // --- SCROLL LOCK LOGIC ---
  useEffect(() => {
    if (activeId !== null) {
      // Disable scrolling when a bubble is clicked
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Extra safety for mobile touch scrolling
    } else {
      // Re-enable scrolling when panel is closed
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    // Cleanup function: ensures scrolling is restored if the component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [activeId]);

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

  // --- 🚀 TRIGGER ZOOM + PANEL (NOW WITH LOCK LOGIC) ---
  const handleBubbleClick = (id: number, target: THREE.Vector3) => {
    // 🛑 If the user has scrolled down into the swan reflection sequence, BLOCK the click
    const currentScrollY = window.scrollY;
    
    // The swan mounts at 13900, we add a buffer for safety
    if (currentScrollY > 13800) {
        console.log("Click blocked! Reflection animation is active.");
        return; 
    }

    setActiveId(id);
    setFocusTarget(new THREE.Vector3(target.x + 5.7, target.y+0.5, target.z + 15.0));
  };

  useGSAP(() => {
    if (!isLoaded || images.length === 0) return;

    const totalScroll = 15000;
    const centerLogoWidth = isMobile ? "360px" : "660px";
    const cornerLogoWidth = isMobile ? "112px" : "140px";

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
          const currentScroll = raw * 15000;
          const shouldShowCornerActions = raw >= 0.4;

          const diveStart = 14490;
          const diveEnd = 14950; 
          const dProg = THREE.MathUtils.clamp((currentScroll - diveStart) / (diveEnd - diveStart), 0, 1);
          const smoothDive = dProg < 0.5 ? 2 * dProg * dProg : 1 - Math.pow(-2 * dProg + 2, 2) / 2;
          setDiveProgress(smoothDive);

          const freezePoint = 0.60; 
          const isLoopingBack = smoothDive >= freezePoint;
          // 🚀 AGGRESSIVE FADE: Everything is gone by 0.11 dive progress
// 🚀 THE FIX: Start at 1.0 and drop to 0.0 as smoothDive reaches 0.11
          const fade = 1.0 - THREE.MathUtils.smoothstep(smoothDive, 0.0, 0.11);
          setGlobalFade(fade);

          // 🚀 THE FIX: Teleport to exactly 45% (6750px). 
          // This is the exact moment the logo frames vanish, the Swan mounts, and the 3D animation is at 0%.
          if (self.progress >= 0.999 && self.direction === 1) {
            window.scrollTo({ top: 6750, behavior: "instant" });
          }

          if (cornerActionsVisibleRef.current !== shouldShowCornerActions) {
            cornerActionsVisibleRef.current = shouldShowCornerActions;
            setShowCornerActions(shouldShowCornerActions);
            setUseCornerLogo(shouldShowCornerActions);
          }

          const fadeStart = 0.70; const fadeEnd = 0.75;
          setSwanOpacity(raw < fadeStart ? 1 : Math.max(0, 1 - (raw - fadeStart) / (fadeEnd - fadeStart)));

          const swanRaw = Math.min(raw / 0.75, 1.0);
          if (swanRaw > 0.4) {
            setSplashProgress(isLoopingBack ? 0 : (swanRaw < 0.90 ? 0 : (swanRaw - 0.90) / 0.10));
          }
          setScrollProgress(isLoopingBack ? 0 : (raw < 0.45 ? 0 : raw >= 1.0 ? 1 : (raw - 0.45) / 0.55));
          setTransformProgress(isLoopingBack ? 0 : (raw < 0.45 ? 0 : raw >= 1.0 ? 1 : (raw - 0.45) / 0.55));

          const riseStart = 13280; const riseEnd = 13380;
          setFallProgress(isLoopingBack ? 0 : THREE.MathUtils.clamp((currentScroll - riseStart) / (riseEnd - riseStart), 0, 1));

         const landStart = 13980; const landEnd = 15000;
          const sProg = THREE.MathUtils.clamp((currentScroll - landStart) / (landEnd - landStart), 0, 1);
          setSwanProgress(isLoopingBack ? 0 : sProg);

          // 🚀 1. THE LOCK: Use smoothstep to ensure growth is DEAD ZERO until sProg > 0.6
          // This prevents the "too early" jump you're seeing in the screenshots.
          const growth = THREE.MathUtils.smoothstep(sProg, 0.60, 1.0); 
          
          // 🚀 2. CONTROLLED SCALE: Only starts growing after 60% of the swan's landing sequence
          // We use 0.8 instead of 2.5 so it doesn't get "massive" too fast.
          setEndSwanScale(isLoopingBack ? 0.32 : 0.32 + (growth * 0.8)); 
          setEndSwanWhite(isLoopingBack ? 0 : growth);

          // 🚀 3. CALM CLIPPING: Only lifts the blade as the growth actually happens.
          // Starting at -0.01 and only going to -5.0 ensures it doesn't "get up on the water" too early.
// 🚀 THE FIX: Change subtraction (-) to addition (+) 
          // Adding to the constant moves a (0, -1, 0) plane UP in world space.
          setEndSwanClipY(isLoopingBack ? -0.01 : -0.01 + (growth * 15.0));
          if (isLoopingBack) {
            setMountFeathers(false);
            setAllBubblesReady(false);
            setMountWater(false);
            setMountEndSwan(false);
            setEndSwanOpacity(0);
            
            setMount3D(true);
            setMountBackWater(false); 
          } else {
            if (raw >= 0.73 && raw < 0.99) {
              setMountFeathers(true);
              setAllBubblesReady(true);
              setBurstAll(raw > 0.732);
            } else {
              setMountFeathers(false);
              setAllBubblesReady(false);
            }

            setMountWater(raw >= 0.83);
            setMountEndSwan(currentScroll >= 13900);
            setEndSwanOpacity(THREE.MathUtils.smoothstep(sProg, 0.05, 0.50));

            if (raw >= 0.73) {
              setMount3D(false);
            } else if (raw > 0.4) {
              setMount3D(true);
            }

            if (raw >= 0.795) {
              setMountBackWater(false);
            } else if (raw > 0.4) {
              setMountBackWater(true);
            }
          }
        }
      }
    });

    // Sequence Timeline
    const frameObj = { frame: 0 };
    tl.to(frameObj, { frame: TOTAL_FRAMES - 1, snap: "frame", duration: 4.0, onUpdate: () => renderHero(frameObj.frame) });
    tl.to({}, { duration: 0.1, onStart: () => setMount3D(true), onReverseComplete: () => setMount3D(false) }, ">");
    tl.to(canvasWrapperRef.current, { autoAlpha: 1, filter: "blur(40px)", duration: 0.5 }, ">");
    tl.to(logoRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5 }, "<");
    tl.to(frameCanvasRef.current, { autoAlpha: 0, duration: 0.5 }, "<");
    tl.to(logoRef.current, { top: "16px", left: "20px", xPercent: 0, yPercent: 0, width: cornerLogoWidth, duration: 1.5, ease: "power2.inOut" }, ">");
    tl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 1.5, ease: "power2.inOut" }, "<");
    tl.to({}, { duration: 4.0 });
    tl.to({}, { duration: 3.366 });

    function renderHero(index: number) {
      const ctx = frameCanvasRef.current?.getContext("2d", { alpha: false });
      if (!ctx || !images[index]) return;
      frameCanvasRef.current!.width = 1920;
      frameCanvasRef.current!.height = 1080;
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      ctx.filter = frameIndex >= BLUR_START_FRAME ? `blur(${((frameIndex - BLUR_START_FRAME) / 25) * 100}px)` : "none";
      ctx.drawImage(images[index], 0, 0);
    }
  }, [isLoaded, images]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <div
        className={`fixed !top-10 right-4 md:top-12 md:right-6 z-[2147483647] flex items-center gap-3 md:gap-5 transition-all duration-700 ease-out ${
          showCornerActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="group pointer-events-auto relative inline-flex items-center justify-center min-w-[140px] md:min-w-[180px] h-9 md:h-10 px- md:px-8 rounded-full bg-[#07090d] text-white text-[0.9em] md:text-[1em] font-lust tracking-[0.05em] md:tracking-[0.06em] uppercase border-[2px] border-[var(--color-secondary)] shadow-[0_0_0_2px_#07090d] transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-y-0 left-0 w-0 bg-[var(--color-secondary)] transition-all duration-500 ease-out group-hover:w-full" />
          <span className="relative z-10 !text-white transition-colors duration-300 group-hover:!text-[var(--color-primary)]">Book Now</span>
        </button>
      </div>

      <canvas ref={frameCanvasRef} className="absolute inset-0 z-10 w-full h-full object-cover" />

      <div ref={canvasWrapperRef} className="absolute inset-0 z-20 overflow-hidden">
        <Canvas gl={{ antialias: true, toneMapping: THREE.LinearToneMapping, toneMappingExposure: 0.9 , powerPreference: "high-performance", localClippingEnabled: true }}>
          <color attach="background" args={["#000000"]} />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={isMobile ? 65 : 40} />
            <ambientLight intensity={0.5} />
            <Environment preset="city" />

            <CameraZoomController mountFeathers={mountFeathers} activeId={activeId} startOffset={11680} />
             <CameraDiveController diveProgress={diveProgress} activeId={activeId} />
            {mount3D && (
              <group>
                <SwanModel scrollProgress={scrollProgress} transformProgress={transformProgress} />
                <WaterPlane splashProgress={splashProgress} opacity={swanOpacity} />
                                 <SplashWalls splashProgress={splashProgress} opacity={swanOpacity} />

               
              </group>
            )}

          {mountBackWater && (
              <group>
                <SplashDroplets splashProgress={splashProgress} opacity={swanOpacity} />
              </group>
            )}

            {mountWater && (
              <WaterSurface fallProgress={fallProgress} swanProgress={swanProgress} id3Ref={feather3Ref} opacity={globalFade} />
            )}

            {mountFeathers && (
              <group>
                <CameraFocusController target={focusTarget} enabled={!!focusTarget} />
                <NaturalFeather id={5} variant="mid-drift" startPos={[-11.0, 12, 1]} targetPos={[-17.0, 2.5, 1]} started={true} delay={0.8} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
                <NaturalFeather id={2} variant="small-drag" startPos={[-6.5, 14, -2]} targetPos={[-16.5, -19.0, -2]} started={true} delay={0.6} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
                <NaturalFeather ref={feather3Ref} id={3} variant="upper-pendulum" startPos={[-2.0, 10, -3]} targetPos={[7.0, 5.0, -3]} started={true} delay={0.3} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
                <NaturalFeather id={1} variant="main" startPos={[2.5, 16, 0]} targetPos={[2.5, -10.0, 0]} started={true} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
                <NaturalFeather id={4} variant="side-roll-upper" startPos={[7.0, 12, -1]} targetPos={[30.0, -4.0, -1]} started={true} delay={0.5} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
                <NaturalFeather id={6} variant="high-drag-zig" startPos={[11.5, 18, 0]} targetPos={[17.5, -20.0, 0]} started={true} delay={0.2} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} startOffset={11680} opacity={globalFade}/>
              </group>
            )}
{mountEndSwan && (
              <EndSwanWrapper opacity={endSwanOpacity} scale={endSwanScale} whiteness={endSwanWhite} clipY={endSwanClipY} />
            )}
          </Suspense>
        </Canvas>
      </div>

      <div ref={logoRef} className="absolute z-30 overflow-hidden pointer-events-none" style={{ visibility: "hidden" }}>
        <img
          src={useCornerLogo ? "assets/logo/beigelogo-mini.svg" : "assets/logo/beigelogo-small.svg"}
          alt="Logo"
          className="block w-full h-auto brightness-0 invert"
          style={{ transform: "scale(1)" }}
        />
      </div>

      <RoomDetailsPanel
        activeId={activeId}
        content={null}
       // embeddedPath={embeddedPath}
        onClose={() => {
          setActiveId(null);
          setFocusTarget(null);
        }}
      />
    </div>
  );
};

export default MainCanvas;
