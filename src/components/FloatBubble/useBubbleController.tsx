import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export function useBubbleController({
  position,
  delay,
  variant,
  started,
}: {
  position: [number, number, number];
  delay: number;
  variant: number;
  started: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const [finalX, finalY, finalZ] = position;
    const startY = finalY + 15; 

    // --- 1. INITIAL PLACEMENT ---
    gsap.set(group.position, { x: finalX, y: startY, z: finalZ });

    let initialRotX = 0;
    let initialRotZ = 0;
    if (variant === 2) initialRotX = -0.8; 
    if (variant === 3) initialRotZ = 1.2; 
    gsap.set(group.rotation, { x: initialRotX, y: 0, z: initialRotZ });

    if (!started) return;

    // --- 2. ANIMATION CONFIG ---
    const duration = gsap.utils.random(16, 22);
    const swayDuration = gsap.utils.random(2.0, 3.5);
    const swayWidth = 1.8;

    const tl = gsap.timeline({ delay });

    // Vertical Fall
    tl.to(group.position, {
      y: finalY,
      duration: duration,
      ease: "power1.out",
      onComplete: () => { tl.kill(); }
    }, 0);

    // Sway & Banking
    tl.to(group.position, {
      x: `+=${swayWidth}`,
      duration: swayDuration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    }, 0);

    tl.to(group.rotation, {
      z: `+=${0.3}`,
      duration: swayDuration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    }, 0);

    return () => {
      tl.kill();
    };
  }, [started, position, delay, variant]);

  return { groupRef };
}