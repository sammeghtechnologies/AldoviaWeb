import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import {
  Suspense,
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

gsap.registerPlugin(ScrollTrigger);
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;



/* =========================================================
   💦 WATER WALLS
========================================================= */

export const SplashWalls = ({ splashProgress, opacity = 1 }: { splashProgress: number, opacity?: number }) => {
  const count = 6;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const shaderRef = useRef<any>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const baseRadius = isMobile ? 4.5 : 6.4;

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      const isInner = i >= 3;
      const layerIndex = i % 3;
      const delay = layerIndex * 0.12 + (isInner ? 0.08 : 0.0);
      const t = Math.max(0, splashProgress - delay);
      const duration = 1.0 - delay;

      // FINISH EARLY: Multiplying by 1.4 makes it complete the lifecycle faster
      const activeT = (t / duration) * 1.4;

      if (t === 0 || activeT >= 1.0) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Exact original height curve (naturally scales to 0 at the end of the sine wave)
      const heightCurve = Math.sin(activeT * Math.PI);
      let height = heightCurve * (6.5 + layerIndex * 2.5);

      let outwardExpansion = 1.0 + activeT * 0.35;

      if (activeT > 0.4) {
        const flareProgress = (activeT - 0.4) / 0.6;
        outwardExpansion += Math.pow(flareProgress, 1.5) * 0.6;
      }

      if (isInner) {
        outwardExpansion *= 0.45;
        height *= 0.75;
      }

      const currentY = -14 + height / 2;

      dummy.position.set(0, currentY, 4);
      dummy.scale.set(outwardExpansion, height, outwardExpansion);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (shaderRef.current) {
      shaderRef.current.uniforms.uProgress.value = Math.min(1.0, splashProgress * 1.4);
    }
  });

  const onBeforeCompile = (shader: any) => {
    // EXACT ORIGINAL SHADER. NO CUSTOM FADE HACKS.
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

    shader.fragmentShader = shader.fragmentShader
      .replace(
        `void main() {`,
        `varying vec2 vMyUv;
         varying vec3 vPos;
         uniform float uProgress; 
         void main() {
      `
      )
      .replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `vec4 diffuseColor = vec4( diffuse, opacity );
       float angle = atan(vPos.z, vPos.x);
       
       float holeBucket = fract(sin(floor(angle * 8.0) * 12.9898) * 43758.5453);
       
       float tearNoise = sin(angle * 15.0 + uProgress * 5.0) * cos(vMyUv.y * 15.0 - uProgress * 5.0);
       tearNoise = tearNoise * 0.5 + 0.5;

       float holes = 0.0;
       float holeRims = 0.0;
       float rimWidth = 0.04; 

       if (holeBucket < 0.3) {
         float dynThreshold = mix(0.95, 0.45, uProgress);
         holes = smoothstep(dynThreshold, dynThreshold + 0.1, tearNoise);
         holeRims = smoothstep(dynThreshold - rimWidth, dynThreshold, tearNoise) * smoothstep(dynThreshold + 0.1, dynThreshold + 0.1 - rimWidth, tearNoise);
       } 
       else if (holeBucket < 0.4) {
         float staticThreshold = 0.72;
         holes = smoothstep(staticThreshold, staticThreshold + 0.1, tearNoise);
         holeRims = smoothstep(staticThreshold - rimWidth, staticThreshold, tearNoise) * smoothstep(staticThreshold + 0.1, staticThreshold + 0.1 - rimWidth, tearNoise);
       }

       float wave1 = sin(angle * 3.0);
       float wave2 = sin(angle * 7.0);
       float combinedWaves = (wave1 * 0.7 + wave2 * 0.3) * 0.5 + 0.5;
       float lobes = pow(combinedWaves, 1.5);
       float edgeLimit = 0.20 + (0.55 * lobes);
       float bodyAlpha = smoothstep(edgeLimit + 0.15, edgeLimit - 0.05, vMyUv.y);

       float beadNoise = sin(angle * 50.0 - uProgress * 20.0) * cos(vMyUv.y * 40.0 + uProgress * 10.0);
       beadNoise = smoothstep(0.85, 1.0, beadNoise * 0.5 + 0.5);
       float holeZone = smoothstep(0.1, edgeLimit - 0.05, vMyUv.y);
       
       bodyAlpha = max(0.0, bodyAlpha - (holes * holeZone));
       
       float wallDrops = (holeRims * 1.8 + beadNoise * 2.2) * holeZone;
       float heavyRim = smoothstep(edgeLimit - 0.08, edgeLimit, vMyUv.y) * smoothstep(edgeLimit + 0.08, edgeLimit, vMyUv.y);
       
       float dropZone = smoothstep(edgeLimit, edgeLimit + 0.12, vMyUv.y) * smoothstep(edgeLimit + 0.25, edgeLimit + 0.08, vMyUv.y);
       float dropNoise = sin(angle * 30.0) * 0.5 + 0.5; 
       float crownDrops = dropZone * smoothstep(0.4, 1.0, lobes) * smoothstep(0.4, 1.0, dropNoise); 
       
       float bottomAlpha = smoothstep(0.0, 0.1, vMyUv.y);
       float weightGradient = mix(1.0, 0.5, vMyUv.y);
       float finalAlpha = (max(0.0, bodyAlpha * 0.25) + (heavyRim * 2.0) + (crownDrops * 2.5) + wallDrops) * bottomAlpha * weightGradient;
       
       // ---- Physically-believable water shading (not glowing paint) ----
       float v = clamp(vMyUv.y, 0.0, 1.0);

       // Inner water is slightly darker; brighten only toward thinner top edges.
       vec3 innerWater = vec3(0.75, 0.82, 0.90);
       vec3 thinWater = vec3(0.86, 0.91, 0.98);
       vec3 waterBody = mix(innerWater, thinWater, smoothstep(0.10, 0.92, v));

       // Depth shading: thicker base reads darker (more volume).
       float baseDepth = 1.0 - smoothstep(0.00, 0.28, v);
       waterBody *= 1.0 - baseDepth * 0.22;

       // Foam + highlights only at rim/crown/droplets.
       vec3 foamColor = vec3(1.3, 1.35, 1.4);
       float rimFoam = smoothstep(edgeLimit - 0.01, edgeLimit + 0.09, vMyUv.y);
       float foamMask = clamp(rimFoam * 0.85 + heavyRim * 0.35 + crownDrops * 0.55 + holeRims * 0.25, 0.0, 1.0);

       // Subtle moving shimmer (small specular sparkles), localized to foam/droplet zones.
       float cellA = floor(angle * 14.0);
       float cellV = floor(v * 10.0);
       float rand = fract(sin((cellA + cellV * 17.0) * 12.9898) * 43758.5453);
       float shimmerWave = sin(angle * (14.0 + rand * 8.0) + uProgress * (10.0 + rand * 16.0) + v * 7.0);
       float shimmer = smoothstep(0.92, 1.0, shimmerWave * 0.5 + 0.5);
       float sparkleZone = clamp((holeRims * 0.8 + crownDrops * 0.9 + beadNoise * 0.25) * rimFoam, 0.0, 1.0);
       float sparkle = shimmer * sparkleZone * (0.10 + 0.20 * rand);

       vec3 highlight = foamColor * (foamMask * 0.35 + sparkle * 0.55);
       diffuseColor.rgb = waterBody + highlight;
       
       // Transparency: thinner top is more translucent; overall stays water-like (not opaque).
       float topThin = smoothstep(edgeLimit - 0.02, edgeLimit + 0.12, vMyUv.y);
       finalAlpha *= mix(0.92, 0.68, topThin);
       finalAlpha *= 1.35;
       diffuseColor.a *= clamp(finalAlpha, 0.0, 1.0);
       float visFloor = clamp(foamMask * 0.10 + sparkle * 0.06, 0.0, 0.18);
       diffuseColor.a = max(diffuseColor.a, visFloor);
      `
      );
  };

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[baseRadius * 1.05, baseRadius, 1, 64, 12, true]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.95}
        thickness={1.4}
        ior={1.33}
        roughness={0.34}
        metalness={0.0}
        clearcoat={1}
        clearcoatRoughness={0.03}
        envMapIntensity={1.6}
        attenuationColor="#e6f0ff"
        attenuationDistance={1.1}
        transparent={true}
        opacity={opacity}
        depthWrite={true}
        depthTest={true}
        side={THREE.DoubleSide}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
};



