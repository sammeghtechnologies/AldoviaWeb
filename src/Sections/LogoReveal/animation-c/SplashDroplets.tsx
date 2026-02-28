
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


export const SplashDroplets = ({ splashProgress, opacity }: { splashProgress: number, opacity: number }) => {
  const count = 3000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const upVector = new THREE.Vector3(0, 1, 0);
  const spawnRadius = 12.0;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 0.45;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * spawnRadius;
      const startX = Math.cos(angle) * r;
      const startZ = Math.sin(angle) * r;
      const isWide = Math.random() > 0.75;
      let vx, vy, vz;
      if (isWide) {
        const isLeft = Math.random() > 0.5;
        const widePush = 35 + Math.random() * 55;
        vx = isLeft ? -widePush : widePush;
        vz = (Math.random() - 0.5) * 15.0;
        vy = 40 + Math.random() * 50;
      } else {
        const outwardPush = 5 + Math.random() * 15;
        vx = Math.cos(angle) * outwardPush;
        vz = Math.sin(angle) * outwardPush;
        vy = 30 + Math.random() * 60;
      }
      let baseScale;
      let evaporates;
      let isStreakType;
      const randSize = Math.random();
      if (randSize > 0.9) { baseScale = 0.15 + Math.random() * 0.2; evaporates = false; isStreakType = Math.random() > 0.3; }
      else if (randSize > 0.6) { baseScale = 0.05 + Math.random() * 0.1; evaporates = Math.random() > 0.5; isStreakType = Math.random() > 0.1; }
      else { baseScale = 0.01 + Math.random() * 0.04; evaporates = true; isStreakType = true; }
      const drag = 0.92 + Math.random() * 0.05;
      temp.push({ startX, startZ, vx, vy, vz, delay, baseScale, drag, isStreakType, evaporates });
    }
    return temp;
  }, [count, spawnRadius]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      const t = Math.max(0, splashProgress - p.delay);
      if (t === 0) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        return;
      }
      const time = t * 2.5;
      const currentVx = p.vx * Math.pow(p.drag, time * 10);
      const currentVz = p.vz * Math.pow(p.drag, time * 10);
      const currentVy = p.vy - 90 * time;

      let currentX = p.startX + currentVx * time;
      let currentZ = p.startZ + currentVz * time + 4;
      let currentY = -14 + p.vy * time - 0.5 * 90 * time * time;

      const speed = Math.sqrt(currentVx * currentVx + currentVy * currentVy + currentVz * currentVz);
      let stretch = p.isStreakType ? Math.max(1.0, speed * 0.04) : 0.9 + Math.random() * 0.2;
      let scale = p.baseScale;
      if (currentY <= -14) scale = 0;
      else scale *= p.evaporates ? Math.max(0, 1.0 - time * 1.5) : Math.max(0, 1.0 - time * 0.2);

      dummy.position.set(currentX, currentY, currentZ);
      dummy.scale.set(scale, scale * stretch, scale);

      const velocityDir = new THREE.Vector3(currentVx, currentVy, currentVz).normalize();
      if (velocityDir.lengthSq() > 0.0001) dummy.quaternion.setFromUnitVectors(upVector, velocityDir);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} visible={opacity > 0}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={opacity * 0.8} roughness={0.1} depthWrite={false} />
    </instancedMesh>
  );
};