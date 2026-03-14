import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

type Props = {
  target: THREE.Vector3 | null;
  enabled: boolean;
};

const CameraFocusController = ({ target, enabled }: Props) => {
  const { camera } = useThree();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!enabled || !target) return;
    
    // Kill any existing camera animations to prevent jitters
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera.rotation);
    tlRef.current?.kill();

    // 🚀 THE FIX: Strict center-left framing offset.
    // By keeping X positive, we move the camera right, which pushes the feather left.
    const offsetX = 6.0;  // Pushes feather to the center of the left panel
    const offsetY = 0.0;  // Keeps it vertically centered
    const offsetZ = 14.0; // Perfect zoom distance

    const newPos = {
      x: target.x + offsetX,
      y: target.y + offsetY,
      z: target.z + offsetZ
    };

    // Use power3.inOut for a buttery smooth start and stop
    tlRef.current = gsap.timeline({ defaults: { ease: "power3.inOut", duration: 1.5 } });

    tlRef.current
      .to(camera.position, { x: newPos.x, y: newPos.y, z: newPos.z }, 0)
      // 🚀 Force rotation to perfectly flat so it NEVER looks at it from a weird diagonal angle
      .to(camera.rotation, { x: 0, y: 0, z: 0 }, 0);

    return () => { tlRef.current?.kill(); };
  }, [enabled, target, camera]);

  return null;
};

export default CameraFocusController;