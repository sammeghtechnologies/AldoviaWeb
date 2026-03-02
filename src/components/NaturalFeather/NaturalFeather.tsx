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
  allBubblesReady, burstAll, startOffset
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
      case "small-drag": return 4.8;
      case "high-drag-zig": return 4.8;
      case "mid-drift": return 5.4;
      case "upper-pendulum": return 5.9;
      case "side-roll-upper": return 4.5;
      default: return 5.5;
    }
  };

  const getFeatherScale = () => {
    switch (variant) {
        case "small-drag": return 1.35;
        case "high-drag-zig": return 1.32;
        case "side-roll-upper": return 1.28;
        case "mid-drift": return 1.35;
        case "upper-pendulum": return 1.45;
        default: return 1.45;
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

  // Inside NaturalFeather.tsx
useEffect(() => {
  let timer: any;
  
  if (isBurst) {
    // 💥 BURST LOGIC
    wasClicked.current = true;
    setShowBurst(true);
    if (bubbleGroupRef.current) {
      // Scale down before hiding to keep it smooth
      gsap.to(bubbleGroupRef.current.scale, { 
        x: 0, y: 0, z: 0, 
        duration: 0.3, 
        onComplete: () => { bubbleGroupRef.current.visible = false; }
      });
    }
  } else {
    // 🫧 RE-WRAP LOGIC (When panel closes)
    setShowBurst(false);
    
    if (wasClicked.current) {
      if (bubbleGroupRef.current) {
        bubbleGroupRef.current.visible = true;
        // Reset scale and animate it back up
        gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
        gsap.to(bubbleGroupRef.current.scale, { 
          x: 1, y: 1, z: 1, 
          duration: 1.2, 
          ease: "elastic.out(1, 0.75)" // Gives it a nice "bouncy" wrap feel
        });
      }
      wasClicked.current = false;
    }
  }
  return () => clearTimeout(timer);
}, [isBurst, burstAll]);

  useLayoutEffect(() => {
    const applyMaterialStyle = (mat: any) => {
      if (!mat) return;
      mat.color = new THREE.Color("#ffffff");
      mat.toneMapped = false;
      mat.transparent = true;
      mat.opacity = 1;
      mat.depthWrite = true;
      mat.needsUpdate = true;
    };

    Object.values(materials).forEach((mat: any) => applyMaterialStyle(mat));
    applyMaterialStyle(nodes?.Mesh002?.material);
    applyMaterialStyle(nodes?.Mesh003?.material);
    applyMaterialStyle(nodes?.Cylinder021?.material);
  }, [materials, nodes]);

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
    
    if (isBurst && rotateRef.current) {
      rotateRef.current.rotation.x = THREE.MathUtils.lerp(rotateRef.current.rotation.x, rotation[0], 0.1);
      rotateRef.current.rotation.y = THREE.MathUtils.lerp(rotateRef.current.rotation.y, rotation[1], 0.1);
    }
  });

  useGSAP(() => {
    if (!started || !groupRef.current) return;
    
    const entranceTl = gsap.timeline({
        scrollTrigger: { 
          trigger: document.body, 
          // Start exactly where the swan leaves, and animate for 1000px
          start: `${startOffset}px top`, 
          end: `${startOffset + 1000}px top`, 
          scrub: 1.5 
        }
    });

    // Start them high up to give them a long fall
   // Start them high up to give them a long fall
    const dropHeight = startPos[1] + 15;
    gsap.set(groupRef.current.position, { y: dropHeight });

    const posTl = gsap.timeline();
    const rotTl = gsap.timeline();
    rotTimelineRef.current = rotTl;

    // This locks them to their wide X coordinates
    const laneX = targetPos[0];

    if (variant === "high-drag-zig") {
        // Total duration increased from 6.5s to ~11s
        posTl.to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.25), duration: 2.0, ease: "power2.out" })
             .to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.5), duration: 3.5, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX + 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.75), duration: 3.0, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 2.5, ease: "power2.inOut" });
        rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.2, y: Math.PI * 6, z: Math.PI / 1.6, duration: 15, ease: "power1.out" });
        
    } else if (variant === "mid-drift") {
      // Total duration increased from 7s to 12s
      posTl.to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.6), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 4.5, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: "+=" + Math.PI * 2, y: Math.PI * 4, duration: 6.0, ease: "power1.inOut" })
           .to(rotateRef.current.rotation, { x: Math.PI / -6, z: -Math.PI / 8, duration: 6.0, ease: "power2.out" }, ">");
           
    } else if (variant === "side-roll-upper") {
      // Total duration increased from 7.8s to 13s
      posTl.to(groupRef.current.position, { x: laneX + 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), z: startPos[2], duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX - 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.65), duration: 5.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 5.0, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 3, y: Math.PI * 0.5, z: Math.PI * 0.4, duration: 15, ease: "power2.out" });
      
    } else if (variant === "upper-pendulum") {
      // Total duration increased from 9s to 14.5s
      posTl.to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), z: startPos[2] - 1.5, duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.6), duration: 4.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX - 0.5, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.8), duration: 4.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 4.0, ease: "slow(0.5, 0.8, false)" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 1.8, y: Math.PI * 2.2, z: Math.PI / 2.8, duration: 16, ease: "power2.out" });
      
    } else if (variant === "small-drag") {
      // Total duration increased from 12s to 18s
      posTl.to(groupRef.current.position, { x: laneX - 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.2), z: startPos[2] + 1, duration: 3.0, ease: "power1.out" })
           .to(groupRef.current.position, { x: laneX + 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.5), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.8), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 5.0, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.15, z: Math.PI / 2, y: Math.PI * 4, duration: 18, ease: "sine.inOut" });
      
    } else {
        // Main variant: Total duration increased from ~10s to 17s
        posTl.to(groupRef.current.position, { x: laneX + 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.25), z: startPos[2] - 2, duration: 2.0, ease: "power2.out" })
             .to(groupRef.current.position, { x: laneX - 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.5), duration: 5.0, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX + 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.75), duration: 5.0, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 5.0, ease: "power1.inOut" });
        rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.3, z: Math.PI * 0.1, y: Math.PI * 1, duration: 3.0, ease: "power1.inOut" })
             .to(rotateRef.current.rotation, { x: 0, z: Math.PI / 2, y: "+=" + Math.PI * 1.0, duration: 14.0, ease: "power2.out" }, ">");
    }
    entranceTl.add(posTl, 0).add(rotTl, 0);

    if (bubbleGroupRef.current) {
        gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
        const bubbleTl = gsap.timeline({
            scrollTrigger: { 
              trigger: document.body, 
              // Shift the bubble reveal to happen during the fall
              start: `${startOffset + 900}px top`, 
              end: `${startOffset + 100}px top`, 
              scrub: 1.5 
            }
        });
        bubbleTl.to(bubbleGroupRef.current.scale, { x: 1, y: 1, z: 1, ease: "back.out(1.7)" });
    }

   const fallStart = startOffset + 1500;
    if (id === 3) {
      const scrubTl = gsap.timeline({
          scrollTrigger: {
              trigger: document.body, start: `${fallStart}px top`, end: "+=800", scrub: 2.5, 
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
             .to(rotateRef.current.rotation, { z: targetRot.z, duration: 11 / 3, ease: "sine.inOut" }, 1 + (22 / 3));
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

  // ✅ NEW CONDITION: Allow clicking 500px after they start appearing
  // This ensures they are visible on screen before interaction is allowed.
  const isVisibleOnScreen = sY > (startOffset + 500); 

  if (isVisibleOnScreen && allBubblesReady && activeId !== id) {
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    
    // This sends the data to handleBubbleClick in MainCanvas.tsx
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