/* =========================================================
   🦢 SWAN (INTERACTIVE + CAMERA TRACKING)
========================================================= */
// export const SwanModel = ({
//   scrollProgress,
//   opacity = 1,
//   isReflection = false,
//   clipY,
//   transformProgress,
// }: {
//   scrollProgress: number;
//   opacity?: number;
//   isReflection?: boolean;
//   clipY?: number;
//   transformProgress: number;
// }) => {
//   const group = useRef<THREE.Group>(null);
//   const { scene, animations } = useGLTF("/models/Swan_anim_v16.glb");
//   const { actions } = useAnimations(animations, group);

//   // --- DRAG INTERACTION STATE ---
//   const isDragging = useRef(false);
//   const previousX = useRef(0);
//   const previousY = useRef(0); // Tracks vertical mouse position
//   const targetCamY = useRef(0); // Tracks desired camera height
//   const [targetRotY, setTargetRotY] = useState(-Math.PI / 160);

//   const clipPlane = useMemo(() => {
//     if (clipY !== undefined) {
//       return new THREE.Plane(new THREE.Vector3(0, -1, 0), clipY);
//     }
//     return null;
//   }, [clipY]);

//   const materialsRef = useRef<THREE.Material[]>([]);

//   useLayoutEffect(() => {
//     materialsRef.current = []; // Clear array on mount
//     scene.traverse((child: any) => {

//       if (child.isMesh) {

//         child.geometry.computeVertexNormals(); // fix shading

//         child.material.flatShading = false;
//         child.material.needsUpdate = true;

//         child.material.side = THREE.DoubleSide;
//         child.material.depthWrite = true;
//         child.material.depthTest = true;
//         child.material.alphaTest = 0.5;

//       }

//       if (child.isMesh && child.material) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         // 🚀 THE FIX: Give this specific swan its own unique material clone!
//         const mat = child.material.clone();

//         mat.side = THREE.DoubleSide;
//         mat.alphaTest = isReflection ? 0.01 : 0.5;
//         mat.depthWrite = true;
//         mat.depthTest = true;
//         mat.transparent = true;

//         const originalColor = child.material.color?.clone?.() ?? new THREE.Color("#ffffff");
//         const luminance =
//           originalColor.r * 0.2126 + originalColor.g * 0.7152 + originalColor.b * 0.0722;
//         const isFeatherMaterial = luminance > 0.6;

//         if (isFeatherMaterial) {
//           mat.color = new THREE.Color(isReflection ? "#d9dde2" : "#f7f7f4");
//           mat.roughness = isReflection ? 0.48 : 0.34;        // soften reflected highlights
//           mat.metalness = 0.0;         // real feathers should stay soft, not glossy
//           mat.envMapIntensity = isReflection ? 0.55 : 1.45;  // dim the mirror swan
//           mat.normalScale?.set(1.55, 1.55);
//           mat.aoMapIntensity = 1.3;
//           mat.sheen = isReflection ? 0.45 : 0.95;
//           mat.sheenColor = new THREE.Color(isReflection ? "#d7dde4" : "#ffffff");
//           mat.sheenRoughness = isReflection ? 0.88 : 0.72;
//         } else {
//           mat.color.copy(originalColor);
//           mat.metalness = child.material.metalness ?? 0;
//           mat.roughness = isReflection ? Math.max(child.material.roughness ?? 0.5, 0.6) : child.material.roughness ?? 0.5;
//           mat.envMapIntensity = isReflection ? 0.45 : child.material.envMapIntensity ?? 1;
//         }

//         mat.flatShading = false;
//         mat.needsUpdate = true;

//         mat.side = THREE.DoubleSide;
//         //mat.transparent = true;
//         mat.transparent = opacity < 1;

//         mat.flatShading = false;
//         mat.depthWrite = true;
//         mat.depthTest = true;

//         // 🚀 Now, if this is the reflection, it only cuts THIS clone's feet off
//         if (clipPlane) {
//           mat.clippingPlanes = [clipPlane];
//         } else {
//           // Explicitly clear it for the main swan just to be safe
//           mat.clippingPlanes = [];
//         }

//         mat.needsUpdate = true;
//         child.material = mat; // Apply the new unique skin back to the mesh
//         materialsRef.current.push(mat);
//       }

//      return () => {
//       materialsRef.current.forEach((mat) => {
//         mat.dispose(); 
//       })}
//     });
//   }, [scene, isReflection, clipPlane]);

//   useEffect(() => {
//     const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
//     if (action) action.play().paused = true;
//     return () => {
//       if (action) action.stop();
//     };
//   }, [actions]);

//   useEffect(() => {
//     const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
//     if (action && action.getClip()) {
//       action.time = action.getClip().duration * scrollProgress;
//     }
//   }, [scrollProgress, actions]);

//   // --- SMOOTH ROTATION & CAMERA FRAME ---
//   useFrame(({ camera }) => {


//     if (group.current) {
//       group.current.rotation.x = 0.1;
//       group.current.rotation.z = 0;
//       group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.1);
//     }

//     // 🚀 2. BULLETPROOF OPACITY UPDATE (Updates instantly with scroll)
//     materialsRef.current.forEach((mat) => {
//       mat.opacity = isReflection ? opacity * 0.42 : opacity;

//                 const needsTransparent = (isReflection ? opacity * 0.42 : opacity) < 1;
//               if (mat.transparent !== needsTransparent) {
//                 mat.transparent = needsTransparent;
//                 mat.needsUpdate = true;
//               }
//     });



//     if (!isReflection) {
//       camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY.current, 0.05);
//       camera.lookAt(0, -5, 0);
//     }
//   });

//   // --- DRAG HANDLERS ---
//   useEffect(() => {
//     const handleGlobalPointerUp = () => {
//       isDragging.current = false;
//       document.body.style.cursor = "auto";
//     };

//     const handleGlobalPointerMove = (e: PointerEvent) => {
//       if (!isDragging.current) return;

//       const deltaX = e.clientX - previousX.current;
//       const deltaY = e.clientY - previousY.current;

//       // Horizontal Drag -> Rotates Swan
//       setTargetRotY((prev) => prev + deltaX * 0.015);

//       // Vertical Drag -> Moves Camera
//       // Moving mouse down pulls the camera up (over the swan)
//       targetCamY.current += deltaY * 0.15;

