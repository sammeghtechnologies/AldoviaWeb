import * as THREE from "three";
import { useRef } from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
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
    <mesh ref={meshRef}> 
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshTransmissionMaterial
        /* --- Core Transparency --- */
        transmission={1}
        thickness={0.2} // Thinner shell looks more like a real bubble
        ior={1.1} // Lower IOR for a lighter, more hollow feel
        roughness={0}
        chromaticAberration={0.15} // Increased for "prism" colors on the edges
        anisotropy={0.1}
        
        /* --- RAINBOW / IRIDESCENCE EFFECT --- */
        iridescence={1} // The main "oily" rainbow intensity
        iridescenceIOR={1.5} // Refraction of the thin film layer
        iridescenceThicknessRange={[100, 400]} // Range of the rainbow spectrum
        
        /* --- Finishing Touches --- */
        clearcoat={1}
        clearcoatRoughness={0}
        distortion={0.1} // Subtle distortion to make rainbow patterns move naturally
        distortionScale={0.5}
        temporalDistortion={0.1}
        
        attenuationDistance={10}
        attenuationColor="#ffffff"
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

export default FloatBubble;