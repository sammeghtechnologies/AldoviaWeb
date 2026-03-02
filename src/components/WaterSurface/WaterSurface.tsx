import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

const WATER_LEVEL = 0; 
const START_OFFSET = 5.0;

const WaterSurface = ({ fallProgress, swanProgress, id3Ref }: any) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const ripplePlaneRef = useRef<THREE.Mesh>(null!);
  
  const geometry = useMemo(() => new THREE.PlaneGeometry(500, 500), []);

  const reflector = useMemo(() => {
    const refl = new Reflector(geometry, {
      textureWidth: isMobile ? 1024 : 2048,
      textureHeight: isMobile ? 1024 : 2048,
      color: 0x080a0c, 
    });

    refl.rotation.x = -Math.PI / 2;
    refl.position.y = WATER_LEVEL - START_OFFSET;

    const material = refl.material as THREE.ShaderMaterial;
    material.transparent = true;
    material.opacity = 0; 

    return refl;
  }, [geometry, isMobile]);

  // 🚀 THE NEW TRUE 3D RIPPLE SHADER
  const rippleMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    uniforms: { 
      uTime: { value: 0 }, 
      uOpacity: { value: 0 } 
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv - 0.5;
        float dist = length(uv) * 2.0; 

        // 1. Math for the wave
        float freq = 45.0; // Tighter rings
        float speed = 25.0; // Speed of expansion
        float phase = dist * freq - uTime * speed;
        
        float wave = sin(phase);
        float slope = cos(phase); // The mathematical derivative gives us the 3D slope

        // 2. Fake 3D Normal Mapping
        // We tilt a fake 3D normal vector outward from the center based on the slope
        vec2 dir = normalize(uv + vec2(0.0001)); // Prevent divide by zero
        vec3 normal = normalize(vec3(dir * slope * 1.5, 1.0)); // 1.5 determines the "depth" of the 3D bump

        // 3. Virtual Lighting Setup
        vec3 lightDir = normalize(vec3(-1.0, 1.5, 1.0)); // Light coming from top-left
        vec3 viewDir = vec3(0.0, 0.0, 1.0); // Looking straight down
        vec3 halfVector = normalize(lightDir + viewDir);

        // 4. Calculate 3D Light Bounces
        float diffuse = max(dot(normal, lightDir), 0.0);
        float specular = pow(max(dot(normal, halfVector), 0.0), 64.0); // 64 = Extremely shiny, glossy water

        // 5. Colors (Dark liquid + Icy Blue/White Highlights like your reference)
        vec3 baseColor = vec3(0.01, 0.02, 0.03); // Almost pitch black water
        vec3 highlight = vec3(0.8, 0.9, 1.0) * specular * 2.5; // Bright glossy ring
        vec3 midtone = vec3(0.1, 0.2, 0.3) * diffuse * 0.5; // Subtle blue transition
        
        vec3 finalColor = baseColor + midtone + highlight;

        // 6. Masking out the edges
        float envelope = smoothstep(0.02, 0.1, dist) * smoothstep(1.0, 0.3, dist);

        // Alpha: Make flat water invisible, but keep the 3D bumps and highlights fully visible
        float alpha = (abs(slope) * 0.4 + specular * 1.2) * envelope;

        gl_FragColor = vec4(finalColor, alpha * uOpacity);
      }
    `,
  }), []);

  const rippleGeo = useMemo(() => new THREE.PlaneGeometry(30, 30), []);

  useFrame(() => {
    if (!reflector) return;

    const targetY = THREE.MathUtils.lerp(WATER_LEVEL - START_OFFSET, WATER_LEVEL, fallProgress);
    reflector.position.y = THREE.MathUtils.lerp(reflector.position.y, targetY, 0.1);

    const material = reflector.material as THREE.ShaderMaterial;
    
    const baseOpacity = THREE.MathUtils.smoothstep(fallProgress, 0.1, 0.5);
    const fadeOutMultiplier = 1.0 - THREE.MathUtils.smoothstep(swanProgress, 0.26, 0.60);
    
    material.opacity = baseOpacity * fadeOutMultiplier;

    if (id3Ref?.current && ripplePlaneRef.current) {
      const worldPos = new THREE.Vector3();
      id3Ref.current.getWorldPosition(worldPos);

      const tailX = worldPos.x + 2.8; 
      const tailZ = worldPos.z - 0.5;
      
      ripplePlaneRef.current.position.set(tailX-5, reflector.position.y + 0.001, tailZ);

      // Now triggers perfectly in sync because we delayed landStart in MainCanvas
      if (swanProgress > 0.01) {
        ripplePlaneRef.current.visible = true;
        rippleMaterial.uniforms.uTime.value = swanProgress;
        
        const fadeIn = THREE.MathUtils.smoothstep(swanProgress, 0.01, 0.1);
        rippleMaterial.uniforms.uOpacity.value = fadeIn * fadeOutMultiplier * 1.5;
      } else {
        ripplePlaneRef.current.visible = false;
        rippleMaterial.uniforms.uOpacity.value = 0;
      }
    }
  });

  return (
    <>
      <primitive object={reflector} />
      
      <mesh 
        ref={ripplePlaneRef} 
        geometry={rippleGeo} 
        material={rippleMaterial} 
        rotation={[-Math.PI / 2, 0, 0]} 
        renderOrder={99} 
        visible={false}
      />
    </>
  );
};

export default WaterSurface;