import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import ScrollTrigger from "gsap/ScrollTrigger";

import CameraFocusController from "../../../components/CameraFocusController/CameraFocusController"; 
import RoomDetailsPanel from "../../../components/pages/home/RoomDetailsPanel";
import { roomData } from "../../../components/roomDetailsPanel/RoomData";
import NaturalFeather from "../../../components/NaturalFeather/NaturalFeather";
import WaterSurface from "../../../components/WaterSurface/WaterSurface";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ScrollZoomLogic = ({ isActive, isClicked }: { isActive: boolean, isClicked: boolean }) => {
  const { camera } = useThree();

  useGSAP(() => {
    if (isClicked) return;

    if (isActive) {
      // Slower Zoom to Water
      gsap.to(camera.position, { x: -1, y: 1.5, z: 4, duration: 5.0, ease: "sine.inOut", overwrite: "auto" });
      gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 5.0, ease: "sine.inOut", overwrite: "auto" });
    } else {
      // ✅ RESET TO Y = -1
      gsap.to(camera.position, { x: 0, y: -1, z: 18, duration: 4.5, ease: "sine.inOut", overwrite: "auto" });
      gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 4.5, ease: "sine.inOut", overwrite: "auto" });
    }
  }, [isActive, isClicked]);

  return null;
};

const BubbleFeather_Interaction = () => {
  const [started, setStarted] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [burstAll, setBurstAll] = useState(false); 
  const [zoomActive, setZoomActive] = useState(false); 
  const [fallProgress, setFallProgress] = useState(0); 
  const feather3Ref = useRef<any>(null);
  const [swanProgress, setSwanProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Hides the visual scrollbar but keeps the native scrolling functionality active
    document.documentElement.classList.add('hide-scrollbar');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 750) setBurstAll(true);
      else setBurstAll(false);

      if (scrollY > 850) setZoomActive(true);
      else setZoomActive(false);

      const startRise = 760; 
      const endRise = 1780;   
      const rawProgress = THREE.MathUtils.clamp((scrollY - startRise) / (endRise - startRise), 0, 1);
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      setFallProgress(progress);

      const startSwan = 1500; 
      const endSwan = 2200;   
      const swanRaw = THREE.MathUtils.clamp((scrollY - startSwan) / (endSwan - startSwan), 0, 1);
      const swanProg = swanRaw * swanRaw * (3 - 2 * swanRaw);
      setSwanProgress(swanProg);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    setStarted(true);
    if (canvasContainerRef.current) gsap.set(canvasContainerRef.current, { autoAlpha: 1, top: 0 });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.classList.remove('hide-scrollbar');
    };
  }, []); 

  const handleBubbleClick = (id: number, target: THREE.Vector3) => {
    setActiveId(id);
    const xOffset = id === 3 ? 2 : 1.5;
    setFocusTarget(new THREE.Vector3(target.x + xOffset, target.y, target.z));
  };

  return (
    <>
      <div ref={canvasContainerRef} className="fixed inset-0 z-30 overflow-hidden bg-black">
        <Canvas dpr={[1, 2]} camera={{ position: [0, -1, 18], fov: 45 }} 
          onCreated={({ camera }) => camera.lookAt(0, -1, 0)}
          onPointerMissed={() => { setActiveId(null); setFocusTarget(null); }}>
          
          <color attach="background" args={["#000000"]} />

          <Suspense fallback={null}>
            <ScrollZoomLogic isActive={zoomActive} isClicked={!!activeId} />
            <CameraFocusController target={focusTarget} enabled={!!focusTarget} />
            
            <Environment resolution={1024}>
              <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
              <Lightformer form="rect" intensity={80} position={[0, -36, -74]} scale={[100, 1, 1]} target={[0, 0, 0]} />
            </Environment>
            <ambientLight intensity={1.5} /><directionalLight position={[10, 10, 10]} intensity={4} />
            
            <group>
              <WaterSurface fallProgress={fallProgress} swanProgress={swanProgress} id3Ref={feather3Ref} />        
              <NaturalFeather id={1} variant="main" startPos={[0, 2, 0]} targetPos={[1.5, -4.5, 0]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} />
              <NaturalFeather id={2} variant="small-drag" startPos={[-2, 3, -2]} targetPos={[-3.5, -5.5, -1]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} />
              <NaturalFeather ref={feather3Ref} id={3} variant="upper-pendulum" startPos={[4, 5, -3]} targetPos={[-1, 1.5, -2]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} dropProgress={fallProgress} />
              <NaturalFeather id={4} variant="side-roll-upper" startPos={[1.5, 6, -1]} targetPos={[4.5, 2.2, -1.5]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} />
              <NaturalFeather id={5} variant="mid-drift" startPos={[-1, 5, 2]} targetPos={[-6.5, 0.5, 1.0]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} />
              <NaturalFeather id={6} variant="high-drag-zig" startPos={[4, 5, 0]} targetPos={[7.5, -4.5, -0.5]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={true} />
            </group>
          </Suspense>
        </Canvas>
      </div>

      <RoomDetailsPanel activeId={activeId} content={activeId ? roomData[activeId] : null} onClose={() => { setActiveId(null); setFocusTarget(null); }} />

      {/* This spacer enables the native scrollbar, driving the GSAP scrubs natively */}
      <div style={{ height: "2300px", width: "100%", position: "absolute", top: 0, zIndex: -1 }} />
    </>
  );
};

export default BubbleFeather_Interaction;
