import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
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

const FrameScroller = ({ frameIndex }: { frameIndex: number }) => {
  const { viewport } = useThree();
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const path = getFramePath(i);
      loader.load(
        path,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          loadedTextures[i - 1] = tex;
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES) {
            setTextures(loadedTextures);
            setLoaded(true);
          }
        },
        undefined,
        () => console.error(`Failed to load frame: ${path}`)
      );
    }
  }, []);

  if (!loaded) return null;

  return (
    <mesh position={[0, 0, 0]}>
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
        onLoad();
      }
    });
  }, [onLoad]);

  return (
    <group>
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[5000, 5000]} />
        <meshBasicMaterial color="#49261c" />
      </mesh>
      <mesh ref={imageRef} position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* Added premultipliedAlpha for Three.js MultiplyBlending requirement */}
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

  useGSAP(() => {
    if (!isReady || !logoRef.current || !cameraRef.current) return;
    
    const totalScroll = 6000;
    const blurPeak = 0.08; 
    const blurHoldEnd = 0.10;
    const logoClearPoint = 0.16;
    const framePhaseStart = 0.25;

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 2.5,
        // Using onLeave to trigger the NEXT section in your bidirectional scroller
        onLeave: () => {
            if (onComplete) onComplete();
        }
      }
    });

    const themeColor = { value: "#000000" };

    // 1. Initial State
    masterTl.set(canvasWrapperRef.current, { filter: "blur(0px)" }, 0);

    // 2. Heavy Blur
    masterTl.to(canvasWrapperRef.current, { 
      filter: "blur(120px)", 
      duration: 0.12, 
      ease: "power1.inOut" 
    }, 0.02);

    // 3. Background Transition
    masterTl.to(themeColor, {
      value: "#49261c",
      duration: 0.12,
      onUpdate: () => {
        if (containerRef.current) containerRef.current.style.backgroundColor = themeColor.value;
        if (sceneBgRef.current) sceneBgRef.current.set(themeColor.value);
        if (fogRef.current) fogRef.current.color.set(themeColor.value);
      }
    }, 0.04);

    // 4. Logo Reveal
    masterTl.fromTo(logoRef.current, 
      { autoAlpha: 0, filter: "blur(15px)" }, 
      { autoAlpha: 1, filter: "blur(0px)", duration: 0.06 }, 
      blurPeak
    );

    // 5. Image Fade (With Guard to prevent "null" error)
    masterTl.to(imageMatRef.current, { 
        opacity: 0, 
        duration: 0.10, 
        ease: "power2.inOut",
        onUpdate: function() {
            // Fix for "Cannot read properties of null"
            if (!imageMatRef.current) return;
            
            if (imageMatRef.current.opacity < 0.9) {
                imageMatRef.current.blending = THREE.MultiplyBlending;
                imageMatRef.current.needsUpdate = true;
            }
        }
    }, blurPeak);

    // 6. Clear Blur
    masterTl.to(canvasWrapperRef.current, { 
      filter: "blur(0px)", 
      duration: 0.10 
    }, blurHoldEnd);

    // 7. Transition to frames
    masterTl.to(logoRef.current, { 
        top: "37px", 
        left: "48px", 
        width: "56px", 
        duration: 0.35 
    }, framePhaseStart);

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
      <div ref={logoRef} className="fixed -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ top: "50%", left: "45%", width: "530px", visibility: "hidden" }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>

      <div ref={canvasWrapperRef} className="fixed inset-0 z-10">
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <fog ref={fogRef} attach="fog" args={["#000000", 10, 150]} />
          <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 85]} fov={45} />
          <color ref={sceneBgRef} attach="background" args={["#000000"]} />
          <ambientLight intensity={2} />
          <Suspense fallback={null}>
            {/* Keeping IntroImage in DOM longer to prevent GSAP null errors */}
            <IntroImage 
                imageRef={imageRef} 
                materialRef={imageMatRef} 
                onLoad={() => setIsReady(true)} 
            />
            
            {showFrames && (
              <FrameScroller frameIndex={currentFrame} />
            )}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      <div style={{ height: "600vh" }} />
    </section>
  );
};

export default LogoRevealNew;