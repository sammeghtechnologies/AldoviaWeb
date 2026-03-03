import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

const WATER_LEVEL = 0; 
const START_OFFSET = 5.0;

const WaterSurface = ({ fallProgress, swanProgress, id3Ref }: any) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const ripplePlaneRef = useRef<THREE.Mesh>(null!);
  
  // 🚀 AUTOMATIC RIPPLE DRIVER
  const [clock] = useState(() => new THREE.Clock()); 
  
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
    
    // 🚀 THE MAGIC FIX: Injecting opacity support directly into the Three.js Reflector shader
    material.uniforms.globalOpacity = { value: 0.0 };
    material.fragmentShader = `
      uniform float globalOpacity;
      ${material.fragmentShader}
    `.replace(
      'gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',
      'gl_FragColor = vec4( blendOverlay( base.rgb, color ), globalOpacity );'
    );

    return refl;
  }, [geometry, isMobile]);

  // 🎨 YOUR EXACT SHADER LOGIC
  const rippleMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
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
        float freq = 45.0; 
        float speed = 25.0; 
        float phase = dist * freq - uTime * speed;
        float wave = sin(phase);
        float slope = cos(phase);
        vec2 dir = normalize(uv + vec2(0.0001));
        vec3 normal = normalize(vec3(dir * slope * 1.5, 1.0));
        vec3 lightDir = normalize(vec3(-1.0, 1.5, 1.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfVector = normalize(lightDir + viewDir);
        float diffuse = max(dot(normal, lightDir), 0.0);
        float specular = pow(max(dot(normal, halfVector), 0.0), 64.0);
        vec3 baseColor = vec3(0.01, 0.02, 0.03);
        vec3 highlight = vec3(0.8, 0.9, 1.0) * specular * 2.5;
        vec3 midtone = vec3(0.1, 0.2, 0.3) * diffuse * 0.5;
        vec3 finalColor = baseColor + midtone + highlight;
        float envelope = smoothstep(0.02, 0.1, dist) * smoothstep(1.0, 0.3, dist);
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
    
    // 🌊 FORCED FADE LOGIC
    const baseOpacity = THREE.MathUtils.smoothstep(fallProgress, 0.1, 0.5);
    
    // Starts fading the moment landing starts (0.01) and finishes halfway through (0.5)
    const fadeOutMultiplier = 1.0 - THREE.MathUtils.smoothstep(swanProgress, 0.05, 0.5);
    
    // 🚀 Apply fade to our injected custom uniform! The reflection MUST disappear now.
    if (material.uniforms.globalOpacity) {
        material.uniforms.globalOpacity.value = baseOpacity * fadeOutMultiplier;
    }

    if (material.uniforms.color) {
      const initialColor = new THREE.Color(0x080a0c);
      const black = new THREE.Color(0x000000);
      material.uniforms.color.value.lerpColors(
        initialColor, 
        black, 
        THREE.MathUtils.smoothstep(swanProgress, 0.05, 0.5)
      );
    }

    // 2. Ripple Sync
    if (id3Ref?.current && ripplePlaneRef.current) {
      const worldPos = new THREE.Vector3();
      id3Ref.current.getWorldPosition(worldPos);

      const tailX = worldPos.x + 2.8; 
      const tailZ = worldPos.z - 0.5;
      
      ripplePlaneRef.current.position.set(tailX - 5, reflector.position.y + 0.001, tailZ);

      // 🚀 Delay ripples until 0.05 so they don't fire while feather is still hovering
      if (swanProgress > 0.05) {
        ripplePlaneRef.current.visible = true;
        
        // 🚀 AUTOMATIC TIME (Uses clock instead of swanProgress)
        rippleMaterial.uniforms.uTime.value = clock.getElapsedTime();
        
        const fadeIn = THREE.MathUtils.smoothstep(swanProgress, 0.05, 0.15);
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