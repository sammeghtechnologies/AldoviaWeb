import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment, useTexture } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react"; 
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 20;

const getFramePath = (index: number) => {
  const paddedIndex = String(index).padStart(3, "0");
  return `/assets/swan-turn/ezgif-frame-${paddedIndex}.jpg`;
};

const FrameScroller = ({ frameIndex, visible }: { frameIndex: number; visible: boolean }) => {
  const { viewport } = useThree();
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const path = getFramePath(i);
      loader.load(path, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedTextures[i - 1] = tex;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setTextures(loadedTextures);
          setLoaded(true);
        }
      });
    }
  }, []);

  if (!loaded || !visible) return null;

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width * 1.1, viewport.height * 1.1]} />
      <meshBasicMaterial map={textures[frameIndex - 1] || textures[0]} transparent toneMapped={false} />
    </mesh>
  );
};

const IntroImage = ({ imageRef, materialRef, onLoad }: any) => {
  const { viewport } = useThree();
  const tex = useTexture("/assets/swarn_60/frame_0500.jpg");

  useEffect(() => {
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      onLoad(); 
    }
  }, [tex, onLoad]);

  return (
    <group renderOrder={999}>
      <mesh ref={imageRef} position={[0, 0, 10]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial 
          ref={materialRef} 
          map={tex} 
          transparent 
          opacity={1} 
          toneMapped={false} 
          depthTest={false} 
        />
      </mesh>
    </group>
  );
};

const LogoRevealNew = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<THREE.Mesh>(null!);
  const imageMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const logoRef = useRef<HTMLDivElement>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  
  const [isReady, setIsReady] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showFrames] = useState(true);

  useGSAP(() => {
    if (!isReady || !logoRef.current || !cameraRef.current) return;
    
    const totalScroll = 8000; 
    const blurPeak = 0.15; 
    const logoMoveStart = 0.35;
    const framePlayStart = 0.65; 

    // ✅ PHASE 1: Fade from Black to the Loaded Scene
    gsap.to(canvasWrapperRef.current, { opacity: 1, duration: 0.8, ease: "power2.inOut" });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 2.5,
        onLeave: () => onComplete?.()
      }
    });

    masterTl.set(canvasWrapperRef.current, { filter: "blur(0px)" }, 0);
    masterTl.set(imageMatRef.current, { opacity: 1 }, 0);
    masterTl.set(logoRef.current, { 
        autoAlpha: 0, 
        filter: "blur(20px)", 
        scale: 0.9,
        left: "50%", 
        xPercent: -50, 
        yPercent: -50 
    }, 0);

    masterTl.to(canvasWrapperRef.current, { filter: "blur(100px)", duration: 0.15 }, 0.05);
    masterTl.to(logoRef.current, { autoAlpha: 1, filter: "blur(0px)", scale: 1, duration: 0.1 }, blurPeak);
    masterTl.to(imageMatRef.current, { opacity: 0, duration: 0.15 }, blurPeak);
    masterTl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 0.10 }, 0.3);

    masterTl.to(logoRef.current, { 
        top: "37px", 
        left: "48px", 
        xPercent: 0, 
        yPercent: 0, 
        width: "56px", 
        duration: 0.25 
    }, logoMoveStart);

    masterTl.to({}, {
      duration: 0.35,
      onUpdate: function() {
        const progress = this.progress();
        const frame = Math.max(2, Math.min(TOTAL_FRAMES, Math.ceil(progress * (TOTAL_FRAMES - 1)) + 1));
        setCurrentFrame(frame);
      }
    }, framePlayStart);

  }, { dependencies: [isReady], scope: containerRef });

  return (
    // ✅ FIX 1: Set section background to black
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={logoRef} className="fixed z-50 pointer-events-none" style={{ top: "50%", left: "50%", width: "530px", visibility: "hidden" }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>

      <div ref={canvasWrapperRef} className="fixed inset-0 z-10 opacity-0 transition-opacity duration-700">
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 85]} fov={45} />
          
          {/* ✅ FIX 2: Only show brown color once ready */}
          <color attach="background" args={[isReady ? "#49261c" : "#000000"]} /> 
          
          <ambientLight intensity={2} />
          <Suspense fallback={null}>
            <FrameScroller frameIndex={currentFrame} visible={showFrames} />
            <IntroImage imageRef={imageRef} materialRef={imageMatRef} onLoad={() => setIsReady(true)} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      <div style={{ height: "600vh" }} />
    </section>
  );
};

export default LogoRevealNew;