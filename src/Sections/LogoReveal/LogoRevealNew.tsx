import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useLayoutEffect } from "react";
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

  if (!loaded) return null;

  return (
    <mesh position={[0, 0, 0]} visible={visible}>
      <planeGeometry args={[viewport.width * 1.1, viewport.height * 1.1]} />
      <meshBasicMaterial map={textures[frameIndex - 1]} transparent toneMapped={false} />
    </mesh>
  );
};

const IntroImage = ({ imageRef, materialRef, onLoad }: any) => {
  const { viewport } = useThree();
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/assets/swarn_60/frame_0500.jpg", (tex) => {
      if (imageRef.current && materialRef.current) {
        materialRef.current.map = tex;
        // Ensure the texture is marked for update
        materialRef.current.needsUpdate = true;
        onLoad();
      }
    });
  }, [onLoad]);

  return (
    <group>
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial color="#49261c" />
      </mesh>
      <mesh ref={imageRef} position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial 
          ref={materialRef} 
          transparent 
          opacity={1} 
          toneMapped={false} 
          premultipliedAlpha={true} 
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
  const [showFrames, setShowFrames] = useState(false);

  const sceneBgRef = useRef<THREE.Color>(null!);
  const fogRef = useRef<THREE.Fog>(null!);

  // Force initial state on mount before GSAP even touches it
  useLayoutEffect(() => {
    if (canvasWrapperRef.current) {
      canvasWrapperRef.current.style.filter = "blur(0px)";
    }
  }, []);

  useGSAP(() => {
    if (!isReady || !logoRef.current || !cameraRef.current || !imageMatRef.current) return;
    
    const totalScroll = 6000;
    const blurPeak = 0.08; 
    const framePhaseStart = 0.25;

    // Reset everything to "Start" state immediately
    gsap.set(canvasWrapperRef.current, { filter: "blur(0px)" });
    gsap.set(imageMatRef.current, { opacity: 1 });
    gsap.set(logoRef.current, { autoAlpha: 0 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 2.5,
        onLeave: () => { if (onComplete) onComplete(); }
      }
    });

    const themeColor = { value: "#000000" };

    // 1. Smoothly increase blur as you scroll
    masterTl.to(canvasWrapperRef.current, { 
      filter: "blur(120px)", 
      duration: 0.12,
      ease: "none" 
    }, 0.01);

    // 2. Background Transition
    masterTl.to(themeColor, {
      value: "#49261c",
      duration: 0.12,
      onUpdate: () => {
        if (containerRef.current) containerRef.current.style.backgroundColor = themeColor.value;
        if (sceneBgRef.current) sceneBgRef.current.set(themeColor.value);
        if (fogRef.current) fogRef.current.color.set(themeColor.value);
      }
    }, 0.04);

    // 3. Logo Reveal and Image Fade-out
    masterTl.fromTo(logoRef.current, 
      { autoAlpha: 0, filter: "blur(15px)" }, 
      { autoAlpha: 1, filter: "blur(0px)", duration: 0.06 }, 
      blurPeak
    );

    masterTl.to(imageMatRef.current, { 
        opacity: 0, 
        duration: 0.10,
        onUpdate: function() {
            if (imageMatRef.current && imageMatRef.current.opacity < 0.9) {
                imageMatRef.current.blending = THREE.MultiplyBlending;
                imageMatRef.current.needsUpdate = true;
            }
        }
    }, blurPeak);

    // 4. Move Logo & Start Turn
    masterTl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 0.10 }, 0.15);
    masterTl.to(logoRef.current, { top: "37px", left: "48px", width: "56px", duration: 0.35 }, framePhaseStart);

    masterTl.to({}, {
      duration: 0.6,
      onStart: () => setShowFrames(true),
      onReverseComplete: () => setShowFrames(false),
      onUpdate: function() {
        const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.ceil(this.progress() * TOTAL_FRAMES)));
        setCurrentFrame(frame);
      }
    }, framePhaseStart);

  }, { dependencies: [isReady], scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Absolute fallback: If something breaks, show the image background color */}
      <div className="absolute inset-0 bg-[#000000]" style={{ zIndex: -1 }} />

      <div ref={logoRef} className="fixed -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ top: "50%", left: "45%", width: "530px", visibility: "hidden" }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>

      <div ref={canvasWrapperRef} className="fixed inset-0 z-10" style={{ filter: "blur(0px)" }}>
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <fog ref={fogRef} attach="fog" args={["#000000", 10, 150]} />
          <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 85]} fov={45} />
          <color ref={sceneBgRef} attach="background" args={["#000000"]} />
          <ambientLight intensity={2} />
          <Suspense fallback={null}>
            <IntroImage imageRef={imageRef} materialRef={imageMatRef} onLoad={() => setIsReady(true)} />
            <FrameScroller frameIndex={currentFrame} visible={showFrames} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      <div style={{ height: "600vh" }} />
    </section>
  );
};

export default LogoRevealNew;