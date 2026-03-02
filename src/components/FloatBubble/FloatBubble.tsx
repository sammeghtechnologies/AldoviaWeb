import * as THREE from "three";
import { useRef } from "react";
import { MeshTransmissionMaterial, Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type Props = {
  radius?: number;
  scale: number;
  isBurst?: boolean;
};

const FloatBubble = ({ radius = 2.0, scale = 0, isBurst = false }: Props) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isBurst ? 0 : scale;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.15)
      );
      meshRef.current.visible = meshRef.current.scale.x > 0.01;
    }
  });

  return (
    <group>
      {/* 🚀 FIXED: Removed map={null}. 
          Providing children creates a clean local environment automatically. */}
      <Environment>
        {/* These lights give the bubble its shape and iridescence 
            without showing the 'city' buildings. */}
        <Lightformer form="rect" intensity={8} position={[2, 5, 5]} scale={[10, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={4} position={[-5, 2, -1]} scale={[5, 5, 1]} target={[0, 0, 0]} />
      </Environment>

      <mesh ref={meshRef}> 
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshTransmissionMaterial
          /* --- THE LOOK --- */
          envMapIntensity={1} 
          transmission={1}
          thickness={0.1} 
          ior={1.2} 
          roughness={0.0} // 0 roughness makes the Lightformers look like crisp reflections
          chromaticAberration={0.05}
          
          /* --- IRIDESCENCE (The Rainbow) --- */
          iridescence={1} 
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 800]}
          
          /* --- Transparency & Depth --- */
          attenuationDistance={10}
          attenuationColor="#ffffff"
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default FloatBubble;