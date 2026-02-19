import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
// @ts-ignore
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const WATER_LEVEL = 0.7;
const START_OFFSET = 5.0;
const RING_COUNT = 8;

const WaterSurface = ({
  fallProgress,
  id3Ref,
}: {
  fallProgress: number;
  id3Ref: any;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const swanGroupRef = useRef<THREE.Group>(null!);

  const { scene: swanScene, animations } = useGLTF("/models/swan.glb") as any;

  // ✅ Real Concentric Ripple Shader (Stone Drop Effect)
  const rippleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vUv = uv;

          vec3 pos = position;

          // radial distance from center
          float dist = length(pos.xy);

          // outward moving wave
          float wave = sin(dist * 30.0 - uTime * 8.0) * 0.12;

          // fade wave with distance
          wave *= smoothstep(1.5, 0.0, dist);

          pos.z += wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          float dist = distance(vUv, vec2(0.5));

          // ring band glow
          float ring = smoothstep(0.50, 0.46, dist) - smoothstep(0.46, 0.43, dist);

          gl_FragColor = vec4(uColor, ring * uOpacity);
        }
      `,
    });
  }, []);

  // Swan clone (your original logic kept)
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

  // ✅ Higher Segments for smooth 3D ripples
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.47, 0.53, 128, 4), []);

  useFrame((state, delta) => {
    mixer.update(delta);

    // Animate shader time
    rippleMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (materialRef.current && meshRef.current) {
      const targetY = THREE.MathUtils.lerp(
        WATER_LEVEL - START_OFFSET,
        WATER_LEVEL,
        fallProgress
      );

      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );

      if (id3Ref?.current) {
        id3Ref.current.updateMatrixWorld();

        const worldPos = new THREE.Vector3();
        id3Ref.current.getWorldPosition(worldPos);

        const currentWaterY = meshRef.current.position.y;
        const verticalDist = worldPos.y - currentWaterY;

        const reflectionCutoff = 0.45;
        const isTouching = verticalDist < 0.4;

        materialRef.current.mixStrength =
          verticalDist < reflectionCutoff ? 0 : 5.0;

        const swanFadeProgress =
          1 - THREE.MathUtils.smoothstep(verticalDist, -0.1, 0.7);

        // Swan show/hide
        if (verticalDist < 0.8) {
          if (animations.length > 0 && !hasStartedAnim.current) {
            const action = mixer.clipAction(animations[0]);
            action.reset().play();
            action.paused = true;
            hasStartedAnim.current = true;
          }

          if (swanGroupRef.current) {
            swanGroupRef.current.visible = true;

            swanGroupRef.current.position.set(
              worldPos.x - 1,
              currentWaterY - 1.1,
              worldPos.z
            );

            swanGroupRef.current.scale.setScalar(2.1);

            swanGroupRef.current.traverse((child: any) => {
              if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = THREE.MathUtils.lerp(
                  0,
                  0.25,
                  swanFadeProgress
                );
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

        // ✅ Concentric Ripple Rings Animation
        ringRefs.current.forEach((ring, i) => {
          if (!ring) return;

          const mat = ring.material as any;

          ring.position.set(worldPos.x, currentWaterY + 0.05, worldPos.z);

          if (isTouching) {
            ring.visible = true;

            const time = state.clock.getElapsedTime();
            const speed = 0.15;

            const t = ((time * speed) + (i * 0.18)) % 1;

            // ripple expansion
            const scale = THREE.MathUtils.lerp(0.2, 15, t);
            ring.scale.set(scale, scale, 1);

            // fade out naturally
            const fade = 1.0 - t;

            // stronger when object is near water
            const proximityFactor =
              1 - THREE.MathUtils.smoothstep(verticalDist, -0.1, 0.5);

            mat.uniforms.uOpacity.value = fade * proximityFactor * 0.9;
          } else {
            ring.visible = false;
          }
        });

        materialRef.current.distortion = THREE.MathUtils.lerp(
          0.5,
          2.5,
          swanFadeProgress
        );
      }
    }
  });

  return (
    <>
      {/* Water Plane */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, WATER_LEVEL - START_OFFSET, 0]}
      >
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

      {/* Swan */}
      <group ref={swanGroupRef} visible={false} renderOrder={100}>
        <primitive object={swanModel} rotation={[Math.PI, Math.PI / -2, 0]} />
      </group>

      {/* Ripple Rings */}
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh
          key={i}
          renderOrder={999}
          ref={(el) => (ringRefs.current[i] = el!)}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ringGeo}
          visible={false}
        >
          {/* IMPORTANT: clone material so each ring has its own uniform */}
          <primitive object={rippleMaterial.clone()} attach="material" />
        </mesh>
      ))}
    </>
  );
};

export default WaterSurface;
