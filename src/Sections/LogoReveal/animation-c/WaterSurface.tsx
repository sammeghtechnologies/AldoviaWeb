import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
// @ts-ignore
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const WATER_LEVEL = 0.7;
const START_OFFSET = 5.0;
const RING_COUNT = 8;

export default function WaterSurface({
  fallProgress,
  swanProgress,
  id3Ref,
  surfaceOpacity = 1 
}: {
  fallProgress: number;
  swanProgress: number;
  id3Ref: any;
  surfaceOpacity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const swanGroupRef = useRef<THREE.Group>(null!);

  const { scene: swanScene, animations } = useGLTF("/models/swan.glb") as any;

  const ringSeeds = useMemo(() => Array.from({ length: RING_COUNT }).map(() => Math.random() * 10), []);

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
          float wave = sin(dist * 22.0 - uTime * 2.0) * 0.1;
          float wave2 = cos(dist * 12.0 - uTime * 1.2) * 0.1;
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
          float ring = smoothstep(0.50, 0.47, dist) - smoothstep(0.47, 0.44, dist);
          float fade = smoothstep(0.9, 0.2, dist);
          vec3 finalColor = mix(uDarkColor, uColor, ring);
          gl_FragColor = vec4(finalColor, ring * fade * uOpacity);
        }
      `,
    });
  }, []);

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
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.49, 0.59, 128, 4), []);

  useFrame((state, delta) => {
    mixer.update(delta);
    if (rippleMaterial) rippleMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (!materialRef.current || !meshRef.current) return;

    const targetY = THREE.MathUtils.lerp(WATER_LEVEL - START_OFFSET, WATER_LEVEL, fallProgress);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    const currentWaterY = meshRef.current.position.y;

    let hasTouched = false;
    let worldPos = new THREE.Vector3(0, 0, 0);

    if (id3Ref?.current) {
      id3Ref.current.getWorldPosition(worldPos);
      
      // ==========================================
      // MY OWN BULLETPROOF MATH
      // ==========================================
      // 1. worldPos.y <= 1.15 : The feather stops falling at exactly y = 1.05.
      // 2. fallProgress > 0.5 : PREVENTS THE START-UP BUG! If the user hasn't scrolled down, it forces hasTouched to FALSE regardless of the 3D coordinate.
      hasTouched = (worldPos.y <= 1.15) && (fallProgress > 0.5);
    }

    // --- 1. PERFECT MIRROR LOGIC ---
    // Perfect mirror (5.0) reflecting the feather. Only fades to Swan (0.0) AFTER it has touched.
    materialRef.current.mixStrength = hasTouched ? THREE.MathUtils.lerp(5.0, 0.0, swanProgress) : 5.0;
    materialRef.current.opacity = 0.15 * surfaceOpacity;
    materialRef.current.distortion = 0; 

    // --- 2. SWAN LOGIC (STRICTLY HIDDEN UNTIL TOUCHED) ---
    if (hasTouched && swanProgress > 0.01) {
      if (animations.length > 0 && !hasStartedAnim.current) {
        const action = mixer.clipAction(animations[0]);
        action.reset().play();
        action.time = 0.05; 
        action.paused = true; 
        hasStartedAnim.current = true;
      }

      if (swanGroupRef.current) {
        swanGroupRef.current.visible = true;
        const baseX = worldPos.x - -2;
        const baseY = currentWaterY - 2.0;
        const baseZ = worldPos.z - 1;

        const time = state.clock.getElapsedTime();
        const bobbing = Math.sin(time * 1.6) * 0.02;
        const sway = Math.sin(time * 1.1) * 0.015;
        const tiltX = Math.sin(time * 1.4) * 0.04; 
        const tiltZ = Math.cos(time * 1.1) * 0.05; 

        swanGroupRef.current.rotation.x = tiltX;
        swanGroupRef.current.rotation.z = tiltZ;
        swanGroupRef.current.position.set(baseX + sway, baseY + bobbing, baseZ);
        swanGroupRef.current.scale.setScalar(2.1); // Restore to full size

        swanGroupRef.current.traverse((child: any) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = THREE.MathUtils.lerp(0, 0.25, swanProgress) * surfaceOpacity;
            child.material.depthTest = false;
          }
        });
      }
    } else {
      // NUKE THE SWAN OUT OF EXISTENCE
      if (hasStartedAnim.current) {
        mixer.stopAllAction();
        hasStartedAnim.current = false;
      }
      if (swanGroupRef.current) {
         swanGroupRef.current.visible = false;
         swanGroupRef.current.scale.setScalar(0); // Physically shrink to 0
         swanGroupRef.current.traverse((child: any) => {
            if (child.isMesh && child.material) {
               child.material.opacity = 0; // Force opacity to 0
            }
         });
      }
    }

    // --- 3. RIPPLES LOGIC (STRICTLY HIDDEN UNTIL TOUCHED) ---
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const mat = ring.material as any;
      ring.position.set(worldPos.x + 1.8, currentWaterY + 0.05, worldPos.z + 8);

      if (hasTouched) {
        ring.visible = true;
        const time = state.clock.getElapsedTime();
        const speed = 0.10;
        const randomOffset = ringSeeds[i];
        const t = ((time * speed) + i * 0.22 + randomOffset) % 1;
        const scale = THREE.MathUtils.lerp(0.3, 15, t);
        const stretch = 1 + Math.sin(time * 0.8 + randomOffset) * 0.15;
        ring.scale.set(scale * stretch, scale, 1);
        const fade = 1.0 - t;
        mat.uniforms.uOpacity.value = fade * 0.55 * surfaceOpacity;
      } else {
        ring.visible = false;
        mat.uniforms.uOpacity.value = 0; // Force ripple visibility to 0
      }
    });
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL - START_OFFSET, 0]} visible={surfaceOpacity > 0.01}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          ref={materialRef}
          blur={[500, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5.0} 
          mirror={1}
          color="#0d0d0c"
          transparent
          opacity={0}
          depthScale={2.0}
          minDepthThreshold={0.1}
          maxDepthThreshold={1.5}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uFade = { value: 1.0 };
            shader.fragmentShader = `uniform float uFade;\n` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace(
              `gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );`,
              `gl_FragColor = vec4( blendOverlay( base.rgb, color ), uFade );`
            );
            materialRef.current.userData.shader = shader;
          }}
        />
      </mesh>
      
      {/* Set initial visible to false and scale to 0 */}
      <group ref={swanGroupRef} visible={false} scale={0} renderOrder={100}>
        <primitive object={swanModel} rotation={[Math.PI, Math.PI / -2, 0]} />
      </group>

      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh key={i} renderOrder={999} ref={(el) => (ringRefs.current[i] = el!)} rotation={[-Math.PI / 2, 0, 0]} geometry={ringGeo} visible={false}>
          <primitive object={rippleMaterial.clone()} attach="material" />
        </mesh>
      ))}
    </>
  );
}