import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
// @ts-ignore
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const WATER_LEVEL = 0.95;
const START_OFFSET = 5.0;
const RING_COUNT = 10;
const MIRROR_SWAN_SCALE = 320;

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

  const { scene: swanScene, animations } = useGLTF("/models/Swan_anim_v13.glb") as any;

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
        uColor: { value: new THREE.Color("#9fb8c8") },
        uDarkColor: { value: new THREE.Color("#111a22") },
        uLightDir: { value: new THREE.Vector3(-0.35, 0.88, 0.42).normalize() },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        varying float vDist;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float dist = length(pos.xy);
          vDist = dist;

          // slower and smoother wave
          float wave = sin(dist * 22.0 - uTime * 2.0) * 0.13;
          // secondary ripple randomness
          float wave2 = cos(dist * 12.0 - uTime * 1.2) * 0.11;
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
        uniform vec3 uLightDir;

        varying vec2 vUv;
        varying float vWave;
        varying float vDist;

        void main() {
          float dist = distance(vUv, vec2(0.5));

          // ring thickness
          float ring = smoothstep(0.50, 0.47, dist) - smoothstep(0.47, 0.44, dist);
          // fade outer edge
          float fade = smoothstep(0.9, 0.2, dist);
          float ridge = smoothstep(0.515, 0.485, dist) - smoothstep(0.485, 0.435, dist);
          float crown = smoothstep(0.458, 0.445, dist) * (1.0 - smoothstep(0.445, 0.392, dist));
          float innerDepth = smoothstep(0.40, 0.0, dist);

          vec2 centered = vUv - vec2(0.5);
          vec3 pseudoNormal = normalize(vec3(centered * 4.2, 0.72 + vWave * 1.8));
          float diffuse = max(dot(pseudoNormal, normalize(uLightDir)), 0.0);
          float rim = pow(1.0 - clamp(abs(pseudoNormal.z), 0.0, 1.0), 2.35);

          vec3 waterDepthTint = mix(uDarkColor * 1.15, uColor, ring * 0.9) + vec3(0.02, 0.03, 0.05) * innerDepth;
          vec3 litColor = waterDepthTint * (0.5 + diffuse * 0.75) + vec3(0.85, 0.9, 0.95) * (rim * 0.2 + crown * 0.12);
          float alpha = (ring * 0.75 + ridge * 0.42 + crown * 0.16) * fade * uOpacity;

          gl_FragColor = vec4(litColor, alpha);
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

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.47, 0.53, 192, 12), []);

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

    const contactEase = THREE.MathUtils.smoothstep(fallProgress, 0.48, 0.72);
    const isTouching = verticalDist < 0.55 || contactEase > 0.3;

    const fastSwanProgress = Math.max(0, Math.min(1, (swanProgress - 0.1) * 5.0));

    materialRef.current.mixStrength = THREE.MathUtils.lerp(5.0, 0.0, fastSwanProgress);

    if (fastSwanProgress > 0 && isTouching) {
      if (animations.length > 0 && !hasStartedAnim.current) {
        const action = mixer.clipAction(animations[0]);
        action.reset().play();
        action.paused = true; 
        hasStartedAnim.current = true;
      }

      if (swanGroupRef.current) {
        swanGroupRef.current.visible = true;

        // 🔥 FIX: Set X and Z to exactly match worldPos without extra offsets!
        const baseX = worldPos.x;
        const baseY = currentWaterY - 0.8;
        const baseZ = worldPos.z;

        const time = state.clock.getElapsedTime();

        const bobbing = isTouching ? Math.sin(time * 1.6) * 0.02 : 0;
        const sway = isTouching ? Math.sin(time * 1.1) * 0.015 : 0;
        const tiltX = isTouching ? Math.sin(time * 1.4) * 0.04 : 0; 
        const tiltZ = isTouching ? Math.cos(time * 1.1) * 0.05 : 0; 

        swanGroupRef.current.rotation.x = tiltX;
        swanGroupRef.current.rotation.z = tiltZ;

        swanGroupRef.current.position.set(baseX + sway, baseY + bobbing, baseZ);
        swanGroupRef.current.scale.setScalar(MIRROR_SWAN_SCALE);

        swanGroupRef.current.traverse((child: any) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = THREE.MathUtils.lerp(0, 0.8, fastSwanProgress);
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

    materialRef.current.opacity = THREE.MathUtils.lerp(0.03, 0.18, contactEase);

    // ✅ Random Ripples Animation
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;

      const mat = ring.material as any;
      // 🔥 FIX: Removed the +5 on Z so the ripples perfectly wrap around the feather impact
      ring.position.set(worldPos.x, currentWaterY + 0.08, worldPos.z);

      if (isTouching || contactEase > 0.08) {
        ring.visible = true;

        const time = state.clock.getElapsedTime();
        const speed = THREE.MathUtils.lerp(0.06, 0.12, contactEase);
        const randomOffset = ringSeeds[i];
        const t = ((time * speed) + i * 0.22 + randomOffset) % 1;

        const scale = THREE.MathUtils.lerp(0.22, 14, t);
        const stretch = 1 + Math.sin(time * 0.8 + randomOffset) * 0.15;

        ring.scale.set(scale * stretch, scale, 1);
        const fade = 1.0 - t;

        const proximityFactor = 1 - THREE.MathUtils.smoothstep(verticalDist, -0.12, 0.75);
        const contactBoost = THREE.MathUtils.lerp(0.35, 1.0, contactEase);

        mat.uniforms.uOpacity.value = fade * proximityFactor * contactBoost * 0.52;
      } else {
        ring.visible = false;
      }
    });

    materialRef.current.distortion = THREE.MathUtils.lerp(0.05, 0.14, contactEase);
  });

  return (
    <>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, WATER_LEVEL - START_OFFSET, 3]}
      >
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          ref={materialRef}
          blur={[500, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5.0}
          mirror={1}
          color="#2f1a14"
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
