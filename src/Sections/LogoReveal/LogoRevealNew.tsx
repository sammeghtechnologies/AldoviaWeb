import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

gsap.registerPlugin(ScrollTrigger);
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

/* =========================================================
   💦 WATER WALLS (POSITIONED AT Y=-14 & SHIFTED FRONT)
========================================================= */
const SplashWalls = ({ splashProgress }: { splashProgress: number }) => {
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
      let outwardExpansion = 1.0 + (activeT * 0.35);

      if (isInner) {
        outwardExpansion *= 0.45; 
        height *= 0.75; 
      }

      const currentY = -14 + (height / 2); // Your updated water line

      dummy.position.set(0, currentY, 4); // Your updated shift
      dummy.scale.set(outwardExpansion, height, outwardExpansion);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (shaderRef.current) {
      shaderRef.current.uniforms.uProgress.value = splashProgress;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shaderRef.current = shader;
    shader.uniforms.uProgress = { value: 0.0 };

    shader.vertexShader = shader.vertexShader.replace(
      `void main() {`,
      `varying vec2 vMyUv;
       varying vec3 vPos;
       void main() {
         vMyUv = uv;
         vPos = position;
      `
    );
    
    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
      vec3 transformed = vec3( position );
      float angle = atan(position.z, position.x);
      float flareCurve = pow(vMyUv.y, 3.0);
      float bendNoise = sin(angle * 4.0) * 0.5 + 0.5;
      float outwardPush = flareCurve * (2.0 + bendNoise * 3.0); 
      transformed.x += normal.x * outwardPush;
      transformed.z += normal.z * outwardPush;
      float heightNoise = sin(angle * 2.0) * 0.5 + sin(angle * 6.0) * 0.5;
      transformed.y += heightNoise * vMyUv.y * 1.5; 
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `void main() {`,
      `varying vec2 vMyUv;
       varying vec3 vPos;
       uniform float uProgress; 
       void main() {
      `
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
       diffuseColor.a *= finalAlpha;
      `
    );
  };

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <cylinderGeometry args={[baseRadius * 1.05, baseRadius, 1, 64, 12, true]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent={true}
        opacity={1.0}
        roughness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        side={THREE.DoubleSide} 
        depthWrite={false}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
};

/* =========================================================
   🦢 SWAN (LOCKED AT Y=-14)
========================================================= */

const SwanModel = ({
  scrollProgress,
  transformProgress,
}: {
  scrollProgress: number;
  transformProgress: number;
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/Swan_anim_v11.glb");
  const { actions } = useAnimations(animations, group);

  useLayoutEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.4;
          child.material.metalness = 0.0;
          child.material.envMapIntensity = 1.5;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
    if (action) {
      action.play().paused = true;
    }
    return () => {
      if (action) action.stop();
    };
  }, [actions]);

  useEffect(() => {
    const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
    if (action && action.getClip()) {
      action.time = action.getClip().duration * scrollProgress;
    }
  }, [scrollProgress, actions]);

  const baseScale = isMobile ? 380 : 600;
  const currentScale = baseScale + transformProgress * (isMobile ? 250 : 400);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={currentScale}
      // ✅ POS: Submerged at -14
      position={[0, -14, 0]}
      rotation={[0.1, -Math.PI / 160, 0]}
    />
  );
};

/* =========================================================
   💦 SPLASH DROPLETS (Y=-14 & SHIFTED FRONT)
========================================================= */

const SplashDroplets = ({ splashProgress }: { splashProgress: number }) => {
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

      if (randSize > 0.90) {
        baseScale = 0.15 + Math.random() * 0.2; 
        evaporates = false;
        isStreakType = Math.random() > 0.3; 
      } else if (randSize > 0.60) {
        baseScale = 0.05 + Math.random() * 0.1; 
        evaporates = Math.random() > 0.5; 
        isStreakType = Math.random() > 0.1; 
      } else {
        baseScale = 0.01 + Math.random() * 0.04; 
        evaporates = true; 
        isStreakType = true; 
      }

      const drag = 0.92 + Math.random() * 0.05;

      temp.push({
        startX, startZ, vx, vy, vz, delay, baseScale, drag, isStreakType, evaporates,
      });
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
      const currentVy = p.vy - (90 * time);

      let currentX = p.startX + currentVx * time;
      // ✅ SHIFT FRONT: Added +4 to Z to match Walls
      let currentZ = p.startZ + currentVz * time + 4;
      // ✅ WATER LINE: Adjusted to -14
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
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={0.8} roughness={0.1} depthWrite={false} />
    </instancedMesh>
  );
};

/* =========================================================
   🌊 WATER PLANE
========================================================= */

const WaterPlane = ({ splashProgress }: { splashProgress: number }) => {
  const reflectorRef = useRef<any>(null);
  const timeRef = useRef(0);
  const geometry = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);

  const reflector = useMemo(() => {
    const refl = new Reflector(geometry, { 
        textureWidth: isMobile ? 1024 : 2048, 
        textureHeight: isMobile ? 1024 : 2048, 
        color: 0x808080 
    });
    refl.rotation.x = -Math.PI / 2;
    refl.position.y = -15;
    const material = refl.material as THREE.ShaderMaterial;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uTakeoff = { value: 0 }; 
      shader.fragmentShader = `uniform float uTime; uniform float uTakeoff;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `vec4 base = texture2DProj( tDiffuse, vUv );`,
        `
        float projectedY = vUv.y / vUv.w;
        float varRippleMask = smoothstep(0.65, 0.40, projectedY);
        vec2 baseUV = vUv.xy / vUv.w - 0.5;
        vec2 perspectiveUV = vec2(baseUV.x - 0.0, (baseUV.y - (-0.15)) * 3.5);
        float distCenter = length(perspectiveUV);
        float wakePower = smoothstep(0.0, 0.3, uTakeoff) * (1.0 - smoothstep(0.5, 1.0, uTakeoff));
        vec2 wakeUV = perspectiveUV - vec2(0.0, uTakeoff * 0.2); 
        float wakeDist = length(wakeUV);
        float turbulence = (sin(wakeUV.x * 150.0 + uTime * 20.0) * cos(wakeUV.y * 150.0 - uTime * 15.0)) * wakePower;
        float wakeMask = 1.0 - smoothstep(0.0, 0.4 + (uTakeoff * 0.5), wakeDist);
        float ambientRipple = sin(baseUV.x * 120.0 + uTime * 1.0) * cos(baseUV.y * 120.0 + uTime * 1.0);
        float rippleStrength = mix(0.0005, 0.003, varRippleMask) * (1.0 - wakePower);
        float ringPhase = distCenter * 70.0 - uTime * 1.2;
        float ringFade = smoothstep(0.0, 0.02, distCenter) * (1.0 - smoothstep(0.05, 0.20, distCenter)) * (1.0 - wakePower); 
        vec2 waveDistortion = normalize(perspectiveUV) * cos(ringPhase) * 0.0015 * ringFade;
        vec2 wakeDistortion = normalize(wakeUV) * (turbulence * wakeMask) * 0.03; 
        vec2 totalDistortion = vec2(ambientRipple * rippleStrength) + waveDistortion + wakeDistortion;

        vec4 base = texture2DProj(tDiffuse, vec4(vUv.xy + (totalDistortion * vUv.w), vUv.zw));
        `
      );
      reflectorRef.current = { userData: { shader } };
    };
    return refl;
  }, [geometry]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (reflectorRef.current?.userData.shader) {
      reflectorRef.current.userData.shader.uniforms.uTime.value = timeRef.current;
      reflectorRef.current.userData.shader.uniforms.uTakeoff.value = splashProgress;
    }
  });

  return <primitive object={reflector} />;
};

