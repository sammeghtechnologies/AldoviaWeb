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
  swanProgress,
  id3Ref,
}: {
  fallProgress: number;
  swanProgress: number;
  id3Ref: any;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const swanGroupRef = useRef<THREE.Group>(null!);

  const { scene: swanScene, animations } = useGLTF("/models/swan.glb") as any;

  // random seeds for each ripple ring
  const ringSeeds = useMemo(
    () => Array.from({ length: RING_COUNT }).map(() => Math.random() * 10),
    []
  );

  // ✅ Ripple Shader with dark tint + randomness
  const rippleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color("#ffffff") },
        uDarkColor: { value: new THREE.Color("#000000") },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float dist = length(pos.xy);

          // slower and smoother wave
          float wave = sin(dist * 22.0 - uTime * 2.0) * 0.1;
          // secondary ripple randomness
          float wave2 = cos(dist * 12.0 - uTime * 1.2) * 0.1;
          // fade outward
          float fade = smoothstep(1.6, 0.0, dist);

          pos.z += (wave + wave2) * fade;
          vWave = wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform vec3 uDarkColor;

        varying vec2 vUv;
        varying float vWave;

        void main() {
          float dist = distance(vUv, vec2(0.5));

          // ring thickness
          float ring = smoothstep(0.50, 0.47, dist) - smoothstep(0.47, 0.44, dist);
          // fade outer edge
          float fade = smoothstep(0.9, 0.2, dist);

          // mix white + dark tint for realistic ripple
          vec3 finalColor = mix(uDarkColor, uColor, ring);

          gl_FragColor = vec4(finalColor, ring * fade * uOpacity);
        }
      `,
    });
  }, []);

  // Swan clone
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

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.47, 0.53, 128, 4), []);

  useFrame((state, delta) => {
    mixer.update(delta);

    rippleMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (!materialRef.current || !meshRef.current) return;

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

    if (!id3Ref?.current) return;

    id3Ref.current.updateMatrixWorld();

    const worldPos = new THREE.Vector3();
    id3Ref.current.getWorldPosition(worldPos);

    const currentWaterY = meshRef.current.position.y;
    const verticalDist = worldPos.y - currentWaterY;

    const isTouching = verticalDist < 0.4;

    // 🔥 NEW MATH: Delays the Swan slightly (-0.1), then makes it fade in 5x faster! (Small Slide Scrollbar)
    const fastSwanProgress = Math.max(0, Math.min(1, (swanProgress - 0.1) * 5.0));

    materialRef.current.mixStrength = THREE.MathUtils.lerp(5.0, 0.0, fastSwanProgress);

    // ✅ Swan show/fade based strictly on the FASTER scroll step AND touching the water
    if (fastSwanProgress > 0 && isTouching) {
      if (animations.length > 0 && !hasStartedAnim.current) {
        const action = mixer.clipAction(animations[0]);
        action.reset().play();
        action.paused = true; 
        hasStartedAnim.current = true;
      }

      if (swanGroupRef.current) {
        swanGroupRef.current.visible = true;

        const baseX = worldPos.x - 0.2;
        const baseY = currentWaterY - 1.1;
        const baseZ = worldPos.z;

        const time = state.clock.getElapsedTime();

        const bobbing = isTouching ? Math.sin(time * 1.6) * 0.02 : 0;
        const sway = isTouching ? Math.sin(time * 1.1) * 0.015 : 0;
        const tiltX = isTouching ? Math.sin(time * 1.4) * 0.04 : 0; 
        const tiltZ = isTouching ? Math.cos(time * 1.1) * 0.05 : 0; 

        swanGroupRef.current.rotation.x = tiltX;
        swanGroupRef.current.rotation.z = tiltZ;

        swanGroupRef.current.position.set(baseX + sway, baseY + bobbing, baseZ);
        swanGroupRef.current.scale.setScalar(2.1);

        swanGroupRef.current.traverse((child: any) => {
          if (child.isMesh) {
            child.material.transparent = true;
            
            // 🔥 NEW MATH: Higher target opacity (0.8 instead of 0.25) so it stands out stronger
            child.material.opacity = THREE.MathUtils.lerp(0, 0.8, fastSwanProgress);
            
            // 🔥 MORE WHITE: Adds a white emissive glow so it stops looking grey in the dark water
            child.material.emissive = new THREE.Color("#ffffff");
            child.material.emissiveIntensity = 0.4;
            
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

    // ✅ Random Ripples Animation
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;

      const mat = ring.material as any;
      ring.position.set(worldPos.x, currentWaterY + 0.05, worldPos.z);

      if (isTouching) {
        ring.visible = true;

        const time = state.clock.getElapsedTime();
        const speed = 0.10;
        const randomOffset = ringSeeds[i];
        const t = ((time * speed) + i * 0.22 + randomOffset) % 1;

        // random ripple scaling
        const scale = THREE.MathUtils.lerp(0.3, 15, t);
        // slight random stretch
        const stretch = 1 + Math.sin(time * 0.8 + randomOffset) * 0.15;

        ring.scale.set(scale * stretch, scale, 1);
        const fade = 1.0 - t;

        const proximityFactor = 1 - THREE.MathUtils.smoothstep(verticalDist, -0.1, 0.5);

        mat.uniforms.uOpacity.value = fade * proximityFactor * 0.55;
      } else {
        ring.visible = false;
      }
    });

    materialRef.current.distortion = 0; 
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
          <primitive object={rippleMaterial.clone()} attach="material" />
        </mesh>
      ))}
    </>
  );
};

export default WaterSurface;