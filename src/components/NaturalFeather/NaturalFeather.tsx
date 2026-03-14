import { Center, useGLTF, Text } from "@react-three/drei";
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
  allBubblesReady, burstAll, startOffset,opacity = 1, label
}: any, ref: any) => {

  
  
  const { nodes, materials } = useGLTF("/models/feather1.glb") as any;
  console.log("NEW GLTF NODES:", nodes); // <--- ADD THIS

  const localGroupRef = useRef<THREE.Group>(null!);
  const groupRef = ref || localGroupRef; 
  const rotateRef = useRef<THREE.Group>(null!);
  
  // 🚀 NEW: Inner group strictly for mouse interaction
  const innerRotateRef = useRef<THREE.Group>(null!); 
  const bubbleGroupRef = useRef<THREE.Group>(null!); 
  const rotTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [showBurst, setShowBurst] = useState(false);
  
  // 🚀 DRAG STATE (Moved to refs for better 60fps performance without re-renders)
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const targetDragRot = useRef({ x: 0, y: 0 });

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
      case "spiral-dive": return 5.2;
      default: return 5.5;
    }
  };

  const getFeatherScale = () => {
    switch (variant) {
        case "small-drag": return 0.55/2;
        case "high-drag-zig": return 0.52/2;
        case "side-roll-upper": return 0.48/2;
        case "mid-drift": return 0.55/2;
        case "upper-pendulum": return 0.65/2;
        case "spiral-dive": return 0.58/2;
        default: return 0.65/2;
    }
  };

  // 🚀 UPDATED HANDLERS FOR MOUSE ROTATION (Now works on ALL feathers)
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "auto";
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - previousPointer.current.x;
    const deltaY = e.clientY - previousPointer.current.y;

    // Apply drag to target rotation
    targetDragRot.current.x += deltaY * 0.06;
    targetDragRot.current.y += deltaX * 0.06;

    previousPointer.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    let timer: any;
    
    if (isBurst) {
      wasClicked.current = true;
      setShowBurst(true);
      if (bubbleGroupRef.current) {
        gsap.to(bubbleGroupRef.current.scale, { 
          x: 0, y: 0, z: 0, 
          duration: 0.3, 
          onComplete: () => { bubbleGroupRef.current.visible = false; }
        });
      }
    } else {
      setShowBurst(false);
      if (wasClicked.current) {
        if (bubbleGroupRef.current) {
          bubbleGroupRef.current.visible = true;
          gsap.set(bubbleGroupRef.current.scale, { x: 0, y: 0, z: 0 });
          gsap.to(bubbleGroupRef.current.scale, { 
            x: 1, y: 1, z: 1, 
            duration: 1.2, 
            ease: "elastic.out(1, 0.75)" 
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
applyMaterialStyle(nodes?.singlefeather5?.material);
  }, [materials, nodes]);

  useFrame(() => {
    if (!started) return;

  
Object.values(materials).forEach((mat: any) => {
  if (mat) mat.opacity = opacity;
});
if (nodes?.singlefeather5?.material) nodes.singlefeather5.material.opacity = opacity;
    // Pause GSAP when it is the main active burst feather
    if (isBurst) {
      if (rotTimelineRef.current && !rotTimelineRef.current.paused()) {
        rotTimelineRef.current.pause();
      }
    } else {
      if (rotTimelineRef.current && rotTimelineRef.current.paused()) {
        rotTimelineRef.current.play();
      }
    }
    
    // 🚀 THE MAGIC: Lerp the inner rotation based on mouse drag
    if (innerRotateRef.current) {
      // If we aren't dragging, decay the target rotation back to 0 (This is the "snap back" effect)
      if (!isDragging.current) {
        targetDragRot.current.x = THREE.MathUtils.lerp(targetDragRot.current.x, 0, 0.05);
        targetDragRot.current.y = THREE.MathUtils.lerp(targetDragRot.current.y, 0, 0.05);
      }

      // Smoothly apply the rotation to the mesh
      innerRotateRef.current.rotation.x = THREE.MathUtils.lerp(innerRotateRef.current.rotation.x, targetDragRot.current.x, 0.15);
      innerRotateRef.current.rotation.y = THREE.MathUtils.lerp(innerRotateRef.current.rotation.y, targetDragRot.current.y, 0.15);
    }
  });

  useGSAP(() => {
    if (!started || !groupRef.current) return;
    
    const entranceTl = gsap.timeline({
        scrollTrigger: { 
          trigger: document.body, 
          start: `${startOffset}px top`, 
          end: `${startOffset + 1000}px top`, 
          scrub: 1.5 
        }
    });

    const dropHeight = startPos[1] + 15;
    gsap.set(groupRef.current.position, { y: dropHeight });

    const posTl = gsap.timeline();
    const rotTl = gsap.timeline();
    rotTimelineRef.current = rotTl;

    const laneX = targetPos[0];

    // ... (Keep your existing long GSAP variants exactly as they were) ...
    if (variant === "high-drag-zig") {
        posTl.to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.25), duration: 2.0, ease: "power2.out" })
             .to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.5), duration: 3.5, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX + 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.75), duration: 3.0, ease: "sine.inOut" })
             .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 2.5, ease: "power2.inOut" });
        rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.2, y: Math.PI * 6, z: Math.PI / 1.6, duration: 15, ease: "power1.out" });
    } else if (variant === "mid-drift") {
      posTl.to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.6), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 4.5, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: "+=" + Math.PI * 2, y: Math.PI * 4, duration: 6.0, ease: "power1.inOut" })
           .to(rotateRef.current.rotation, { x: Math.PI / -6, z: -Math.PI / 8, duration: 6.0, ease: "power2.out" }, ">");
    } else if (variant === "side-roll-upper") {
      posTl.to(groupRef.current.position, { x: laneX + 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), z: startPos[2], duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX - 0.8, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.65), duration: 5.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 5.0, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 3, y: Math.PI * 0.5, z: Math.PI * 0.4, duration: 15, ease: "power2.out" });
    } else if (variant === "upper-pendulum") {
      posTl.to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), z: startPos[2] - 1.5, duration: 2.5, ease: "power2.out" })
           .to(groupRef.current.position, { x: laneX + 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.6), duration: 4.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX - 0.5, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.8), duration: 4.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { y: targetPos[1], x: laneX, duration: 4.0, ease: "slow(0.5, 0.8, false)" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 1.8, y: Math.PI * 2.2, z: Math.PI / 2.8, duration: 16, ease: "power2.out" });
    } else if (variant === "small-drag") {
      posTl.to(groupRef.current.position, { x: laneX - 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.2), z: startPos[2] + 1, duration: 3.0, ease: "power1.out" })
           .to(groupRef.current.position, { x: laneX + 1.2, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.5), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX - 1.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.8), duration: 5.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 5.0, ease: "power1.inOut" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI * 0.15, z: Math.PI / 2, y: Math.PI * 4, duration: 18, ease: "sine.inOut" });
    } else if (variant === "spiral-dive") {
      // 🚀 7TH FEATHER: Aggressive corkscrew that pushes out wide, loops tightly, and settles
      posTl.to(groupRef.current.position, { x: laneX + 2.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.3), z: startPos[2] + 1.5, duration: 3.0, ease: "power2.in" })
           .to(groupRef.current.position, { x: laneX - 2.0, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.6), z: startPos[2] - 1.5, duration: 3.0, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX + 0.5, y: THREE.MathUtils.lerp(dropHeight, targetPos[1], 0.8), z: startPos[2] + 0.5, duration: 2.5, ease: "sine.inOut" })
           .to(groupRef.current.position, { x: laneX, y: targetPos[1], duration: 3.0, ease: "power1.out" });
      rotTl.to(rotateRef.current.rotation, { x: Math.PI / 2.5, y: Math.PI * 8, z: Math.PI / 3, duration: 11.5, ease: "power1.inOut" });
    } else {
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
     scrubTl.to(groupRef.current.position, { x: targetPos[0]-4.5, y: landingY, duration: 11 / 3, ease: "power1.inOut" }, 1 + (22 / 3))
             .to(rotateRef.current.rotation, { x: Math.PI / 2, z: 0, duration: 11 / 3, ease: "sine.inOut" }, 1 + (22 / 3));
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
      onPointerOver={() => { if (!isDragging.current) document.body.style.cursor = "grab"; }}
      onClick={(e) => { 
        e.stopPropagation(); 
        const sY = window.scrollY;
        const isVisibleOnScreen = sY > (startOffset + 500); 

        if (isVisibleOnScreen && allBubblesReady && activeId !== id) {
          const worldPos = new THREE.Vector3();
          groupRef.current.getWorldPosition(worldPos);
          onBubbleClick(id, worldPos); 
        }
      }}
    >
      {/* GSAP Controls this outer group */}
      <group ref={rotateRef}>
        <Center>
            {/* 🚀 Mouse drag controls this INNER group */}
<group ref={innerRotateRef} scale={getFeatherScale()}> 
  <mesh geometry={nodes.singlefeather5.geometry} material={nodes.singlefeather5.material} />
</group>
        </Center>
      </group>
      
      {showBurst && <BurstParticles active={showBurst} radius={getBubbleRadius()} />}
      <group ref={bubbleGroupRef} scale={0}>
        <Suspense fallback={null}><FloatBubble scale={1} radius={getBubbleRadius()} isBurst={false} /></Suspense>
        {/* 🚀 NEW: Text Label that scales and disappears with the bubble */}
        {label && (
          <Text
            position={[0, -getBubbleRadius() - 1.4, 0]} // Adjusted slightly for the new text size
            fontSize={0.85}                             // 👈 Bumped up from 0.65 to 0.85
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
            outlineWidth={0.04}                         // Slightly thicker outline for readability
            outlineColor="#000000" 
          >
            {label}
          </Text>
        )}
      </group>
    </group>
  );
});

useGLTF.preload("/models/feather1.glb");
export default NaturalFeather;