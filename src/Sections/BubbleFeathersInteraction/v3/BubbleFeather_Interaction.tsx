import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import ScrollTrigger from "gsap/ScrollTrigger";

import CameraFocusController from "../../../components/CameraFocusController/CameraFocusController"; 
import RoomDetailsPanel from "../../../components/pages/home/RoomDetailsPanel";
import { roomData } from "../../../components/roomDetailsPanel/RoomData";
import NaturalFeather from "../../../components/NaturalFeather/NaturalFeather";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ✅ FIXED: Added 'isClicked' to prevent fighting with CameraFocusController
const ScrollZoomLogic = ({ isActive, isClicked }: { isActive: boolean, isClicked: boolean }) => {
  const { camera } = useThree();
  const initialPos = useRef(new THREE.Vector3());
  const initialRot = useRef(new THREE.Euler());
  const isCaptured = useRef(false);

  useEffect(() => {
    if (!isCaptured.current) {
      initialPos.current.copy(camera.position);
      initialRot.current.copy(camera.rotation);
      isCaptured.current = true;
    }
  }, [camera]);

  useGSAP(() => {
    // 🛑 If clicked, STOP scroll zoom. Let the FocusController handle it.
    if (isClicked) return;

    if (isActive) {
      gsap.to(camera.position, { x: -1, y: 1.5, z: 4, duration: 1.5, ease: "power2.inOut", overwrite: "auto" });
      gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.inOut", overwrite: "auto" });
    } else if (isCaptured.current) {
      gsap.to(camera.position, { x: initialPos.current.x, y: initialPos.current.y, z: initialPos.current.z, duration: 1.2, ease: "power2.inOut", overwrite: "auto" });
      gsap.to(camera.rotation, { x: initialRot.current.x, y: initialRot.current.y, z: initialRot.current.z, duration: 1.2, ease: "power2.inOut", overwrite: "auto" });
    }
  }, [isActive, isClicked]); // Re-run when click state changes

  return null;
};

const BubbleFeather_Interaction = ({ }: any) => {
  const [started, setStarted] = useState(false);
  const [allBubblesReady, setAllBubblesReady] = useState(false); 
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Interaction State
  const [activeId, setActiveId] = useState<number | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [burstAll, setBurstAll] = useState(false); 
  const [zoomActive, setZoomActive] = useState(false); 
  const [fallProgress, setFallProgress] = useState(0); 
  
  const feather3Ref = useRef<any>(null);

  useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // 1. BURST TRIGGER (Now matches the new end of pause at 800px)
    // We set it slightly before (750px) so the particles fire exactly as the fall starts.
    if (scrollY > 750) setBurstAll(true);
    else setBurstAll(false);

    // 2. ZOOM TRIGGER (Water View)
    // Zoom starts right after the burst to capture the descent.
    if (scrollY > 850) setZoomActive(true);
    else setZoomActive(false);

    // 3. FALL PROGRESS (Water Rise)
    // Synced to the feather's approach to the surface.
    const startRise = 1000; // Water begins rising earlier
    const endRise = 1500;   // Fully risen by 1500px
    const progress = THREE.MathUtils.clamp((scrollY - startRise) / (endRise - startRise), 0, 1);
    setFallProgress(progress);
  };

  const enableScrolling = () => {
    setAllBubblesReady(true);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "400vh"; // Slightly reduced height since the pause is shorter
    window.addEventListener("scroll", handleScroll);
  };

  setStarted(true);
  if (canvasContainerRef.current) gsap.set(canvasContainerRef.current, { autoAlpha: 1 });
  enableScrolling();

  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

const handleBubbleClick = (id: number, target: THREE.Vector3) => {
    // 🛑 REMOVE THIS LINE: if (burstAll) return; 
    
    setActiveId(id);
    setFocusTarget(new THREE.Vector3(target.x + 1.5, target.y, target.z));
  };

  return (
    <>
      <div ref={canvasContainerRef} className="fixed inset-0 z-30 bg-[#00000000] opacity-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 18], fov: 45 }} onPointerMissed={() => { setActiveId(null); setFocusTarget(null); }} style={{ touchAction: 'auto' }}>
          <color attach="background" args={["#000000"]} />
          
          {/* ✅ Pass isClicked to fix camera fighting */}
          <ScrollZoomLogic isActive={zoomActive} isClicked={!!activeId} />
          
        <CameraFocusController target={focusTarget} enabled={!!focusTarget} />

          <Environment resolution={1024}>
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer form="rect" intensity={80} position={[0, -36, -74]} scale={[100, 1, 1]} target={[0, 0, 0]} />
          </Environment>
          <ambientLight intensity={1.5} /><directionalLight position={[10, 10, 10]} intensity={4} />
          
          <group>
{/* <WaterSurface fallProgress={fallProgress} id3Ref={feather3Ref} />             */}
            <NaturalFeather id={1} variant="main" startPos={[0, 2, 0]} targetPos={[1.5, -4.5, 0]} started={started} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
            <NaturalFeather id={2} variant="small-drag" startPos={[-2, 3, -2]} targetPos={[-3.5, -5.5, -1]} started={started} delay={0.6} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
            <NaturalFeather ref={feather3Ref} id={3} variant="upper-pendulum" startPos={[4, 5, -3]} targetPos={[-1, 1.5, -2]} started={started} delay={0.3} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
            <NaturalFeather id={4} variant="side-roll-upper" startPos={[1.5, 6, -1]} targetPos={[4.5, 2.2, -1.5]} started={started} delay={0.5} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
            <NaturalFeather id={5} variant="mid-drift" startPos={[-1, 5, 2]} targetPos={[-6.5, 0.5, 1.0]} started={started} delay={0.8} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
            <NaturalFeather id={6} variant="high-drag-zig" startPos={[4, 5, 0]} targetPos={[7.5, -4.5, -0.5]} started={started} delay={0.2} activeId={activeId} burstAll={burstAll} onBubbleClick={handleBubbleClick} allBubblesReady={allBubblesReady} />
          </group>
        </Canvas>
      </div>
      <RoomDetailsPanel activeId={activeId} content={activeId ? roomData[activeId] : null} onClose={() => { setActiveId(null); setFocusTarget(null); }} />
    </>
  );
};
useGLTF.preload("/models/feather_2.glb");
useGLTF.preload("/models/swan.glb");
export default BubbleFeather_Interaction;
