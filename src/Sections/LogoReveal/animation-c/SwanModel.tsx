import { useRef} from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
// @ts-ignore
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useAnimations } from "@react-three/drei";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


export const SwanModel = ({ scrollProgress, transformProgress, opacity }: { scrollProgress: number; transformProgress: number; opacity: number }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/Swan_anim_v12.glb");
  const { actions } = useAnimations(animations, group);

  useLayoutEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.4;
          child.material.metalness = 0.0;
          child.material.envMapIntensity = 1.5;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = opacity;
        child.material.needsUpdate = true;
      }
    });
  }, [opacity, scene]);

  useEffect(() => {
    const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
    if (action) action.play().paused = true;
    return () => { if (action) action.stop(); };
  }, [actions]);

  useEffect(() => {
    const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
    if (action && action.getClip()) action.time = action.getClip().duration * scrollProgress;
  }, [scrollProgress, actions]);

  const baseScale = isMobile ? 380 : 600;
  const currentScale = baseScale + transformProgress * (isMobile ? 250 : 400);

  return (
    <primitive ref={group} object={scene} scale={currentScale} position={[0, -14, 0]} rotation={[0.1, -Math.PI / 160, 0]} visible={opacity > 0} />
  );
};

useGLTF.preload("/models/Swan_anim_v12.glb");