/* =========================================================
   🎬 MAIN SCROLL SECTION (LOGO SMALLER)
========================================================= */

const LogoRevealNew = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null!);

  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transformProgress, setTransformProgress] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);

  useGSAP(
    () => {
      if (!isReady || !logoRef.current) return;

      const totalScroll = 8000;
      const moveStart = 0.3;
      const swanAnimationStart = 0.4;
      const swanCenterEnd = 0.55;
      const splashStart = 0.85; 
      const splashEnd = 0.95;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=" + totalScroll,
          pin: true,
          scrub: 1.5,
          onUpdate: (self) => {
            const rawProgress = self.progress;
            if (rawProgress < swanAnimationStart) {
              setScrollProgress(0);
            } else {
              setScrollProgress((rawProgress - swanAnimationStart) / (1 - swanAnimationStart));
            }
            if (rawProgress < swanAnimationStart) {
              setTransformProgress(0);
            } else if (rawProgress > swanCenterEnd) {
              setTransformProgress(1);
            } else {
              setTransformProgress((rawProgress - swanAnimationStart) / (swanCenterEnd - swanAnimationStart));
            }
            if (rawProgress < splashStart) {
              setSplashProgress(0);
            } else if (rawProgress > splashEnd) {
              setSplashProgress(1);
            } else {
              setSplashProgress((rawProgress - splashStart) / (splashEnd - splashStart));
            }
          },
          onLeave: () => onComplete?.(),
        },
      });
      const centerLogoWidth = isMobile ? "280px" : "420px";

     gsap.set(logoRef.current, { autoAlpha: 1, scale: 0.8, top: "50%", left: "50%", xPercent: -50, yPercent: -50, filter: "blur(60px)", width: centerLogoWidth });

      masterTl.set(canvasWrapperRef.current, { opacity: 1, filter: "blur(120px)" }, 0);
      masterTl.to(logoRef.current, { scale: 1, filter: "blur(0px)", duration: 0.25 }, 0);

      masterTl.to(logoRef.current, {
        top: "37px",
        left: "48px",
        xPercent: 0,
        yPercent: 0,
        width: "56px",
        duration: 0.1,
        ease: "power2.inOut",
      }, moveStart);

      masterTl.to(canvasWrapperRef.current, { filter: "blur(0px)", duration: 0.1 }, moveStart);
      masterTl.to({}, { duration: 0.6 }, swanAnimationStart);
    },
    { dependencies: [isReady], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={logoRef} className="absolute z-[9999] pointer-events-none" style={{ opacity: 1 }}>
        <img src="assets/logo/aldovialogo.svg" alt="Logo" className="w-full h-auto brightness-0 invert" />
      </div>

      <div ref={canvasWrapperRef} className="absolute inset-0 z-10" style={{ opacity: 1 }}>
        <Canvas
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}
          onCreated={() => setIsReady(true)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={40} />
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} />

          <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={isMobile ? 65 : 40} />

          <Suspense fallback={null}>
            <SwanModel scrollProgress={scrollProgress} transformProgress={transformProgress} />
            <WaterPlane splashProgress={splashProgress} />
            <SplashDroplets splashProgress={splashProgress} />
            <SplashWalls splashProgress={splashProgress} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ height: "600vh" }} />
    </section>
  );
};

useGLTF.preload("/models/Swan_anim_v11.glb");

export default LogoRevealNew;