//       // Prevent camera from going underwater or flying out of orbit
//       targetCamY.current = THREE.MathUtils.clamp(targetCamY.current, -10, 40);

//       previousX.current = e.clientX;
//       previousY.current = e.clientY;
//     };

//     window.addEventListener("pointerup", handleGlobalPointerUp);
//     window.addEventListener("pointermove", handleGlobalPointerMove);

//     return () => {
//       window.removeEventListener("pointerup", handleGlobalPointerUp);
//       window.removeEventListener("pointermove", handleGlobalPointerMove);
//     };
//   }, []);

//   const baseScale = isMobile ? 380 : 600;
//   const currentScale = baseScale + transformProgress * (isMobile ? 250 : 400);

//   return (
//     <>
//       <primitive
//         ref={group}
//         object={scene}
//         scale={currentScale}
//         position={[0, -14, 0]}
//         onPointerDown={(e: any) => {
//           e.stopPropagation();
//           isDragging.current = true;
//           previousX.current = e.clientX;
//           previousY.current = e.clientY; // Start tracking Y position
//           document.body.style.cursor = "grabbing";
//         }}
//         onPointerOver={() => {
//           if (!isDragging.current) document.body.style.cursor = "grab";
//         }}
//         onPointerOut={() => {
//           if (!isDragging.current) document.body.style.cursor = "auto";
//         }}
//       />

//       {!isReflection && (
//         <pointLight
//           color="#fffaf2"
//           intensity={1.8}
//           distance={58}
//           decay={2}
//           position={[5.5, 9, 12]}
//         />
//       )}
//     </>
//   );
// };

/* =========================================================
   🦢 SWAN (INTERACTIVE + CAMERA TRACKING)
========================================================= */
// export const SwanModel = ({
//   scrollProgress,
//   opacity = 1,
//   isReflection = false,
//   clipY,
//   transformProgress,
// }: {
//   scrollProgress: number;
//   opacity?: number;
//   isReflection?: boolean;
//   clipY?: number;
//   transformProgress: number;
// }) => {
//   const group = useRef<THREE.Group>(null);
//   const { scene, animations } = useGLTF("/models/Swan_anim_v23.glb");
//   const { actions } = useAnimations(animations, group);

//   const isDragging = useRef(false);
//   const previousX = useRef(0);
//   const previousY = useRef(0);
//   const targetCamY = useRef(0);
//   const [targetRotY, setTargetRotY] = useState(-Math.PI / 160);

//   // 🚀 1. SAFELY CREATE CLIP PLANE REF (Does not trigger re-renders)
//   const clipPlaneRef = useRef<THREE.Plane | null>(null);
//   if (clipY !== undefined && !clipPlaneRef.current) {
//     clipPlaneRef.current = new THREE.Plane(new THREE.Vector3(0, -1, 0), clipY);
//   }

//   const materialsRef = useRef<THREE.Material[]>([]);

//   useLayoutEffect(() => {
//     materialsRef.current = [];
//     const originalMaterials = new Map(); // 🚀 2. PROTECT THE GLOBAL CACHE

//     scene.traverse((child: any) => {
//       if (child.isMesh) {

//         child.geometry.computeVertexNormals(); // fix shading
//         child.geometry.normalizeNormals();
//         child.material.flatShading = false;
//         child.material.needsUpdate = true;
//         child.material.side = THREE.DoubleSide;
//         child.material.depthWrite = true;
//         child.material.depthTest = true;
//         child.material.alphaTest = 0.5;
//       }

//       if (child.isMesh && child.material) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         // Save pristine material
//         if (!originalMaterials.has(child.uuid)) {
//           originalMaterials.set(child.uuid, child.material);
//         }

//         const mat = child.material.clone();

//         mat.side = THREE.DoubleSide;
//         mat.alphaTest = isReflection ? 0.01 : 0.5;
//         mat.depthWrite = true;
//         mat.depthTest = true;
//         mat.transparent = true;

//         const originalColor = child.material.color?.clone?.() ?? new THREE.Color("#ffffff");
//         const luminance =
//           originalColor.r * 0.2126 + originalColor.g * 0.7152 + originalColor.b * 0.0722;
//         const isFeatherMaterial = luminance > 0.6;

//         if (isFeatherMaterial) {

//           // keep original texture maps
//           mat.map = child.material.map;
//           mat.normalMap = child.material.normalMap;
//           mat.aoMap = child.material.aoMap;

//           // brighter white like reference swan
//           mat.color = new THREE.Color(isReflection ? "#ffffff" : "#ffffff");

//           // feather softness
//           mat.roughness = isReflection ? 0.5 : 0.32;
//           mat.metalness = 0.0;

//           // environment lighting response
//           mat.envMapIntensity = isReflection ? 0.55 : 1.6;

//           // smoother feather shading


//           // ambient occlusion for feather depth

//           // subtle feather sheen like real feathers
//           mat.sheen = isReflection ? 0.35 : 0.9;
//           mat.sheenColor = new THREE.Color("#ffffff");
//           mat.sheenRoughness = 0.6;

//         } else {
//          }



//         // 🚀 3. APPLY BLADE SAFELY
//         if (clipPlaneRef.current) {
//           mat.clippingPlanes = [clipPlaneRef.current];
//         } else {
//           mat.clippingPlanes = null; // Destroys inherited blades from cache
//         }

//         mat.needsUpdate = true;
//         child.material = mat;
//         materialsRef.current.push(mat);
//       }
//     });

//     return () => {
//       // 🚀 4. RESTORE CACHE ON UNMOUNT
//       scene.traverse((child: any) => {
//         if (child.isMesh && originalMaterials.has(child.uuid)) {
//           child.material = originalMaterials.get(child.uuid);
//         }
//       });
//       materialsRef.current.forEach((mat) => mat.dispose());
//     };
//   }, [scene, isReflection]); // 🚀 5. REMOVED clipPlane dependency!

//   useEffect(() => {
//     const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
//     if (action) action.play().paused = true;
//     return () => {
//       if (action) action.stop();
//     };
//   }, [actions]);

//   useEffect(() => {
//     const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
//     if (action && action.getClip()) {
//       action.time = action.getClip().duration * scrollProgress;
//     }
//   }, [scrollProgress, actions]);

//   useFrame(({ camera }) => {
//     // 🚀 6. DYNAMICALLY LIFT BLADE IN RENDER LOOP (Zero lag)
//     if (clipPlaneRef.current && clipY !== undefined) {
//       clipPlaneRef.current.constant = clipY;
//     }

//     if (group.current) {
//       group.current.rotation.x = 0.1;
//       group.current.rotation.z = 0;
//       group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.1);
//     }

//     materialsRef.current.forEach((mat) => {
//       mat.opacity = isReflection ? opacity * 0.85 : opacity;
//       const needsTransparent = (isReflection ? opacity * 0.42 : opacity) < 1;
//       if (mat.transparent !== needsTransparent) {
//         mat.transparent = needsTransparent;
//         mat.needsUpdate = true;
//       }
//     });

//     if (!isReflection) {
//       camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY.current, 0.05);
//       camera.lookAt(0, -5, 0);
//     }
//   });

//   useEffect(() => {
//     const handleGlobalPointerUp = () => {
//       isDragging.current = false;
//       document.body.style.cursor = "auto";
//     };

