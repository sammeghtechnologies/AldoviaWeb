import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const BurstParticles = ({ count = 70, radius, active }: { count?: number; radius: number; active: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      pos[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(theta);
      vel[i * 3] = pos[i * 3] * 0.5;
      vel[i * 3 + 1] = pos[i * 3 + 1] * 0.5;
      vel[i * 3 + 2] = pos[i * 3 + 2] * 0.5;
    }
    return [pos, vel];
  }, [count, radius]);

  useFrame((_state, delta) => {
    if (!active || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3] * delta * 40;
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * delta * 40;
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * delta * 40;
      velocities[i * 3] *= 0.88;
      velocities[i * 3 + 1] *= 0.88;
      velocities[i * 3 + 2] *= 0.88;
    }
    posAttr.needsUpdate = true;
    material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.1);
    material.size = THREE.MathUtils.lerp(material.size, 0, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#ffffff" transparent opacity={active ? 1 : 0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export default BurstParticles;