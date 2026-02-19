import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, PerspectiveCamera, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";
// @ts-ignore
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

gsap.registerPlugin(ScrollTrigger);

const WaterManager = ({ reflectorRef }: { reflectorRef: any }) => {
  useFrame(() => {
    if (reflectorRef.current) {
      reflectorRef.current.offset += 0.002; 
    }
  });
  return null;
};

const Ripples = ({ targetRef }: { targetRef: any }) => {
  const rippleGroupRef = useRef<THREE.Group>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!targetRef?.current || !rippleGroupRef.current) return;
    const { x, z } = targetRef.current.position;
    rippleGroupRef.current.position.set(x, -34.8, z); 

    const time = state.clock.getElapsedTime();
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const s = (time * 0.4 + i * 0.12) % 1; 
        ring.scale.set(1 + s * 5, 1 + s * 5, 1.5); 
        (ring.material as THREE.MeshStandardMaterial).opacity = (1 - s) * (0.3 / (i + 1));
      }
    });
  });

  return (
    <group ref={rippleGroupRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} ref={(el) => (ringRefs.current[i] = el!)} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
          <torusGeometry args={[i * 8, 0.4, 12, 48]} /> 
          <meshStandardMaterial color="white" transparent opacity={0} roughness={0.1} metalness={0.8} depthWrite={false} stencilWrite={true} />
        </mesh>
      ))}
    </group>
  );
};

const IntroImage = ({ imageRef, materialRef, onLoad }: any) => {
  const { viewport } = useThree(); 
  const texture = useTexture("/assets/swarn_60/frame_0500.jpg"); 
  useEffect(() => { if (texture) onLoad(); }, [texture, onLoad]);
  return (
    <mesh ref={imageRef} position={[0, 2, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} /> 
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={1} toneMapped={false} />
    </mesh>
  );
};

const SwanModel = ({ swanGroupRef, onLoad, initialPosition, scale = 4.8, clippingPlane }: any) => {
  const { scene, animations } = useGLTF("/models/swan.glb") as any;
  const swanModel = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    if (animations?.length > 0) {
      const tempMixer = new THREE.AnimationMixer(clone);
      tempMixer.clipAction(animations[0]).play();
      tempMixer.update(0); 
    }
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0; 
        if (clippingPlane) child.material.clippingPlanes = [clippingPlane];
      }
    });
    return clone;
  }, [scene, animations, clippingPlane]);

  useEffect(() => { if (swanModel) onLoad(); }, [swanModel, onLoad]);
  return (
    <group ref={swanGroupRef} position={initialPosition}>
      {/* Visual center adjustment: X: -5 shifts the model within its group so it looks centered even when side-on */}
      <primitive object={swanModel} scale={scale} rotation={[0, -Math.PI / 1.90, 0]} position={[-5, 0, 0]} />
    </group>
  );
};

