import { Center, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef, useState, Suspense, forwardRef } from "react";
import * as THREE from "three";
import BurstParticles from "../BurstParticles/BurstParticles";
import FloatBubble from "../FloatBubble/FloatBubble";
import { useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NaturalFeather = forwardRef(({ 
  id, startPos, targetPos, started, variant, activeId, onBubbleClick,
  allBubblesReady
}: any, ref: any) => {
  
  const { nodes, materials } = useGLTF("/models/feather_2.glb") as any;

  const localGroupRef = useRef<THREE.Group>(null!);
  const groupRef = ref || localGroupRef; 
  const rotateRef = useRef<THREE.Group>(null!);
  const bubbleGroupRef = useRef<THREE.Group>(null!); 
  const rotTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [showBurst, setShowBurst] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  const isBurst = activeId === id; 
  const wasClicked = useRef(false);

  // --- HELPER FUNCTIONS ---
  const getBubbleRadius = () => {
    switch (variant) {
      case "small-drag": return 1.8;
      case "high-drag-zig": return 1.8;
      case "mid-drift": return 1.4;
      case "upper-pendulum": return 1.9;
      case "side-roll-upper": return 1.5;
      default: return 2;
    }
  };

  const getFeatherScale = () => {
    switch (variant) {
        case "small-drag": return 0.35;
        case "high-drag-zig": return 0.32;
        case "side-roll-upper": return 0.28;
        case "mid-drift": return 0.30;
        default: return 0.45;
    }
  };

  // ✅ HANDLERS FOR MOUSE ROTATION
  const handlePointerDown = (e: any) => {
    if (!isBurst) return;
    e.stopPropagation();
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || !isBurst) return;

    const deltaX = e.clientX - previousPointer.current.x;
    const deltaY = e.clientY - previousPointer.current.y;

    setRotation((prev) => [
      prev[0] + deltaY * 0.01, 
      prev[1] + deltaX * 0.01, 
      0
    ]);

    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

 useEffect(() => {
  let timer: any;
  
  if (isBurst) {
    // 1. When the bubble is clicked/zoomed in
    wasClicked.current = true;
    setShowBurst(true);
    if (bubbleGroupRef.current) bubbleGroupRef.current.visible = false;
  } else {
    // 2. When the bubble is closed (Resetting)
    // ✅ FIX: We removed "!burstAll" so this ALWAYS runs when you close the panel
    setShowBurst(false);
    
    if (wasClicked.current) {
      timer = setTimeout(() => {
        if (bubbleGroupRef.current) {
          bubbleGroupRef.current.visible = true;
          // Reset scale to 0 and pop it back in
          gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
          gsap.to(bubbleGroupRef.current.scale, { 
            x: 1, y: 1, z: 1, 
            duration: 0.8, 
            ease: "back.out(1.7)" 
          });
        }
        wasClicked.current = false;
      }, 100); // 100ms is snappier for your slow-motion scroll
    }
  }
  return () => clearTimeout(timer);
}, [isBurst]); // ✅ FIX: Only depend on isBurst so scroll position doesn't block it

  useLayoutEffect(() => {
    Object.values(materials).forEach((mat: any) => {
      if (mat) { mat.color = new THREE.Color("#ffffff"); mat.toneMapped = false; mat.transparent = true; }
    });
  }, [materials]);

  useFrame((state) => {
    if (!started) return;

    // Pause GSAP when active to allow manual rotation
    if (isBurst) {
      if (rotTimelineRef.current && !rotTimelineRef.current.paused()) {
        rotTimelineRef.current.pause();
      }
    } else {
      if (rotTimelineRef.current && rotTimelineRef.current.paused()) {
        rotTimelineRef.current.play();
      }
    }

    if (!showBurst) {
      const time = state.clock.getElapsedTime() * 2; 
      rotateRef.current.position.x = Math.sin(time + id) * 0.02;
      rotateRef.current.position.y = Math.cos(time + id) * 0.02;
    }
    
    if (isBurst && rotateRef.current) {
      rotateRef.current.rotation.x = THREE.MathUtils.lerp(rotateRef.current.rotation.x, rotation[0], 0.1);
      rotateRef.current.rotation.y = THREE.MathUtils.lerp(rotateRef.current.rotation.y, rotation[1], 0.1);
    }
  });

  useGSAP(() => {
    if (!started || !groupRef.current) return;
    
    const entranceTl = gsap.timeline({
        scrollTrigger: { trigger: document.body, start: "top top", end: "500px top", scrub: 1.5 }
    });

    const posTl = gsap.timeline();
    const rotTl = gsap.timeline();
    rotTimelineRef.current = rotTl;

    if (variant === "high-drag-zig") {
        posTl.to(groupRef.current.position, { x: startPos[0] + 1.5, y: startPos[1] + 1, duration: 0.8, ease: "power2.out" })
             .to(groupRef.current.position, { x: "-=2.5", y: THREE.MathUtils.lerp(startPos[1], targetPos[1], 0.35), duration: 1.8, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: "+=2.0", y: THREE.MathUtils.lerp(startPos[1], targetPos[1], 0.7), duration: 1.8, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 1.5, ease: "power2.inOut" });
        rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.2, y: Math.PI * 6, z: Math.PI / 1.6, duration: 11, ease: "power1.out" });
    } else if (variant === "mid-drift") {
      posTl.to(groupRef.current.position, { x: startPos[0] - 0.5, y: startPos[1] + 1.5, duration: 1.2, ease: "power2.out" })
           .to(groupRef.current.position, { x: targetPos[0] + 2, y: THREE.MathUtils.lerp(startPos[1] + 1.5, targetPos[1], 0.45), duration: 3.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.5, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: "+=" + Math.PI * 2, y: Math.PI * 4, duration: 3.0, ease: "power1.inOut" }).to(rotateRef.current.rotation, { x: Math.PI / -6, z: -Math.PI / 8, duration: 2.0, ease: "power2.out" }, ">");
    } else if (variant === "side-roll-upper") {
      posTl.to(groupRef.current.position, { x: startPos[0] + 1, y: startPos[1] + 2, z: startPos[2], duration: 1.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: targetPos[0] + 1.5, y: THREE.MathUtils.lerp(startPos[1] + 2, targetPos[1], 0.5), duration: 3.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.8, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 3, y: Math.PI * 0.5, z: Math.PI * 0.4, duration: 11, ease: "power2.out" });
    } else if (variant === "upper-pendulum") {
      posTl.to(groupRef.current.position, { x: startPos[0] + 1, y: startPos[1] + 3, z: startPos[2] - 1.5, duration: 1.2, ease: "power2.out" })
           .to(groupRef.current.position, { x: "-=2", y: THREE.MathUtils.lerp(startPos[1] + 3, targetPos[1], 0.5), duration: 2.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: "+=1.5", y: THREE.MathUtils.lerp(startPos[1] + 3, targetPos[1], 0.8), duration: 2.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: targetPos[0], duration: 2.5, ease: "slow(0.5, 0.8, false)" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.15, y: Math.PI * 1.2, z: Math.PI * 0.08, duration: 11, ease: "power2.out" });
    } else if (variant === "small-drag") {
      posTl.to(groupRef.current.position, { x: startPos[0] - 2.5, y: startPos[1] + 4, z: startPos[2] + 1, duration: 1.0, ease: "power1.out" })
           .to(groupRef.current.position, { x: 6.0, y: THREE.MathUtils.lerp(startPos[1] + 4, targetPos[1], 0.3), duration: 11 / 3, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: "-=6.0", y: THREE.MathUtils.lerp(startPos[1] + 4, targetPos[1], 0.6), duration: 11 / 3, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 11 / 3, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.15, z: Math.PI / 2, y: Math.PI * 4, duration: 11, ease: "sine.inOut" });
    } else {
        posTl.to(groupRef.current.position, { x: startPos[0] + 3, y: startPos[1] + 5, z: startPos[2] - 2, duration: 0.8, ease: "power2.out" })
             .to(groupRef.current.position, { x: -4.5, y: THREE.MathUtils.lerp(startPos[1] + 5, targetPos[1], 0.25), duration: 2.2, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: 4.5, y: THREE.MathUtils.lerp(startPos[1] + 5, targetPos[1], 0.5), duration: 2.2, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: targetPos[0], y: targetPos[1], duration: 4.5, ease: "power1.inOut" });
        rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.3, z: Math.PI * 0.1, y: Math.PI * 1, duration: 1.5, ease: "power1.inOut" })
             .to(rotateRef.current.rotation, { x: 0, z: Math.PI / 2, y: "+=" + Math.PI * 1.0, duration: 11 - 3.0, ease: "power2.out" }, ">");
    }
    entranceTl.add(posTl, 0).add(rotTl, 0);

    if (bubbleGroupRef.current) {
        gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
        const bubbleTl = gsap.timeline({
            scrollTrigger: { trigger: document.body, start: "420px top", end: "500px top", scrub: 1.5 }
        });
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

      const targetRot = { x: Math.PI / 1.8, y: Math.PI * 2.2, z: Math.PI / 2.8 };
      const landingY = 1.05; 
      const currentY = groupRef.current.position.y;
      const peakY = currentY + 0.1; 

      scrubTl.to(groupRef.current.position, { x: "-=1.5", y: peakY, duration: 1.0, ease: "power2.out" }, 0);
      scrubTl.to(groupRef.current.position, { x: "+=4.0", y: THREE.MathUtils.lerp(peakY, landingY, 0.3), duration: 11 / 3, ease: "sine.inOut" }, 1.0)
             .to(rotateRef.current.rotation, { z: targetRot.z - 0.2, duration: 11 / 3, ease: "sine.inOut" }, 1.0);
      scrubTl.to(groupRef.current.position, { x: "-=4.0", y: THREE.MathUtils.lerp(peakY, landingY, 0.6), duration: 11 / 3, ease: "sine.inOut" }, 1 + (11 / 3))
             .to(rotateRef.current.rotation, { z: targetRot.z + 0.2, duration: 11 / 3, ease: "sine.inOut" }, 1 + (11 / 3));
      scrubTl.to(groupRef.current.position, { x: targetPos[0], y: landingY, duration: 11 / 3, ease: "power1.inOut" }, 1 + (22 / 3))
             .to(rotateRef.current.rotation, {
        x: Math.PI/6,
        y: 0,
        z: Math.PI/2,
        duration: 11 / 3,
        ease: "power2.inOut"
      }, 1 + (22 / 3));
    } else {
      const recoilX = (id % 2 === 0 ? 1.5 : -1.5) * (1 + (id % 3) * 0.2); 
      const recoilY = -1.5 - (id % 2); 
      const recoilZ = (id % 2 === 0 ? -1 : 1) * (1 + (id % 2));
      const randomRot = Math.PI * (1.5 + (id * 0.2));

      const scrubTl = gsap.timeline({
          scrollTrigger: {
              trigger: document.body, start: `${fallStart}px top`, end: "+=600", scrub: 1.5,
              onEnter: () => { setShowBurst(true); if (bubbleGroupRef.current) bubbleGroupRef.current.visible = false; },
              onLeaveBack: () => { setShowBurst(false); if (bubbleGroupRef.current) bubbleGroupRef.current.visible = true; }
          }
      });

      scrubTl.to(groupRef.current.position, { x: `+=${recoilX}`, y: `+=${recoilY}`, z: `+=${recoilZ}`, duration: 1.5, ease: "power2.out" }, 0);
      scrubTl.to(rotateRef.current.rotation, { x: Math.PI / (1.2 + (id % 2)), y: randomRot, z: Math.PI / (2 + (id % 3)), duration: 1.5, ease: "power2.out" }, 0);
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
              <mesh geometry={nodes.Cylinder021.geometry} material={materials["Material.006"]} rotation={[-0.566, 0.458, 0.274]} />
              <mesh geometry={nodes.Mesh002.geometry} material={nodes.Mesh002.material} rotation={[0, 0.529, 0]} />
              <mesh geometry={nodes.Mesh003.geometry} material={nodes.Mesh003.material} rotation={[0, 0.529, 0]} />
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

useGLTF.preload("/models/feather_2.glb");
export default NaturalFeather;