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
      color: 0x0a0a0a, // Removed the subtle blue tint
    });

    refl.rotation.x = -Math.PI / 2;
    refl.position.y = WATER_LEVEL - START_OFFSET;

    const material = refl.material as THREE.ShaderMaterial;
    material.transparent = true;
    
    // 🚀 Inject our Uniforms
    material.uniforms.globalOpacity = { value: 0.0 };
    material.uniforms.uTime = { value: 0.0 };
    material.uniforms.uReflectionIntensity = { value: 0.0 }; 

    // 🌟 1. Grab World Position in the Vertex Shader
    material.vertexShader = `
      varying vec3 vWorldPos;
      ${material.vertexShader}
    `.replace(
      'void main() {',
      `void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      `
    );

    // 🌟 2. Add the Masked Moonlight Shimmer in the Fragment Shader
    material.fragmentShader = `
      uniform float globalOpacity;
      uniform float uTime;
      uniform float uReflectionIntensity; 
      varying vec3 vWorldPos;
      ${material.fragmentShader}
    `.replace(
      'gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',
      `
      // 1. Get the standard fully-opaque reflection
      vec3 fullReflection = blendOverlay( base.rgb, color );
      
      // 2. Mix it with the base water color depending on our intensity
      vec3 finalBase = mix(color, fullReflection, uReflectionIntensity);
      
      // --- 🌙 LOCALIZED MOONLIGHT LOGIC ---
      
      vec2 spotlightOffset = vec2(2.5, 0.0); 
      float dist = length(vWorldPos.xz - spotlightOffset);
      float centerMask = smoothstep(12.0, 0.0, dist); 
      
      vec3 lightDir = normalize(vec3(0.0, 1.5, 1.0)); 
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 halfVector = normalize(lightDir + viewDir);
      
      vec3 normal = vec3(0.0, 1.0, 0.0);
      vec2 p = vWorldPos.xz * 0.5;
      float wave1 = sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 - uTime * 0.8);
      float wave2 = sin(p.x * 3.0 - uTime * 1.2) * cos(p.y * 3.0 + uTime);
      
      normal.x += (wave1 + wave2) * 0.1;
      normal.z += (wave1 - wave2) * 0.1;
      normal = normalize(normal);
      
      float specular = pow(max(dot(normal, halfVector), 0.0), 32.0);
      float softBaseGlow = 0.04; 
      
      vec3 moonGlow = vec3(1.0, 1.0, 1.0); 
      vec3 addedLight = moonGlow * (specular * 1.5 + softBaseGlow) * centerMask;
      
      // Add the moonlight to our dynamically faded base
      vec3 finalColor = finalBase + addedLight;
      
      gl_FragColor = vec4( finalColor, globalOpacity );
      `
    );
    return refl;
  }, [geometry, isMobile]);

  // 🎨 YOUR EXACT RIPPLE SHADER LOGIC
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
        float speed = 10.0; 
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
        
        vec3 baseColor = vec3(0.03, 0.025, 0.02); 
        vec3 highlight = vec3(1.0, 0.96, 0.85) * specular * 2.5; 
        vec3 midtone = vec3(0.4, 0.35, 0.25) * diffuse * 0.5; 
        
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

    const time = clock.getElapsedTime();

    const targetY = THREE.MathUtils.lerp(WATER_LEVEL - START_OFFSET, WATER_LEVEL, fallProgress);
    reflector.position.y = THREE.MathUtils.lerp(reflector.position.y, targetY, 0.1);

    const material = reflector.material as THREE.ShaderMaterial;
    
    // 1. BRING BACK THE FADE OUT MULTIPLIER
    const baseOpacity = THREE.MathUtils.smoothstep(fallProgress, 0.1, 0.5);
    const fadeOutMultiplier = 1.0 - THREE.MathUtils.smoothstep(swanProgress, 0.05, 0.5);
    
    // 2. APPLY IT ONLY TO THE WATER SO THE SWAN CAN APPEAR
    if (material.uniforms.globalOpacity) {
        material.uniforms.globalOpacity.value = baseOpacity * fadeOutMultiplier;
    }

    if (material.uniforms.uTime) {
        material.uniforms.uTime.value = time;
    }

    if (material.uniforms.color) {
      const initialColor = new THREE.Color(0x0a0a0a); 
      const black = new THREE.Color(0x000000);
      material.uniforms.color.value.lerpColors(
        initialColor, 
        black, 
        THREE.MathUtils.smoothstep(swanProgress, 0.05, 0.5)
      );
    }

    // --- 🌟 DYNAMIC HEIGHT CALCULATOR ---
    if (id3Ref?.current) {
      const worldPos = new THREE.Vector3();
      id3Ref.current.getWorldPosition(worldPos);

      const heightFromWater = Math.max(0, worldPos.y - reflector.position.y);
      const intensity = 1.0 - THREE.MathUtils.clamp(heightFromWater / 8.0, 0.0, 1.0);
      
      const rippleFadeIn = THREE.MathUtils.smoothstep(swanProgress, 0.00, 0.15);
      const featherFadeOut = 1.0 - THREE.MathUtils.smoothstep(swanProgress, 0.0, 0.1);

      if (material.uniforms.uReflectionIntensity) {
         const featherRefl = Math.pow(intensity, 3.0) * 0.3 * featherFadeOut;
         const swanRefl = 0.06 * rippleFadeIn; 
         material.uniforms.uReflectionIntensity.value = featherRefl + swanRefl;      
      }

      // 2. Ripple Sync
      if (ripplePlaneRef.current) {
        const tailX = worldPos.x + 2.8; 
        const tailZ = worldPos.z - 0.5;
        
        ripplePlaneRef.current.position.set(tailX - 5, reflector.position.y + 0.001, tailZ);

        if (swanProgress > 0.00) {
          ripplePlaneRef.current.visible = true;
          rippleMaterial.uniforms.uTime.value = time;
          
          // 3. KEEP RIPPLES ALIVE (Notice fadeOutMultiplier is NOT here)
          rippleMaterial.uniforms.uOpacity.value = rippleFadeIn * 1.5;
        } else {
          ripplePlaneRef.current.visible = false;
          rippleMaterial.uniforms.uOpacity.value = 0;
        }
      }

      // --- 🦢 SWAN BOBBING EFFECT ---
      if (swanProgress > 0.1) {
        const bobSpeed = 2.0; 
        const bobHeight = 0.015; 
        const pitchAmount = 0.01; 

        const currentBob = Math.sin(time * bobSpeed) * bobHeight;
        const currentPitch = Math.cos(time * bobSpeed) * pitchAmount;

        const lastBob = id3Ref.current.userData.lastBob || 0;
        const lastPitch = id3Ref.current.userData.lastPitch || 0;

        id3Ref.current.position.y += (currentBob - lastBob);
        id3Ref.current.rotation.x += (currentPitch - lastPitch); 

        id3Ref.current.userData.lastBob = currentBob;
        id3Ref.current.userData.lastPitch = currentPitch;
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