//     const handleGlobalPointerMove = (e: PointerEvent) => {
//       if (!isDragging.current) return;
//       const deltaX = e.clientX - previousX.current;
//       const deltaY = e.clientY - previousY.current;
//       setTargetRotY((prev) => prev + deltaX * 0.015);
//       targetCamY.current += deltaY * 0.15;
//       targetCamY.current = THREE.MathUtils.clamp(targetCamY.current, -10, 40);
//       previousX.current = e.clientX;
//       previousY.current = e.clientY;
//     };

//     window.addEventListener("pointerup", handleGlobalPointerUp);
//     window.addEventListener("pointermove", handleGlobalPointerMove);

//     return () => {
//       window.removeEventListener("pointerup", handleGlobalPointerUp);
//       window.removeEventListener("pointermove", handleGlobalPointerMove);
//     };
//   }, []);

//   const baseScale = isMobile ? 380 : 600;
//   const currentScale = baseScale + transformProgress * (isMobile ? 250 : 400);

//   return (
//     <>
//       <primitive
//         ref={group}
//         object={scene}
//         scale={currentScale}
//         position={[0, -14, 0]}
//         onPointerDown={(e: any) => {
//           e.stopPropagation();
//           isDragging.current = true;
//           previousX.current = e.clientX;
//           previousY.current = e.clientY;
//           document.body.style.cursor = "grabbing";
//         }}
//         onPointerOver={() => {
//           if (!isDragging.current) document.body.style.cursor = "grab";
//         }}
//         onPointerOut={() => {
//           if (!isDragging.current) document.body.style.cursor = "auto";
//         }}
//       />
//       {!isReflection && (
//         <pointLight color="#fffaf2" intensity={1.8} distance={58} decay={2} position={[5.5, 9, 12]} />
//       )}
//     </>
//   );
// };

export const SwanModel = ({
  scrollProgress,
  opacity = 1,
  isReflection = false,
  clipY,
  transformProgress,
}: {
  scrollProgress: number;
  opacity?: number;
  isReflection?: boolean;
  clipY?: number;
  transformProgress: number;
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/Swan_anim_v24.glb");
  const { actions } = useAnimations(animations, group);

  const isDragging = useRef(false);
  const previousX = useRef(0);
  const previousY = useRef(0);
  const targetCamY = useRef(0);
  const [targetRotY, setTargetRotY] = useState(-Math.PI / 160);

  // 🚀 1. SAFELY CREATE CLIP PLANE REF (Does not trigger re-renders)
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  if (clipY !== undefined && !clipPlaneRef.current) {
    clipPlaneRef.current = new THREE.Plane(new THREE.Vector3(0, -1, 0), clipY);
  }

  const materialsRef = useRef<THREE.Material[]>([]);

  useLayoutEffect(() => {
    materialsRef.current = [];
    const originalMaterials = new Map(); // 🚀 2. PROTECT THE GLOBAL CACHE

    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.geometry?.computeVertexNormals) {
          child.geometry.computeVertexNormals();
          if (child.geometry.attributes?.normal) {
            child.geometry.attributes.normal.needsUpdate = true;
          }
        }

        // Save pristine material
        if (!originalMaterials.has(child.uuid)) {
          originalMaterials.set(child.uuid, child.material);
        }

        const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
        const clonedMaterials = sourceMaterials.map((m: THREE.Material) => m.clone());

        clonedMaterials.forEach((mat: any, i: number) => {
          const sourceMat: any = sourceMaterials[i];
          const originalColor = sourceMat?.color?.clone?.() ?? new THREE.Color("#ffffff");
          const luminance = originalColor.r * 0.2126 + originalColor.g * 0.7152 + originalColor.b * 0.0722;
          const isFeatherMaterial = luminance > 0.6;

          mat.side = THREE.DoubleSide;
          mat.alphaTest = isReflection ? 0.01 : 0.5;
          mat.depthWrite = true;
          mat.depthTest = true;
          mat.flatShading = false;

          // Base PBR tuning (reveals existing glTF textures without adding any)
          mat.metalness = 0.0;
          mat.roughness = isReflection ? 0.78 : 0.55;
          mat.envMapIntensity = isReflection ? 0.22 : 1.4;

          if (isFeatherMaterial) {
            mat.color = new THREE.Color(isReflection ? "#a8a8a8" : "#ffffff");
          }

          // If the glTF provides a normal map, slightly boost it for feather bump detail.
          if (mat.normalMap && mat.normalScale?.set) {
            mat.normalScale.set(1.2, 1.2);
          }

          // Sharpen existing texture sampling a bit (no new textures).
          const maps = [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap, mat.aoMap].filter(Boolean);
          maps.forEach((tex: any) => {
            if (typeof tex.anisotropy === "number") tex.anisotropy = Math.max(tex.anisotropy ?? 1, 8);
          });

          mat.transparent = opacity < 1;

          // 🚀 APPLY BLADE SAFELY
          if (clipPlaneRef.current) {
            mat.clippingPlanes = [clipPlaneRef.current];
          } else {
            mat.clippingPlanes = null; // Destroys inherited blades from cache
          }

          mat.needsUpdate = true;
        });

        child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
        materialsRef.current.push(...clonedMaterials);
      }
    });

    return () => {
      // 🚀 4. RESTORE CACHE ON UNMOUNT
      scene.traverse((child: any) => {
        if (child.isMesh && originalMaterials.has(child.uuid)) {
          child.material = originalMaterials.get(child.uuid);
        }
      });
      materialsRef.current.forEach((mat) => mat.dispose());
    };
  }, [scene, isReflection]); // 🚀 5. REMOVED clipPlane dependency!

  useEffect(() => {
    const action = actions["rigAction"] || actions[Object.keys(actions)[0]];
    if (action) action.play().paused = true;
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

  useFrame(({ camera }) => {
    // 🚀 6. DYNAMICALLY LIFT BLADE IN RENDER LOOP (Zero lag)
    if (clipPlaneRef.current && clipY !== undefined) {
      clipPlaneRef.current.constant = clipY;
    }

    if (group.current) {
      group.current.rotation.x = 0.1;
      group.current.rotation.z = 0;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.1);
    }

    materialsRef.current.forEach((mat) => {
      mat.opacity = isReflection ? opacity * 0.85 : opacity;
      const needsTransparent = (isReflection ? opacity * 0.42 : opacity) < 1;
      if (mat.transparent !== needsTransparent) {
        mat.transparent = needsTransparent;
        mat.needsUpdate = true;
      }
    });

    if (!isReflection) {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY.current, 0.05);
      camera.lookAt(0, -5, 0);
    }
  });

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "auto";
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousX.current;
      const deltaY = e.clientY - previousY.current;
      setTargetRotY((prev) => prev + deltaX * 0.015);
      targetCamY.current += deltaY * 0.15;
      targetCamY.current = THREE.MathUtils.clamp(targetCamY.current, -10, 40);
      previousX.current = e.clientX;
      previousY.current = e.clientY;
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointermove", handleGlobalPointerMove);

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointermove", handleGlobalPointerMove);
    };
  }, []);

  const baseScale = isMobile ? 380 : 600;
  const currentScale = baseScale + transformProgress * (isMobile ? 250 : 400);

  return (
    <>
      <primitive
        ref={group}
        object={scene}
        scale={currentScale}
        position={[0, -14, 0]}
        onPointerDown={(e: any) => {
          e.stopPropagation();
          isDragging.current = true;
          previousX.current = e.clientX;
          previousY.current = e.clientY;
          document.body.style.cursor = "grabbing";
        }}
        onPointerOver={() => {
          if (!isDragging.current) document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (!isDragging.current) document.body.style.cursor = "auto";
        }}
      />
    </>
  );
};
/* =========================================================
   💦 SPLASH DROPLETS
========================================================= */
export const SplashDroplets = ({ splashProgress, opacity = 1 }: { splashProgress: number, opacity?: number }) => {
  const count = 3000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const upVector = new THREE.Vector3(0, 1, 0);
  const spawnRadius = 12.0;
  const dropletOnBeforeCompile = useMemo(
    () => (shader: any) => {
      shader.uniforms.uFresnelStrength = { value: 0.85 };
      shader.uniforms.uFresnelColor = { value: new THREE.Color("#ffffff") };

      shader.fragmentShader =
        `uniform float uFresnelStrength;\nuniform vec3 uFresnelColor;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        `
          float ndv = clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndv, 3.0);
          outgoingLight += uFresnelColor * fresnel * uFresnelStrength;
          gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
      );
    },
    []
  );

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

      if (randSize > 0.9) {
        baseScale = 0.15 + Math.random() * 0.2;
        evaporates = false;
        isStreakType = Math.random() > 0.3;
      } else if (randSize > 0.6) {
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
      // Ease-out from the exact water surface so droplets don't "pop" above it on the first visible frame.
      const startEase = THREE.MathUtils.smoothstep(time, 0.0, 0.10);
      const currentVx = p.vx * Math.pow(p.drag, time * 10);
      const currentVz = p.vz * Math.pow(p.drag, time * 10);
      const currentVy = p.vy - 90 * time;

      let currentX = p.startX + currentVx * time * startEase;
      let currentZ = p.startZ + currentVz * time * startEase + 4;
      let currentY = -14 + (p.vy * time - 0.5 * 90 * time * time) * startEase;

      const speed = Math.sqrt(currentVx * currentVx + currentVy * currentVy + currentVz * currentVz);

      let stretch = p.isStreakType ? Math.max(1.0, speed * 0.04) : 0.9 + Math.random() * 0.2;
      let scale = p.baseScale;
      if (currentY < -14.05) scale = 0;
      else scale *= p.evaporates ? Math.max(0, 1.0 - time * 1.5) : Math.max(0, 1.0 - time * 0.2);
      scale *= startEase;

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
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={0.35}
        ior={1.33}
        roughness={0.06}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.03}
        envMapIntensity={1.8}
        attenuationColor="#eaf3ff"
        attenuationDistance={0.9}
        transparent={true}
        opacity={opacity * 0.28}
        depthWrite={false}
        depthTest
        onBeforeCompile={dropletOnBeforeCompile}
      />
    </instancedMesh>
  );
};

