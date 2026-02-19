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
  const lookAtRef = useRef(new THREE.Vector3());
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ✅ ONLY HANDLE THE ZOOM IN
  useEffect(() => {
    if (!enabled || !target) return;
    
    // Kill any existing camera animations to prevent jitters
    gsap.killTweensOf(camera.position);
    tlRef.current?.kill();

    // Capture current direction to start the lookAt transition smoothly
    camera.getWorldDirection(lookAtRef.current);
    lookAtRef.current.multiplyScalar(10).add(camera.position);

    const dir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    const distance = 3.5; 
    const newPos = target.clone().add(dir.multiplyScalar(distance));

    tlRef.current = gsap.timeline({ defaults: { ease: "power3.inOut", duration: 1.5 } });

    tlRef.current
      .to(camera.position, { x: newPos.x, y: newPos.y, z: newPos.z }, 0)
      .to(lookAtRef.current, { 
        x: target.x, 
        y: target.y, 
        z: target.z, 
        onUpdate: () => camera.lookAt(lookAtRef.current) 
      }, 0);

    return () => { tlRef.current?.kill(); };
  }, [enabled, target, camera]);

  // ✅ ZOOM OUT IS NOW HANDLED BY ScrollZoomLogic TO PREVENT CONFLICTS
  return null;
};

export default CameraFocusController;