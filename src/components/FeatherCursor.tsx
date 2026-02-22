import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Mouse = { x: number; y: number };

function Model({ mouse }: { mouse: Mouse }) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF("./models/feather_2.glb");

  useFrame(() => {
    if (!group.current) return;

    // Direct position match (no smooth, no rotate)
    group.current.position.x = mouse.x;
    group.current.position.y = mouse.y;
  });

  return (
    <group ref={group} scale={0.1}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function FeatherCursor() {
  const [mouse, setMouse] = useState<Mouse>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      setMouse({
        x: x * 5,  // adjust if needed
        y: y * 3,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <Canvas
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      camera={{ position: [0, 0, 10] }}
    >
      <ambientLight intensity={2} />
      <Model mouse={mouse} />
    </Canvas>
  );
}

useGLTF.preload("./models/feather_2.glb");