/* =========================================================
   🌊 WATER PLANE
========================================================= */
// export const WaterPlane = ({ splashProgress, opacity = 1 }: { splashProgress: number, opacity?: number }) => {
//   const reflectorRef = useRef<any>(null);
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//   const geometry = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);

//   const reflector = useMemo(() => {
//     const refl = new Reflector(geometry, {
//       textureWidth: isMobile ? 1024 : 2048,
//       textureHeight: isMobile ? 1024 : 2048,
//       // 🚀 Lifted to 0x252525 so it's actually visible, unlike the last one
//       color: 0x252525, 
//     });
//     refl.rotation.x = -Math.PI / 2;
//     refl.position.y = -15.1; // Physical placement

//     const material = refl.material as THREE.ShaderMaterial;
//     material.transparent = true;
//     material.opacity = opacity;

//     material.onBeforeCompile = (shader) => {
//       shader.uniforms.uTime = { value: 0 };
//       shader.uniforms.uTakeoff = { value: 0 };
//       shader.fragmentShader = `uniform float uTime; uniform float uTakeoff;\n` + shader.fragmentShader;

//       shader.fragmentShader = shader.fragmentShader.replace(
//         `vec4 base = texture2DProj( tDiffuse, vUv );`,
//         `
//         float projectedY = vUv.y / vUv.w;
//         vec2 baseUV = vUv.xy / vUv.w;

//         // 1. SIMPLE WATER JITTER (For that "Reference Photo" look)
//         // This breaks up the belly shape into soft horizontal streaks
//         float ripple = sin(baseUV.x * 150.0 + uTime * 2.0) * 0.002;
//         float jitter = cos(baseUV.y * 100.0 - uTime * 1.5) * 0.003;
//         vec2 distortedUv = vec2(vUv.x + ripple, vUv.y + jitter);

//         // 🚀 2. THE REFLECTION SAMPLING
//         // We sample once but with the jitter to keep it bright but soft
//         vec4 base = texture2DProj(tDiffuse, vec4(distortedUv, vUv.zw));

//         // 🚀 3. THE "GAP" MASK
//         // This creates a clean 0.5cm black gap right under the swan
//         // Adjustment: Increase 0.47 to 0.49 for a LARGER gap.
//         float gap = smoothstep(0.47, 0.51, projectedY);

//         // 🚀 4. DEPTH FADE (The "Single Reflection" Fix)
//         // This kills the reflection of the neck/head so you only see the body
//         float depthFade = smoothstep(0.35, 0.55, projectedY);

//         // Dampen the white just enough to not "bloom"
//         base.rgb *= 0.8; 

//         // Apply the gap and the fade
//         base.a *= (gap * depthFade);
//         `
//       );
//       reflectorRef.current = { userData: { shader } };
//     };
//     return refl;
//   }, [geometry, isMobile]);

//   useFrame(() => {
//     if (reflectorRef.current?.userData.shader) {
//       reflectorRef.current.userData.shader.uniforms.uTime.value = splashProgress * 20.0;
//     }
//   });