const LogoRevealNew = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<THREE.Mesh>(null!);
  const imageMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const swan2Ref = useRef<THREE.Group>(null!); 
  const logoRef = useRef<HTMLDivElement>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null!); 
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!); 
  const reflectorRef = useRef<any>(null!);
  const floorMeshRef = useRef<THREE.Mesh>(null!);
  const ripplesRef = useRef<THREE.Group>(null!);
  const [isReady, setIsReady] = useState(false);

  const sceneBgRef = useRef<THREE.Color>(null!);
  const fogRef = useRef<THREE.Fog>(null!);
  const floorMatRef = useRef<THREE.MeshBasicMaterial>(null!);

  const waterClipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 35.0), []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflowY = "scroll";
    return () => { document.body.style.overflow = ""; document.documentElement.style.overflowY = ""; };
  }, []);

  useGSAP(() => {
    if (!isReady || !imageRef.current || !swan2Ref.current || !logoRef.current || !cameraRef.current) return;
    const totalScroll = 6000;
    
    const fadeStart = 0.07; 
    const transitionStart = 0.08; 
    const logoClearPoint = 0.12;
    const pivot = 0.22;
    const finalPhaseStart = 0.60;
    const completion = 1.0;

    const masterTl = gsap.timeline({
      scrollTrigger: { trigger: containerRef.current, start: "top top", end: `+=${totalScroll}`, pin: true, scrub: 2.5, onLeave: () => onComplete() }
    });

    const s2Mats: any[] = [];
    swan2Ref.current.traverse((child: any) => { if (child.isMesh) s2Mats.push(child.material); });

    const themeColor = { value: "#000000" };

    masterTl.set([swan2Ref.current, floorMeshRef.current, ripplesRef.current, reflectorRef.current.parent], { visible: false }, 0);
    masterTl.set(canvasWrapperRef.current, { filter: "blur(0px)" }, 0);
    masterTl.to(canvasWrapperRef.current, { filter: "blur(50px)", duration: 0.10 }, 0.02);
    
    masterTl.to(themeColor, {
        value: "#49261c",
        duration: 0.08,
        onUpdate: () => {
            if (containerRef.current) containerRef.current.style.backgroundColor = themeColor.value;
            if (sceneBgRef.current) sceneBgRef.current.set(themeColor.value);
            if (fogRef.current) fogRef.current.color.set(themeColor.value);
            if (floorMatRef.current) floorMatRef.current.color.set(themeColor.value);
            if (reflectorRef.current) reflectorRef.current.color.set(themeColor.value);
        }
    }, fadeStart);

    masterTl.to(imageMatRef.current, { opacity: 0, duration: 0.08, ease: "power2.inOut" }, fadeStart);
    masterTl.fromTo(logoRef.current, { autoAlpha: 0, filter: "blur(15px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 0.04, ease: "none" }, transitionStart);
    masterTl.set(imageRef.current, { visible: false }, fadeStart + 0.08);

    masterTl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 0.08 }, logoClearPoint);
    
    // ✅ CENTERED: Camera X changed from 15 to 0. 
    // This keeps the viewport focused on the center of the scene.
    masterTl.set(cameraRef.current.position, { x: 0, y: -8, z: 85, immediateRender: false }, pivot);

    masterTl.to(logoRef.current, { top: "37px", left: "48px", width: "56px", duration: 0.30, ease: "none" }, pivot);
    masterTl.set([swan2Ref.current, floorMeshRef.current, ripplesRef.current, reflectorRef.current.parent], { visible: true }, pivot);
    
    masterTl.to(s2Mats, { opacity: 1, duration: 0.30, ease: "power1.inOut" }, pivot);
    masterTl.fromTo([floorMatRef.current, reflectorRef.current], { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power1.out" }, pivot);

    // ✅ REFINED: We adjust the model's inner position to 0 during the final rotation 
    // so it ends up perfectly in the center when facing forward.
    masterTl.to(swan2Ref.current.children[0].position, { x: 0, duration: 0.30, ease: "none" }, pivot);
    masterTl.to(swan2Ref.current.position, { x: 0, y: -20, z: 0, duration: 0.30, ease: "none" }, pivot);

    const heroDuration = completion - finalPhaseStart; 
    masterTl.to(swan2Ref.current.rotation, { y: 1.55, duration: heroDuration, ease: "none" }, finalPhaseStart);
    masterTl.to(cameraRef.current.position, { x: 0, y: -10, duration: heroDuration, ease: "none", immediateRender: false }, finalPhaseStart);

  }, { dependencies: [isReady], scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black"> 
      <div ref={logoRef} className="fixed -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ top: "50%", left: "45%", width: "530px", visibility: "hidden" }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>

      <div ref={canvasWrapperRef} className="fixed inset-0 z-10"> 
        <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping, localClippingEnabled: true }}>
          <fog ref={fogRef} attach="fog" args={["#000000", 10, 150]} />
          <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 2, 12]} fov={45} />
          <color ref={sceneBgRef} attach="background" args={["#000000"]} />
          <ambientLight intensity={2} /> 
          <Suspense fallback={null}>
            <IntroImage imageRef={imageRef} materialRef={imageMatRef} onLoad={() => setIsReady(true)} />
            
            <SwanModel 
              swanGroupRef={swan2Ref} 
              clippingPlane={waterClipPlane} 
              initialPosition={[0, -20, 0]} 
              scale={60} 
              onLoad={() => {}} 
            />
            
            <mesh ref={floorMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -35, 0]} renderOrder={1}>
              <planeGeometry args={[10000, 10000]} />
              <meshBasicMaterial ref={floorMatRef} color="#000000" transparent opacity={1} toneMapped={false} stencilWrite={true} />
            </mesh>

            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -34.95, 0]}>
              <mesh renderOrder={5}>
                <planeGeometry args={[10000, 10000]} />
                <MeshReflectorMaterial
                  ref={reflectorRef} blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={1.5} roughness={1}
                  color="#000000" metalness={0.5} mirror={0.8} distortion={0.5} transparent opacity={0.9} toneMapped={false} 
                  stencilWrite={true}
                />
              </mesh>
            </group>

            <group ref={ripplesRef}>
              <Ripples targetRef={swan2Ref} />
            </group>
            
            <WaterManager reflectorRef={reflectorRef} /> 
            <Environment preset="city" /> 
          </Suspense>
        </Canvas>
      </div>
      <div style={{ height: "600vh" }} />
    </section>
  );
};

export default LogoRevealNew;