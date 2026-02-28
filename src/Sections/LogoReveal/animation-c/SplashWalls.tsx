
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";



export const SplashWalls = ({ splashProgress, opacity }: { splashProgress: number, opacity: number }) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = 6;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const shaderRef = useRef<any>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const baseRadius = isMobile ? 4.5 : 6.4;

  useFrame(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const isInner = i >= 3;
      const layerIndex = i % 3;
      const delay = layerIndex * 0.12 + (isInner ? 0.08 : 0.0);
      const t = Math.max(0, splashProgress - delay);
      const duration = 1.0 - delay;

      if (t === 0 || t >= duration) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const activeT = t / duration;
      const heightCurve = Math.sin(activeT * Math.PI);
      let height = heightCurve * (6.5 + layerIndex * 2.5);
      let outwardExpansion = 1.0 + activeT * 0.35;

      if (isInner) {
        outwardExpansion *= 0.45;
        height *= 0.75;
      }

      const currentY = -14 + height / 2;
      dummy.position.set(0, currentY, 4);
      dummy.scale.set(outwardExpansion, height, outwardExpansion);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (shaderRef.current) shaderRef.current.uniforms.uProgress.value = splashProgress;
  });

  const onBeforeCompile = (shader: any) => {
    shaderRef.current = shader;
    shader.uniforms.uProgress = { value: 0.0 };

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `varying vec2 vMyUv; varying vec3 vPos; void main() { vMyUv = uv; vPos = position;`
    ).replace(
      `#include <begin_vertex>`,
      `vec3 transformed = vec3( position );
      float angle = atan(position.z, position.x);
      float flareCurve = pow(vMyUv.y, 3.0);
      float bendNoise = sin(angle * 4.0) * 0.5 + 0.5;
      float outwardPush = flareCurve * (2.0 + bendNoise * 3.0); 
      transformed.x += normal.x * outwardPush;
      transformed.z += normal.z * outwardPush;
      float heightNoise = sin(angle * 2.0) * 0.5 + sin(angle * 6.0) * 0.5;
      transformed.y += heightNoise * vMyUv.y * 1.5; `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `varying vec2 vMyUv; varying vec3 vPos; uniform float uProgress; void main() {`
    ).replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `vec4 diffuseColor = vec4( diffuse, opacity );
       float angle = atan(vPos.z, vPos.x);
       float wave1 = sin(angle * 3.0);
       float wave2 = sin(angle * 7.0);
       float combinedWaves = (wave1 * 0.7 + wave2 * 0.3) * 0.5 + 0.5;
       float lobes = pow(combinedWaves, 1.5);
       float edgeLimit = 0.20 + (0.55 * lobes);
       float bodyAlpha = smoothstep(edgeLimit + 0.15, edgeLimit - 0.05, vMyUv.y);
       float tearNoise = sin(angle * 15.0 + uProgress * 5.0) * cos(vMyUv.y * 15.0 - uProgress * 5.0);
       tearNoise = tearNoise * 0.5 + 0.5;
       float holes = smoothstep(0.7, 0.9, tearNoise); 
       float holeRims = smoothstep(0.6, 0.7, tearNoise) * smoothstep(0.9, 0.7, tearNoise);
       float beadNoise = sin(angle * 50.0 - uProgress * 20.0) * cos(vMyUv.y * 40.0 + uProgress * 10.0);
       beadNoise = smoothstep(0.85, 1.0, beadNoise * 0.5 + 0.5);
       float holeZone = smoothstep(0.1, edgeLimit - 0.05, vMyUv.y);
       bodyAlpha = max(0.0, bodyAlpha - (holes * holeZone));
       float wallDrops = (holeRims * 1.5 + beadNoise * 2.0) * holeZone;
       float heavyRim = smoothstep(edgeLimit - 0.10, edgeLimit, vMyUv.y) * smoothstep(edgeLimit + 0.10, edgeLimit, vMyUv.y);
       float dropZone = smoothstep(edgeLimit, edgeLimit + 0.12, vMyUv.y) * smoothstep(edgeLimit + 0.25, edgeLimit + 0.08, vMyUv.y);
       float dropNoise = sin(angle * 30.0) * 0.5 + 0.5; 
       float crownDrops = dropZone * smoothstep(0.4, 1.0, lobes) * smoothstep(0.4, 1.0, dropNoise); 
       float bottomAlpha = smoothstep(0.0, 0.1, vMyUv.y);
       float weightGradient = mix(1.0, 0.5, vMyUv.y);
       float finalAlpha = (max(0.0, bodyAlpha * 0.25) + (heavyRim * 2.0) + (crownDrops * 2.5) + wallDrops) * bottomAlpha * weightGradient;
       diffuseColor.rgb = vec3(1.0);
       diffuseColor.a *= finalAlpha;`
    );
  };

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} visible={opacity > 0}>
      <cylinderGeometry args={[baseRadius * 1.05, baseRadius, 1, 64, 12, true]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={opacity} roughness={0.05} clearcoat={1.0} clearcoatRoughness={0.0} side={THREE.DoubleSide} depthWrite={false} onBeforeCompile={onBeforeCompile} />
    </instancedMesh>
  );
};