//   return <primitive object={reflector} />;
// };
export const WaterPlane = ({
  splashProgress,
  scrollProgress = 0,
  opacity = 1,
}: {
  splashProgress: number;
  scrollProgress?: number;
  opacity?: number;
}) => {
  const reflectorRef = useRef<any>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const geometry = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const ringCount = 10;
  const ringSeeds = useMemo(() => Array.from({ length: ringCount }).map(() => Math.random() * 10), [ringCount]);
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.988, 1.0, 256, 1), []);
  const ringGlowGeo = useMemo(() => new THREE.RingGeometry(0.955, 1.02, 256, 1), []);
  const ringMaterialBase = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uSeed: { value: 0 },
        uInner: { value: 0.988 },
        uOuter: { value: 1.0 },
        uAmp: { value: 0.028 },
        uLift: { value: 0.55 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSeed;
        uniform float uAmp;
        uniform float uLift;
        varying float vDist;
        varying float vNoise;

        void main() {
          vec3 pos = position;
          float ang = atan(pos.y, pos.x);
          float dist = length(pos.xy);

          float n1 = sin(ang * 7.0 + uTime * 0.85 + uSeed * 6.2831);
          float n2 = cos(ang * 13.0 - uTime * 0.55 + uSeed * 3.11);
          float n3 = sin((pos.x + pos.y) * 2.2 + uTime * 0.35 + uSeed * 9.0);
          float noise = (n1 * 0.55 + n2 * 0.35 + n3 * 0.25);

          float wob = noise * uAmp;
          vec2 dir = normalize(pos.xy + vec2(1e-6));
          pos.xy = dir * (dist + wob);

          // "3D" lift along the ring normal (becomes Y after rotation)
          pos.z += wob * uLift;

          vDist = length(pos.xy);
          vNoise = noise;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uInner;
        uniform float uOuter;
        varying float vDist;
        varying float vNoise;

        void main() {
          float edge = 0.0032;
          float band = smoothstep(uInner, uInner + edge, vDist)
                     * (1.0 - smoothstep(uOuter - edge, uOuter, vDist));
          float variation = 0.92 + 0.08 * (vNoise * 0.5 + 0.5);
          float alpha = band * uOpacity;
          gl_FragColor = vec4(vec3(variation), alpha);
        }
      `,
    });
    return mat;
  }, []);
  const ringGlowMaterialBase = useMemo(() => {
    const mat = ringMaterialBase.clone();
    mat.uniforms = THREE.UniformsUtils.clone(ringMaterialBase.uniforms);
    mat.uniforms.uInner.value = 0.955;
    mat.uniforms.uOuter.value = 1.02;
    mat.uniforms.uAmp.value = 0.038;
    mat.uniforms.uLift.value = 0.35;
    mat.polygonOffsetFactor = -2;
    mat.polygonOffsetUnits = -2;
    return mat;
  }, [ringMaterialBase]);
  const ringMaterials = useMemo(
    () =>
      Array.from({ length: ringCount }, (_, i) => {
        const mat = ringMaterialBase.clone();
        mat.uniforms = THREE.UniformsUtils.clone(ringMaterialBase.uniforms);
        mat.uniforms.uSeed.value = ringSeeds[i] ?? 0;
        return mat;
      }),
    [ringCount, ringMaterialBase, ringSeeds]
  );
  const ringGlowMaterials = useMemo(
    () =>
      Array.from({ length: ringCount }, (_, i) => {
        const mat = ringGlowMaterialBase.clone();
        mat.uniforms = THREE.UniformsUtils.clone(ringGlowMaterialBase.uniforms);
        mat.uniforms.uSeed.value = ringSeeds[i] ?? 0;
        return mat;
      }),
    [ringCount, ringGlowMaterialBase, ringSeeds]
  );

  const reflector = useMemo(() => {
    const refl = new Reflector(geometry, {
      textureWidth: isMobile ? 1024 : 2048,
      textureHeight: isMobile ? 1024 : 2048,
      color: 0x000000,
    });
    refl.rotation.x = -Math.PI / 2;
    refl.position.y = -15;
    const material = refl.material as THREE.ShaderMaterial;
    material.transparent = true;
    material.opacity = opacity;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uTakeoff = { value: 0 };
      shader.fragmentShader = `uniform float uTime; uniform float uTakeoff;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `vec4 base = texture2DProj( tDiffuse, vUv );`,
        `
  float projectedY = vUv.y / vUv.w;
  
  // 1. We keep a very small mask just to keep the water contact point clean
  float surfaceMask = smoothstep(0.6, 0.55, projectedY); 

  // 2. UNIFORM DISTORTION (Removed depth logic)
  // This applies the same wave amount to the body and the neck head
  vec2 baseUV = vUv.xy / vUv.w;
  float ripple = sin(baseUV.x * 20.0 + uTime * 1.5) * cos(baseUV.y * 15.0 + uTime * 1.0);
  vec2 distortion = vec2(ripple) * 0.0012; // Low constant distortion

  // 3. CONSTANT BLUR
  // Keeping this low (0.002) so the neck stays sharp and visible
  float blurSize = 0.0016; 
  
  vec4 blurSum = vec4(0.0);
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w), vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(blurSize, blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(-blurSize, blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(blurSize, -blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(-blurSize, -blurSize) * vUv.w, vUv.zw));
  
  vec4 base = blurSum / 1.0;

<<<<<<< HEAD
  // 4. GRAY MIRROR LOOK (closer to ref image) but keep slight chroma (beak stays orange-ish)
  vec3 origColor = base.rgb;
  float brightness = dot(origColor, vec3(0.399, 0.987, 0.414));
  float gray = clamp(pow(brightness, 0.88) * 1.25 + 0.04, 0.0, 1.0);
  // More gray on the body edges (near wings) while keeping some chroma elsewhere.
  float wingX = abs(baseUV.x - 0.5); // 0 center, 0.5 edges
  float wingMaskX = smoothstep(0.12, 0.46, wingX);
  float wingMaskY = smoothstep(0.70, 0.80, projectedY) * (1.8 - smoothstep(0.62, 0.74, projectedY));
  float wingMask = wingMaskX * wingMaskY;
  float saturationKeep = mix(0.78, 0.85, wingMask);
  base.rgb = mix(vec3(gray), origColor, saturationKeep);

	  // 4.05 GRAYSCALE WATER REFLECTION LOOK
	  // Convert reflection to mostly-gray (keeps brightness variation) and keep it slightly darker than the swan above water.
		  float depthT = smoothstep(0.60, 0.20, projectedY); // 0 near waterline, 1 deeper down
		  // Brighter reflection overall (still slightly darker than the real swan)
		  float depthDark = mix(0.98, 0.96, depthT);
		  float lum = dot(base.rgb, vec3(0.299, 0.587, 0.114));
		  float lumBoost = pow(lum, 0.85);
		  vec3 grayRefl = clamp((vec3(lumBoost) * depthDark) * 1.12 + vec3(0.02), 0.0, 1.0);

	  // Preserve beak color (orange) while keeping the rest mostly grayscale.
	  float beakR = smoothstep(0.35, 0.75, origColor.r);
	  float beakWarm = smoothstep(0.08, 0.28, origColor.r - origColor.g);
	  float beakLowB = 1.0 - smoothstep(0.22, 0.48, origColor.b);
	  float beakMask = clamp(beakR * beakWarm * beakLowB, 0.0, 1.0);
		  vec3 beakRefl = origColor * depthDark;

		  base.rgb = mix(grayRefl, beakRefl, beakMask);
		  // Lift the non-beak areas a touch more to read "whiter" without shifting the beak hue.
		  vec3 reflLift = clamp(base.rgb * 1.10 + vec3(0.015), 0.0, 1.0);
		  base.rgb = mix(reflLift, base.rgb, beakMask);

		  // Slightly brighten the neck area in the reflection (keeps beak color intact).
		  // Neck sits higher (near waterline) and towards the left side in screen-space.
		  float neckY = smoothstep(0.56, 0.63, projectedY);
		  float neckX = 1.0 - smoothstep(0.34, 0.56, baseUV.x);
		  float neckMask = clamp(neckY * neckX, 0.0, 1.0) * (1.0 - beakMask);
		  base.rgb = mix(base.rgb, clamp(base.rgb * 1.55 + vec3(0.05), 0.0, 1.0), neckMask);
	
	  // 4.1 THIN RIPPLE LINE HIGHLIGHTS
	  float linePhase = (baseUV.y + uTime * 0.02) * 92.0 + ripple * 3.0;
	  float lines = smoothstep(0.94, 1.0, abs(sin(linePhase)));
	  base.rgb += vec3(1.0) * lines * 0.14 * (1.0 - surfaceMask);
  
  // 4.15 PRE-REFLECTION SHADOW (dark band before reflection starts)
  // Creates that black waterline shade under the swan body like the reference.
  float preShadow = smoothstep(0.505, 0.635, projectedY) * (1.0 - smoothstep(0.635, 0.865, projectedY));
  float preShadowStrength = clamp(pow(preShadow, 0.75) * 3.6, 0.0, 1.0);
  base.rgb = mix(base.rgb, vec3(0.0), preShadowStrength);

  // 4.2 CONTACT SHADOW (thin black seam + soft band at the waterline)
  // Only affects reflection color (no opacity changes).
  // Shifted slightly downward to create a small "air gap" before the shadow starts.
  float contactSeam = smoothstep(0.53, 0.56, projectedY) * (1.0 - smoothstep(0.56, 0.572, projectedY));
  float contactBand = smoothstep(0.56, 0.63, projectedY) * (1.0 - smoothstep(0.63, 0.74, projectedY));
  base.rgb *= mix(1.0, 0.70, contactSeam);
  base.rgb *= mix(1.0, 0.80, contactBand);

  // 4.22 FLOATING GAP (increase separation between swan and reflection)
  // Creates a wider transparency band so the reflection starts lower, like a swan floating above the mirrored image.
  float gapMask = smoothstep(0.48, 0.60, projectedY) * (1.0 - smoothstep(0.60, 0.72, projectedY));
  base.a *= (1.0 - gapMask);
  base.rgb *= 1.0 - gapMask * 0.25;

  // 4.23 START-OF-REFLECTION BLACK (extra darkness right where the reflection begins)
  float startBlack = smoothstep(0.60, 0.64, projectedY) * (1.0 - smoothstep(0.64, 0.78, projectedY));
  base.rgb *= 1.0 - startBlack * 6.55;

  // 4.24 BODY DARK PATCH (kills the bright white reflection near the wings/belly)
  // Uses the same Y band as the body area, and a wider X coverage (wings + belly).
  float bellyMask = (1.0 - smoothstep(0.06, 0.30, wingX)) * wingMaskY;
  float bodyBlackMask = clamp(max(wingMask, bellyMask), 0.0, 1.0);
  // Only crush the *bright* parts (the white patch), leaving darker details intact.
  float whiteKill = smoothstep(0.34, 0.62, brightness);
  float killAmt = clamp(bodyBlackMask * pow(whiteKill, 0.50) * 6.50, 0.0, 1.0);
  base.rgb = mix(base.rgb, vec3(0.0), killAmt);
  // Extra overall darkening in the masked body area (keeps it from reading "white" even when not fully crushed).
  base.rgb *= 1.0 - bodyBlackMask * 0.35;

  // 4.3 (reserved)

  // 5. EXTENDED NECK VISIBILITY
  // Lowered the start of the fade (0.3 -> 0.15) so the neck shows more
  float verticalFade = smoothstep(0.135, 0.62, projectedY);
=======
  // 4. LOWERED BRIGHTNESS
  // Changed from 1.1/1.3 down to 0.7 to prevent the 'blown out' look
  float brightness = dot(base.rgb, vec3(0.299, 0.587, 0.114));
  base.rgb = vec3(brightness * .8); 

  // 5. EXTENDED NECK VISIBILITY
  // Lowered the start of the fade (0.3 -> 0.15) so the neck shows more
  float verticalFade = smoothstep(0.1, 0.6, projectedY);
>>>>>>> 3519f17 (gifed)
  base.a *= verticalFade;
  `
      );
      reflectorRef.current = { userData: { shader } };
    };
    return refl;
  }, [geometry, isMobile]);

  useEffect(() => {
    return () => {
      ringGeo.dispose();
      ringMaterials.forEach((mat) => mat.dispose());
      ringGlowGeo.dispose();
      ringGlowMaterials.forEach((mat) => mat.dispose());
      ringMaterialBase.dispose();
      ringGlowMaterialBase.dispose();
    };
  }, [ringGeo, ringMaterials, ringGlowGeo, ringGlowMaterials, ringMaterialBase, ringGlowMaterialBase]);

  useFrame((state) => {
    if (reflectorRef.current?.userData.shader) {
      reflectorRef.current.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
      reflectorRef.current.userData.shader.uniforms.uTakeoff.value = splashProgress;
    }

    // Visible ripple rings around the swan position (swan sits near [0, -14, 0]).
    const time = state.clock.elapsedTime;
    const ringCenterY = -14.98;
    const intensity = THREE.MathUtils.smoothstep(splashProgress, 0.0, 0.12) * opacity;
    const base = 0.12 * opacity;
    const alphaScale = base + intensity * 0.55;

    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const mat = ring.material as THREE.ShaderMaterial;
      const seed = ringSeeds[i] ?? 0;
      const t = ((time * 0.055) + i * 0.18 + seed) % 1;
      const scale = THREE.MathUtils.lerp(1.2, 50, t);
      ring.position.set(0, ringCenterY, 0);
      const wobbleX = 1 + Math.sin(time * 0.45 + seed * 2.0) * 0.08;
      const wobbleZ = 1 + Math.cos(time * 0.40 + seed * 1.7) * 0.07;
      ring.scale.set(scale * wobbleX, scale * wobbleZ, 1);
      ring.rotation.z = seed * 0.35 + time * 0.06;
      const fade = Math.pow(1.0 - t, 0.45);
      mat.uniforms.uTime.value = time;
      mat.uniforms.uOpacity.value = fade * alphaScale * 0.85;
      mat.uniforms.uAmp.value = 0.024 + 0.012 * (0.5 + 0.5 * Math.sin(time * 0.65 + seed * 3.0));
      ring.visible = mat.uniforms.uOpacity.value > 0.01;
    });

    ringGlowMaterials.forEach((mat, i) => {
      const ring = ringRefs.current[i + ringCount];
      if (!ring) return;
      const seed = ringSeeds[i] ?? 0;
      const t = ((time * 0.055) + i * 0.18 + seed) % 1;
      const scale = THREE.MathUtils.lerp(1.2, 50, t);
      ring.position.set(0, ringCenterY, 0);
      const wobbleX = 1 + Math.sin(time * 0.45 + seed * 2.0) * 0.085;
      const wobbleZ = 1 + Math.cos(time * 0.40 + seed * 1.7) * 0.075;
      ring.scale.set(scale * wobbleX, scale * wobbleZ, 1);
      ring.rotation.z = seed * 0.35 + time * 0.06;
      const fade = Math.pow(1.0 - t, 0.45);
      const glowMat = mat as THREE.ShaderMaterial;
      glowMat.uniforms.uTime.value = time;
      glowMat.uniforms.uOpacity.value = fade * alphaScale * 0.35;
      glowMat.uniforms.uAmp.value = 0.032 + 0.014 * (0.5 + 0.5 * Math.sin(time * 0.6 + seed * 2.2));
      ring.visible = glowMat.uniforms.uOpacity.value > 0.01;
    });
  });

  return (
    <group>
      <primitive object={reflector} />
      {ringMaterials.map((mat, i) => (
        <mesh
          key={`waterplane-ring-${i}`}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ringGeo}
          material={mat}
          renderOrder={100}
          visible={false}
        />
      ))}
      {ringGlowMaterials.map((mat, i) => (
        <mesh
          key={`waterplane-ring-glow-${i}`}
          ref={(el) => {
            if (el) ringRefs.current[i + ringCount] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ringGlowGeo}
          material={mat}
          renderOrder={99}
          visible={false}
        />
      ))}
    </group>
  );
};
/* =========================================================
   🎬 MAIN COMBINED COMPONENT
========================================================= */
const LogoRevealNew = ({
  onComplete,
  onLogoCornerReached,
  onBookNowVisibilityChange,
}: {
  onComplete?: () => void;
  onLogoCornerReached?: () => void;
  onBookNowVisibilityChange?: (visible: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transformProgress, setTransformProgress] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const hasReachedCornerRef = useRef(false);
  const isBookNowVisibleRef = useRef(false);

  const TOTAL_FRAMES = 499;
  const BLUR_START_FRAME = TOTAL_FRAMES - 25;
  const FRAME_PATH = (i: number) =>
    `/assets/swarn_60/frame_${String(i).padStart(4, "0")}.jpg`;

  // Preload Video Frames
  useEffect(() => {
    const loadedArray: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        loadedArray[i] = img;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setImages(loadedArray);
      };
    }
  }, []);

  useGSAP(() => {
    if (!isReady || images.length === 0 || !logoRef.current || !canvasWrapperRef.current) return;

    const totalScroll = 12000;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          const raw = self.progress;
          const isCornerReached = raw >= 0.6;


          if (isBookNowVisibleRef.current !== isCornerReached) {
            isBookNowVisibleRef.current = isCornerReached;
            onBookNowVisibilityChange?.(isCornerReached);
          }

          if (isCornerReached && !hasReachedCornerRef.current) {
            hasReachedCornerRef.current = true;
            onLogoCornerReached?.();
          } else if (!isCornerReached) {
            hasReachedCornerRef.current = false;
          }


          // --- PHASE 1: Video executes first (0% to 40% of scroll) ---
          if (raw <= 0.4) {
            setScrollProgress(0);
            setTransformProgress(0);
            setSplashProgress(0);
          }
          // --- PHASE 2: 3D Scene Takes Over ---
          else {
            // 1. SWAN ANIMATION: Starts EXACTLY when Logo finishes moving (60%) and goes to 100%
            if (raw < 0.60) {
              setScrollProgress(0);
            } else {
              setScrollProgress((raw - 0.60) / 0.40);
            }

            // 2. SWAN SCALE: Scales up smoothly right as it starts moving (60% to 85%)
            if (raw < 0.60) {
              setTransformProgress(0);
            } else if (raw > 0.85) {
              setTransformProgress(1);
            } else {
              setTransformProgress((raw - 0.60) / 0.25);
            }

            // 3. SPLASH PHYSICS: Pushed back to trigger at the very end (90% to 100%)
            if (raw < 0.90) {
              setSplashProgress(0);
            } else if (raw >= 1.0) {
              setSplashProgress(1);
            } else {
              setSplashProgress((raw - 0.90) / 0.10);
            }
          }
        },
        onLeave: () => onComplete?.(),
      },
    });

    const centerLogoWidth = isMobile ? "78vw" : "100vw";

    // Set Initial CSS States
    gsap.set(logoRef.current, {
      autoAlpha: 1,
      scale: 1,
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      filter: "blur(0px)",
      width: centerLogoWidth,
      maxWidth: "100vw",
    });
    gsap.set(canvasWrapperRef.current, { autoAlpha: 0, filter: "blur(120px)" });

    // 1. Play Video Sequence (Takes exactly 4.0 units = 40% of total timeline)
    const frameObj = { frame: 0 };
    tl.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      snap: "frame",
      ease: "none",
      duration: 4.0,
      onUpdate: () => renderHero(frameObj.frame)
    });

    // 2. Video ends -> Fade in 3D Scene (blurred) while logo stays visible (Takes 0.5 units = 5%)
    tl.to(canvasWrapperRef.current, { autoAlpha: 1, filter: "blur(40px)", duration: 0.5 }, ">");

    // 3. Move Logo to corner AND unblur the Swan simultaneously (Takes 1.5 units = 15%)
    tl.to(logoRef.current, {
      top: "37px",
      left: "48px",
      xPercent: 0,
      yPercent: 0,
      width: "144px",
      duration: 1.5,
      ease: "power2.inOut",
    }, ">");

    tl.to(canvasWrapperRef.current, {
      filter: "blur(0px)",
      duration: 1.5,
      ease: "power2.inOut",
    }, "<");

    // 4. Pad the rest of the timeline (Takes 4.0 units = 40%)
    tl.to({}, { duration: 4.0 });

    // Video Renderer
    function renderHero(index: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      canvas.width = 1920;
      canvas.height = 1080;

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      const img = images[frameIndex];
      if (!img) return;

      if (frameIndex >= BLUR_START_FRAME) {
        const linearProgress = (frameIndex - BLUR_START_FRAME) / 25;
        const smoothProgress = linearProgress * linearProgress;
        ctx.filter = `blur(${smoothProgress * 100}px)`;
      } else {
        ctx.filter = "none";
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, [isReady, images.length, onLogoCornerReached, onBookNowVisibilityChange]);


  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">

      {/* --- 2D HERO VIDEO --- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full object-cover"
        style={{ display: "block" }}
      />

      {/* --- 3D SCENE --- */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-20"
        style={{ opacity: 0, visibility: "hidden" }}
      >
	        <Canvas
	          shadows
	          dpr={[1, 2]}
	          gl={{
	            antialias: true,
	            toneMappingExposure: 0.85,
	            toneMapping: THREE.ACESFilmicToneMapping,
	            outputColorSpace: THREE.SRGBColorSpace,
	            powerPreference: "high-performance"
	          }}
	          onCreated={({ gl }) => {
	            setIsReady(true);
	          }}
	        >
	          <color attach="background" args={["#000000"]} />
	
	          {/* Cinematic 3-point lighting (key / rim / fill) */}
	          <ambientLight intensity={0.18} color="#f2f2f2" />
	
	          <directionalLight
	            position={[10, 18, 14]}
	            intensity={3.2}
	            color="#f2f2f2"
	            castShadow
	            shadow-mapSize-width={2048}
	            shadow-mapSize-height={2048}
	            shadow-bias={-0.00015}
	            shadow-camera-near={1}
	            shadow-camera-far={120}
	            shadow-camera-left={-40}
	            shadow-camera-right={40}
	            shadow-camera-top={40}
	            shadow-camera-bottom={-40}
	          />
	
	          <directionalLight position={[-14, 12, -18]} intensity={1.6} color="#dbe8ff" />
	          <pointLight position={[-10, 6, 14]} intensity={1.1} distance={180} decay={2} color="#fff2e2" />
          {/* Base position is [0,0,70], interaction takes over Y via useFrame */}
          <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={isMobile ? 65 : 40} />

	          <Suspense fallback={null}>
	            <SwanModel scrollProgress={scrollProgress} transformProgress={transformProgress} />
	            <WaterPlane splashProgress={splashProgress} />
	            <SplashDroplets splashProgress={splashProgress} />
	            <SplashWalls splashProgress={splashProgress} />
	            <Environment preset="studio" background={false} />
	            <ContactShadows position={[0, -15.08, 0]} opacity={0.22} blur={2.6} scale={48} far={8} resolution={1024} />
	          </Suspense>
        </Canvas>
      </div>

      {/* --- LOGO --- */}
      <div
        ref={logoRef}
        className="absolute z-30 pointer-events-none"
        style={{ opacity: 1, visibility: "visible" }}
      >
        <img
          src={"assets/logo/beigelogo-small.svg"}
          alt="Logo"
        />
      </div>

    </section>
  );
};

useGLTF.preload("/models/Swan_anim_v24.glb");

export default LogoRevealNew;
