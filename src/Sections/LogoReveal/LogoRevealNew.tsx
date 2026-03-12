import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
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
       
       vec3 waterTint = vec3(0.9, 0.96, 1.0);
       vec3 rimHighlight = vec3(1.6, 1.8, 2.0) * (holeRims + heavyRim * 0.5 + crownDrops);
       diffuseColor.rgb = waterTint + rimHighlight;
       
       diffuseColor.a *= finalAlpha;
      `
      );
  };

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[baseRadius * 1.05, baseRadius, 1, 64, 12, true]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.96}
        thickness={2.0}
        ior={1.33}
        roughness={0.5}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={1.5}
        attenuationColor="#ffffff"
        attenuationDistance={0.6}
        transparent={true}
        opacity={opacity * 0.85}
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
      if (child.isMesh) {
        child.geometry.computeVertexNormals(); 
        child.material.flatShading = false;
        child.material.needsUpdate = true;
        child.material.side = THREE.DoubleSide;
        child.material.depthWrite = true;
        child.material.depthTest = true;
        child.material.alphaTest = 0.5;
      }

      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Save pristine material
        if (!originalMaterials.has(child.uuid)) {
          originalMaterials.set(child.uuid, child.material);
        }

        const mat = child.material.clone();

        mat.side = THREE.DoubleSide;
        mat.alphaTest = isReflection ? 0.01 : 0.5;
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.transparent = true;

        const originalColor = child.material.color?.clone?.() ?? new THREE.Color("#ffffff");
        const luminance = originalColor.r * 0.2126 + originalColor.g * 0.7152 + originalColor.b * 0.0722;
        const isFeatherMaterial = luminance > 0.6;
// Inside SwanModel component, within the useLayoutEffect loop:
if (isFeatherMaterial) {
  mat.color = new THREE.Color(isReflection ? "#a0a0a0" : "#f7f7f4"); // 🚀 Darker base for reflection
  mat.roughness = isReflection ? 0.8 : 0.34;        // 🚀 Higher roughness blurs highlights
  mat.metalness = 0.0;         
  mat.envMapIntensity = isReflection ? 0.2 : 1.45;  // 🚀 Dropped intensity significantly
  
  // Soften the sheen for the reflection
  mat.sheen = isReflection ? 0.2 : 0.95;
  mat.sheenColor = new THREE.Color(isReflection ? "#999999" : "#ffffff");
}else {
  // Trust the glTF's baked environment map impact
  mat.envMapIntensity = 1; 
  
  // 🚀 Increase roughness to 0.6 or 0.7. 
  // This makes the light spread out and shows the feather textures better.
  mat.roughness = 0.65; 
}

        mat.flatShading = false;
        mat.transparent = opacity < 1;
        mat.depthWrite = true;
        mat.depthTest = true;

        // 🚀 3. APPLY BLADE SAFELY
        if (clipPlaneRef.current) {
          mat.clippingPlanes = [clipPlaneRef.current];
        } else {
          mat.clippingPlanes = null; // Destroys inherited blades from cache
        }

        mat.needsUpdate = true;
        child.material = mat; 
        materialsRef.current.push(mat);
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
     {!isReflection && (
  <>
    {/* Ambient light provides the base visibility in shadows */}
    <ambientLight intensity={0.4} color="#ffffff" />
    
    {/* 🚀 Lower the intensity. 2.5 is too much for a white swan. 
        Start with 1.2 and adjust slowly. */}
    <directionalLight 
      intensity={1.2} 
      color="#ffffff" 
      position={[10, 20, 10]} 
      castShadow 
    />
    
    {/* 'city' is good, but 'warehouse' or 'apartment' often provides 
        better 'Neutral' shading for white models. */}
    <Environment preset="warehouse" /> 
  </>
)}
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 28, 28]} />
      <meshPhysicalMaterial
        color="#000"

        transmission={1}
        thickness={1.2}          // ⭐ thicker = stronger depth
        ior={1.33}

        roughness={0.01}         // sharper reflections
        metalness={0}

        clearcoat={1}
        clearcoatRoughness={0}

        envMapIntensity={4}      // ⭐ stronger reflections

        attenuationColor="#f8f8f8"     // inner water tint
        attenuationDistance={0.35}     // core darkening

        transparent={true}
        opacity={opacity}



        depthWrite
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
export const WaterPlane = ({ splashProgress, opacity = 1 }: { splashProgress: number, opacity?: number }) => {
  const reflectorRef = useRef<any>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const geometry = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);

  const reflector = useMemo(() => {
    const refl = new Reflector(geometry, {
      textureWidth: isMobile ? 1024 : 2048,
      textureHeight: isMobile ? 1024 : 2048,
      color: 0x0a0a0a,
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
  
  // 1. Calculate distance from the surface
  // We use this to make things blurrier/wavier as they go deeper
  float distFromSurface = smoothstep(0.55, 0.1, projectedY); 

  // 2. LOWERED WAVE DISTORTION
  // Reduced frequency (40.0 -> 20.0) and amplitude (0.02 -> 0.008)
  vec2 baseUV = vUv.xy / vUv.w;
  float ripple = sin(baseUV.x * 20.0 + uTime * 1.5) * cos(baseUV.y * 15.0 + uTime * 1.0);
  vec2 distortion = vec2(ripple) * (distFromSurface * 0.008); 

  // 3. BALANCED BLUR
  // Slightly tighter blur so the neck stays recognizable
  float blurSize = distFromSurface * 0.008; 
  
  vec4 blurSum = vec4(0.0);
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w), vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(blurSize, blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(-blurSize, blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(blurSize, -blurSize) * vUv.w, vUv.zw));
  blurSum += texture2DProj(tDiffuse, vec4(vUv.xy + (distortion * vUv.w) + vec2(-blurSize, -blurSize) * vUv.w, vUv.zw));
  
  vec4 base = blurSum / 5.0;

  // 4. LOWERED BRIGHTNESS
  // Changed from 1.1/1.3 down to 0.7 to prevent the 'blown out' look
  float brightness = dot(base.rgb, vec3(0.299, 0.587, 0.114));
  base.rgb = vec3(brightness * 0.75); 

  // 5. EXTENDED NECK VISIBILITY
  // Lowered the start of the fade (0.3 -> 0.15) so the neck shows more
  float verticalFade = smoothstep(0.15, 0.6, projectedY);
  base.a *= verticalFade;
  `
);
      reflectorRef.current = { userData: { shader } };
    };
    return refl;
  }, [geometry, isMobile]);

  useFrame(() => {
    if (reflectorRef.current?.userData.shader) {
      const scrollSpeedMultiplier = 30.0;
      reflectorRef.current.userData.shader.uniforms.uTime.value = splashProgress * scrollSpeedMultiplier;
      reflectorRef.current.userData.shader.uniforms.uTakeoff.value = splashProgress;
    }
  });

  return <primitive object={reflector} />;
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
          gl={{
            antialias: true,
            toneMappingExposure: 0.44,
            toneMapping: THREE.LinearToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: "high-performance"
          }}
          onCreated={() => setIsReady(true)}
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight
            intensity={1.51}
            color="#ffffff"
          />
          <directionalLight
            position={[10, 20, 10]}
            intensity={2.2}
          />

<directionalLight
  position={[5, 10, 5]}
  intensity={1.5}
  color="#ffffff"
/>
          <spotLight
            position={[0, 16, 11]}
            intensity={2.35}
            angle={0.34}
            penumbra={0.9}
            color="#ffffff"
          />
          <pointLight position={[10, 10, 10]} intensity={0.95} color="#f4f7ff" />
          <spotLight position={[-10, 20, 10]} angle={0.24} penumbra={1} intensity={1.7} color="#d9ecff" />
          {/* Base position is [0,0,70], interaction takes over Y via useFrame */}
          <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={isMobile ? 65 : 40} />

          <Suspense fallback={null}>
            <SwanModel scrollProgress={scrollProgress} transformProgress={transformProgress} />
            <WaterPlane splashProgress={splashProgress} />
            <SplashDroplets splashProgress={splashProgress} />
            <SplashWalls splashProgress={splashProgress} />
            <Environment  background={false} />
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
