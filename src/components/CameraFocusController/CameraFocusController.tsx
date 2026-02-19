import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

type Props = {
  target: THREE.Vector3 | null;
  enabled: boolean;
  zoomDistance?: number;
};

const CameraFocusController = ({ target, enabled }: Props) => {
  const { camera } = useThree();

  const lookAtRef = useRef(new THREE.Vector3());
  const defaultPos = useRef<THREE.Vector3 | null>(null);
  const defaultLookAt = useRef<THREE.Vector3 | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!defaultPos.current) {
      defaultPos.current = camera.position.clone();
      camera.getWorldDirection(lookAtRef.current);
      defaultLookAt.current = lookAtRef.current.clone().multiplyScalar(10).add(camera.position);
    }
  }, [camera]);

  useEffect(() => {
    if (!enabled || !target) return;
    tlRef.current?.kill();

    camera.getWorldDirection(lookAtRef.current);
    lookAtRef.current.multiplyScalar(10).add(camera.position);

    const dir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    const distance = 3.5; // CLOSE ZOOM
    const newPos = target.clone().add(dir.multiplyScalar(distance));

    tlRef.current = gsap.timeline({ defaults: { ease: "power3.inOut", duration: 1.2 } });

    tlRef.current
      .to(camera.position, { x: newPos.x, y: newPos.y, z: newPos.z }, 0)
      .to(lookAtRef.current, { x: target.x, y: target.y, z: target.z, onUpdate: () => camera.lookAt(lookAtRef.current) }, 0);

    return () => { tlRef.current?.kill(); };
  }, [enabled, target, camera]);

  useEffect(() => {
    if (enabled) return;
    if (!defaultPos.current || !defaultLookAt.current) return;
    tlRef.current?.kill();

    tlRef.current = gsap.timeline({ defaults: { ease: "power3.inOut", duration: 1 } });

    tlRef.current
      .to(camera.position, { x: defaultPos.current.x, y: defaultPos.current.y, z: defaultPos.current.z }, 0)
      .to(lookAtRef.current, { x: defaultLookAt.current.x, y: defaultLookAt.current.y, z: defaultLookAt.current.z, onUpdate: () => camera.lookAt(lookAtRef.current) }, 0);

    return () => { tlRef.current?.kill(); };
  }, [enabled, camera]);

  return null;
};

export default CameraFocusController;