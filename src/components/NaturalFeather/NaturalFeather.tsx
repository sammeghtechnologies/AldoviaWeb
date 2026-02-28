import { Center, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef, useState, Suspense, forwardRef, useMemo } from "react";
import * as THREE from "three";
import BurstParticles from "../BurstParticles/BurstParticles";
import FloatBubble from "../FloatBubble/FloatBubble";
import { useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper for responsive checks
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const NaturalFeather = forwardRef(({ 
  id, startPos, targetPos, started, variant, activeId, onBubbleClick,
  allBubblesReady, burstAll
}: any, ref: any) => {
  
  const modelPath = (id === 1 || id === 3) ? "/models/feather1.glb" : "/models/feather2.glb";
  const { scene, materials } = useGLTF(modelPath) as any;

  const featherMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child: any) => {
      if (child.isMesh) meshes.push(child);
    });
    return meshes;
  }, [scene]);

  const localGroupRef = useRef<THREE.Group>(null!);
  const groupRef = ref || localGroupRef; 
  const rotateRef = useRef<THREE.Group>(null!);
  const bubbleGroupRef = useRef<THREE.Group>(null!); 

  const [showBurst, setShowBurst] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  const isBurst = activeId === id || burstAll; 
  const wasClicked = useRef(false);

  // ✅ ADJUST BUBBLE RADIUS FOR MOBILE/DESKTOP
  const getBubbleRadius = () => {
    const mobileScale = 0.7; // Smaller bubbles on mobile
    const baseRadius = (() => {
      switch (variant) {
        case "small-drag": return 1.6;
        case "high-drag-zig": return 1.6;
        case "mid-drift": return 1.2;
        case "upper-pendulum": return 1.7;
        case "side-roll-upper": return 1.3;
        default: return 1.8;
      }
    })();
    return isMobile ? baseRadius * mobileScale : baseRadius;
  };

  // ✅ ADJUST FEATHER SIZE FOR MOBILE/DESKTOP
  const getFeatherScale = () => {
    const mobileFactor = 0.8; // Feathers slightly smaller on mobile
    const baseScale = (() => {
      switch (variant) {
          case "small-drag": return 0.04;
          case "high-drag-zig": return 0.04;
          case "side-roll-upper": return 0.06;
          case "mid-drift": return 0.04;
          default: return 0.10;
      }
    })();
    return isMobile ? baseScale * mobileFactor : baseScale;
  };

  const handlePointerDown = (e: any) => {
    if (!isBurst) return;
    e.stopPropagation();
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => { isDragging.current = false; };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || !isBurst) return;
    const deltaX = e.clientX - previousPointer.current.x;
    const deltaY = e.clientY - previousPointer.current.y;
    setRotation((prev) => [prev[0] + deltaY * 0.01, prev[1] + deltaX * 0.01, 0]);
    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

 useEffect(() => {
  let timer: any;
  if (isBurst) {
    wasClicked.current = true;
    setShowBurst(true);
    if (bubbleGroupRef.current) bubbleGroupRef.current.visible = false;
  } else {
    setShowBurst(false);
    if (wasClicked.current) {
      timer = setTimeout(() => {
        if (bubbleGroupRef.current) {
          bubbleGroupRef.current.visible = true;
          gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
          gsap.to(bubbleGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.7)" });
        }
        wasClicked.current = false;
      }, 100);
    }
  }
  return () => clearTimeout(timer);
}, [isBurst]);

  useLayoutEffect(() => {
    Object.values(materials).forEach((mat: any) => {
      if (mat) { 
        mat.color = new THREE.Color("#ffffff"); 
        mat.toneMapped = false; 
        mat.transparent = true; 
      }
    });
  }, [materials]);

  useFrame(() => {
    if (!started) return;
    
    if (isBurst && rotateRef.current) {
      rotateRef.current.rotation.x = THREE.MathUtils.lerp(rotateRef.current.rotation.x, rotation[0], 0.1);
      rotateRef.current.rotation.y = THREE.MathUtils.lerp(rotateRef.current.rotation.y, rotation[1], 0.1);
    }
  });

  useGSAP(() => {
    if (!started || !groupRef.current) return;
    const entranceTl = gsap.timeline({ scrollTrigger: { trigger: document.body, start: "top top", end: "500px top", scrub: 1.5 } });
    const posTl = gsap.timeline();

    // ✅ FIXED STATIC ROTATION: No continuous rotation animation
 // ✅ FIXED STATIC ROTATION: Broad side faces the camera (Y & X near 0), angled uniquely on Z
    if (variant === "high-drag-zig") {
        posTl.to(groupRef.current.position, { x: startPos[0] + 1.5, y: startPos[1] + 1, duration: 0.8, ease: "power2.out" })
             .to(groupRef.current.position, { x: "-=2.5", y: THREE.MathUtils.lerp(startPos[1], targetPos[1], 0.35), duration: 1.8, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: "+=2.0", y: THREE.MathUtils.lerp(startPos[1], targetPos[1], 0.7), duration: 1.8, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 1.5, ease: "power2.inOut" });
        gsap.set(rotateRef.current.rotation, { x: 0.1, y: 0.1, z: Math.PI / 4 }); 
    } else if (variant === "mid-drift") {
      posTl.to(groupRef.current.position, { x: startPos[0] - 0.5, y: startPos[1] + 1.5, duration: 1.2, ease: "power2.out" })
           .to(groupRef.current.position, { x: targetPos[0] + 2, y: THREE.MathUtils.lerp(startPos[1] + 1.5, targetPos[1], 0.45), duration: 3.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.5, ease: "power1.inOut" });
      gsap.set(rotateRef.current.rotation, { x: -0.1, y: 0, z: -Math.PI / 6 }); 
    } else if (variant === "side-roll-upper") {
      posTl.to(groupRef.current.position, { x: startPos[0] + 1, y: startPos[1] + 2, z: startPos[2], duration: 1.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: targetPos[0] + 1.5, y: THREE.MathUtils.lerp(startPos[1] + 2, targetPos[1], 0.5), duration: 3.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.8, ease: "power1.inOut" });
      gsap.set(rotateRef.current.rotation, { x: 0.2, y: -0.1, z: Math.PI / 2.5 }); 
    } else if (variant === "upper-pendulum") {
      posTl.to(groupRef.current.position, { x: startPos[0] + 1, y: startPos[1] + 3, z: startPos[2] - 1.5, duration: 1.2, ease: "power2.out" })
           .to(groupRef.current.position, { x: "-=2", y: THREE.MathUtils.lerp(startPos[1] + 3, targetPos[1], 0.5), duration: 2.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: "+=1.5", y: THREE.MathUtils.lerp(startPos[1] + 3, targetPos[1], 0.8), duration: 2.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.5, ease: "slow(0.5, 0.8, false)" });
      gsap.set(rotateRef.current.rotation, { x: 0.15, y: 0.1, z: -Math.PI / 3 }); 
    } else if (variant === "small-drag") {
      posTl.to(groupRef.current.position, { x: startPos[0] - 2.5, y: startPos[1] + 4, z: startPos[2] + 1, duration: 1.0, ease: "power1.out" })
           .to(groupRef.current.position, { x: 6.0, y: THREE.MathUtils.lerp(startPos[1] + 4, targetPos[1], 0.3), duration: 3.6, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: "-=6.0", y: THREE.MathUtils.lerp(startPos[1] + 4, targetPos[1], 0.6), duration: 3.6, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 3.6, ease: "power1.inOut" });
      gsap.set(rotateRef.current.rotation, { x: -0.15, y: 0, z: Math.PI / 6 }); 
    } else {
        posTl.to(groupRef.current.position, { x: startPos[0] + 3, y: startPos[1] + 5, z: startPos[2] - 2, duration: 0.8, ease: "power2.out" })
             .to(groupRef.current.position, { x: -4.5, y: THREE.MathUtils.lerp(startPos[1] + 5, targetPos[1], 0.25), duration: 2.2, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: 4.5, y: THREE.MathUtils.lerp(startPos[1] + 5, targetPos[1], 0.5), duration: 2.2, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 4.5, ease: "power1.inOut" });
        gsap.set(rotateRef.current.rotation, { x: 0, y: 0, z: -Math.PI / 8 }); 
    }
  
    entranceTl.add(posTl, 0);

    if (bubbleGroupRef.current) {
        gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
        const bubbleTl = gsap.timeline({ scrollTrigger: { trigger: document.body, start: "420px top", end: "500px top", scrub: 1.5 } });
        bubbleTl.to(bubbleGroupRef.current.scale, { x: 1, y: 1, z: 1, ease: "back.out(1.7)" });
    }

    const fallStart = 800; 
    if (id === 3) {
      const scrubTl = gsap.timeline({
          scrollTrigger: {
              trigger: document.body, start: `${fallStart}px top`, end: "+=700", scrub: 2.5, 
              onEnter: () => { 
                  setShowBurst(true); 
                  if (bubbleGroupRef.current) bubbleGroupRef.current.visible = false; 
                  gsap.set(rotateRef.current.rotation, { x: Math.PI / 1.8, y: Math.PI * 2.2, z: Math.PI / 2.8 });
              },
              onLeaveBack: () => { 
                  setShowBurst(false); 
                  if (bubbleGroupRef.current) bubbleGroupRef.current.visible = true; 
              }
          }
      });
      const currentY = groupRef.current.position.y;
      const peakY = currentY + 0.1; 
      scrubTl.to(groupRef.current.position, { x: "-=1.5", y: peakY, duration: 1.0, ease: "power2.out" }, 0);
      scrubTl.to(groupRef.current.position, { x: "+=4.0", y: THREE.MathUtils.lerp(peakY, 1.05, 0.3), duration: 3.6, ease: "sine.inOut" }, 1.0);
      scrubTl.to(groupRef.current.position, { x: "-=4.0", y: THREE.MathUtils.lerp(peakY, 1.05, 0.6), duration: 3.6, ease: "sine.inOut" }, 4.6);
      scrubTl.to(groupRef.current.position, { x: targetPos[0], y: 1.05, duration: 3.6, ease: "power1.inOut" }, 8.2)
             .to(rotateRef.current.rotation, { x: Math.PI/6, y: 0, z: Math.PI/2, duration: 3.6, ease: "power2.inOut" }, 8.2);
    } else {
      const scrubTl = gsap.timeline({
          scrollTrigger: {
              trigger: document.body, start: `${fallStart}px top`, end: "+=600", scrub: 1.5,
              onEnter: () => { setShowBurst(true); if (bubbleGroupRef.current) bubbleGroupRef.current.visible = false; },
              onLeaveBack: () => { setShowBurst(false); if (bubbleGroupRef.current) bubbleGroupRef.current.visible = true; }
          }
      });
      scrubTl.to(groupRef.current.position, { x: `+=${(id % 2 === 0 ? 1.5 : -1.5)}`, y: `+=${-1.5 - (id % 2)}`, z: `+=${(id % 2 === 0 ? -1 : 1)}`, duration: 1.5, ease: "power2.out" }, 0);
      scrubTl.to(rotateRef.current.rotation, { x: Math.PI / (1.2 + (id % 2)), y: Math.PI * (1.5 + (id * 0.2)), z: Math.PI / (2 + (id % 3)), duration: 1.5, ease: "power2.out" }, 0);
    }
  }, [started]);

  return (
    <group 
      ref={groupRef} position={startPos}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={(e) => { 
        e.stopPropagation(); 
        const sY = window.scrollY;
        if (sY >= 500 && sY < 1200 && allBubblesReady && activeId !== id) {
          const worldPos = new THREE.Vector3();
          groupRef.current.getWorldPosition(worldPos);
          onBubbleClick(id, worldPos); 
        }
      }}
    >
      <group ref={rotateRef}>
        <Center>
            <group scale={getFeatherScale()}> 
              {featherMeshes.map((mesh, i) => (
                <primitive key={i} object={mesh.clone()} />
              ))}
            </group>
        </Center>
      </group>
      {showBurst && <BurstParticles active={showBurst} radius={getBubbleRadius()} />}
      <group ref={bubbleGroupRef} scale={0}>
        <Suspense fallback={null}><FloatBubble scale={1} radius={getBubbleRadius()} isBurst={false} /></Suspense>
      </group>
    </group>
  );
});

useGLTF.preload("/models/feather1.glb");
useGLTF.preload("/models/feather2.glb");

export default NaturalFeather;