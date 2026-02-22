import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function LoaderModel() {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF("./models/feather_2.glb") as any;

  const angle = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;

    // Spin
    group.current.rotation.x += 0.03;

    // Small circular motion
    angle.current += delta;

    const radius = 0; // 🔥 small circle (adjust 0.3 - 0.8)

    group.current.position.x = Math.cos(angle.current) * radius;
    group.current.position.y = Math.sin(angle.current) * radius;
  });

  return (
    <group ref={group} scale={0.6}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function FeatherLoader() {
  return (
    <div
      style={{
     width:"100%",
        position: "fixed",
        inset: 0,
        background: "black",
        zIndex: 9999,
      }}
    >
      <Canvas camera={{ position: [15, 2, 8] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[2,2,2]} />
        <LoaderModel />Loading
      </Canvas>
    </div>
  );
}

useGLTF.preload("./models/feather_2.glb");
