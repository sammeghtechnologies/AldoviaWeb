
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Reflector } from "three-stdlib";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


export const WaterPlane = ({ splashProgress, opacity }: { splashProgress: number, opacity: number }) => {
  const reflectorRef = useRef<any>(null);
  const timeRef = useRef(0);
  const geometry = useMemo(() => new THREE.PlaneGeometry(5000, 5000), []);

  const reflector = useMemo(() => {
    const refl = new Reflector(geometry, { textureWidth: isMobile ? 1024 : 2048, textureHeight: isMobile ? 1024 : 2048, color: 0x808080 });
    refl.rotation.x = -Math.PI / 2;
    refl.position.y = -15;
    const material = refl.material as THREE.ShaderMaterial;
    material.transparent = true;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uTakeoff = { value: 0 };
      shader.uniforms.uFade = { value: 1.0 }; 
      
      shader.fragmentShader = `uniform float uTime; uniform float uTakeoff; uniform float uFade;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        `vec4 base = texture2DProj( tDiffuse, vUv );`,
        `float projectedY = vUv.y / vUv.w;
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
        vec4 base = texture2DProj(tDiffuse, vec4(vUv.xy + (totalDistortion * vUv.w), vUv.zw));`
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        `gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );`,
        `gl_FragColor = vec4( blendOverlay( base.rgb, color ), uFade );`
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
      reflectorRef.current.userData.shader.uniforms.uFade.value = opacity; 
    }
  });

  return <primitive object={reflector} visible={opacity > 0} />;
};