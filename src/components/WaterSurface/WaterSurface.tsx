import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
// @ts-ignore
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

const WATER_LEVEL = 0.7;
const START_OFFSET = 5.0;
const RING_COUNT = 8;

const WaterSurface = ({ fallProgress, id3Ref }: { fallProgress: number; id3Ref: any }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const swanGroupRef = useRef<THREE.Group>(null!);

  const { scene: swanScene, animations } = useGLTF("/models/swan.glb") as any;
  
  const swanModel = useMemo(() => {
    const clone = SkeletonUtils.clone(swanScene);
    if (animations && animations.length > 0) {
      const tempMixer = new THREE.AnimationMixer(clone);
      const action = tempMixer.clipAction(animations[0]);
      action.play();
      action.time = 0;
      tempMixer.update(0); 
      clone.updateMatrixWorld(true);
    }
    return clone;
  }, [swanScene, animations]);

  const mixer = useMemo(() => new THREE.AnimationMixer(swanModel), [swanModel]);
  const hasStartedAnim = useRef(false);

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.47, 0.53, 64), []);

  useFrame((state, delta) => {
    mixer.update(delta);

    if (materialRef.current && meshRef.current) {
      const targetY = THREE.MathUtils.lerp(WATER_LEVEL - START_OFFSET, WATER_LEVEL, fallProgress);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      
      if (id3Ref?.current) {
        // ✅ FIX 1: Sync Matrix before position check
        // This ensures worldPos is 100% accurate every frame
        id3Ref.current.updateMatrixWorld();

        const worldPos = new THREE.Vector3();
        id3Ref.current.getWorldPosition(worldPos);
        const currentWaterY = meshRef.current.position.y;
        const verticalDist = worldPos.y - currentWaterY;
        
        const reflectionCutoff = 0.45; 
        const isTouching = verticalDist < 0.4;

        materialRef.current.mixStrength = (verticalDist < reflectionCutoff) ? 0 : 5.0;

        const swanFadeProgress = 1 - THREE.MathUtils.smoothstep(verticalDist, -0.1, 0.7);

        if (verticalDist < 0.8) {
          if (animations.length > 0 && !hasStartedAnim.current) {
            const action = mixer.clipAction(animations[0]);
            action.reset().play();
            action.paused = true; 
            hasStartedAnim.current = true;
          }

          if (swanGroupRef.current) {
            swanGroupRef.current.visible = true;
            
            // ✅ FIX 2: Stable Positioning
            swanGroupRef.current.position.set(worldPos.x - 1, currentWaterY - 1.1, worldPos.z);
            
            // ✅ FIX 3: Forced Scale Reset
            // Prevents the "sometimes small" bug
            swanGroupRef.current.scale.setScalar(2.1);
            
            swanGroupRef.current.traverse((child: any) => {
              if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = THREE.MathUtils.lerp(0, 0.25, swanFadeProgress);
                child.material.depthTest = false;
              }
            });
          }
        } else {
          if (hasStartedAnim.current) {
            mixer.stopAllAction();
            hasStartedAnim.current = false;
          }
          if (swanGroupRef.current) swanGroupRef.current.visible = false;
        }

        materialRef.current.opacity = 0.15;

        ringRefs.current.forEach((ring, i) => {
          if (ring) {
            const mat = ring.material as THREE.MeshBasicMaterial;
            ring.position.set(worldPos.x, currentWaterY + 0.08, worldPos.z);
            if (isTouching) {
              ring.visible = true;
              const time = state.clock.getElapsedTime() * 0.15;
              const loopProgress = (time + (i / RING_COUNT)) % 1;
              const scaleBase = 0.1 + Math.pow(loopProgress, 1.8) * 20;
              const horizontalStretch = THREE.MathUtils.lerp(1.0, 2.5, loopProgress);
              ring.scale.set(scaleBase * horizontalStretch, scaleBase, 1);
              const proximityFactor = 1 - THREE.MathUtils.smoothstep(verticalDist, -0.1, 0.4);
              mat.opacity = Math.sin(loopProgress * Math.PI) * 1.0 * proximityFactor;
            } else {
              ring.visible = false;
            }
          }
        });

        materialRef.current.distortion = THREE.MathUtils.lerp(0.5, 2.5, swanFadeProgress);
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL - START_OFFSET, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          ref={materialRef}
          blur={[500, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5.0}
          mirror={1}
          color="#49261c" 
          transparent
          opacity={0}
          depthScale={2.0}
          minDepthThreshold={0.1}
          maxDepthThreshold={1.5}
          depthWrite={false}
        />
      </mesh>

      <group ref={swanGroupRef} visible={false} renderOrder={100}>
        <primitive object={swanModel} rotation={[Math.PI, Math.PI / -2, 0]} />
      </group>

      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh key={i} renderOrder={999} ref={(el) => (ringRefs.current[i] = el!)} rotation={[-Math.PI / 2, 0, 0]} geometry={ringGeo} visible={false}>
          <meshBasicMaterial color="#ffffff" transparent opacity={1} depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

export default WaterSurface;