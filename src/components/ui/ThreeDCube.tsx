import React, { useEffect, useMemo, useRef, useState } from "react";
import CarouselControls from "./CarouselControls";

type Face = "front" | "left" | "right" | "back";
const spaFaceImages = {
  front: "/assets/pages/activities/spa/spa1.jpg",
  back: "/assets/pages/activities/spa/spa2.jpg",
  right: "/assets/pages/activities/spa/spa3.jpg",
  left: "/assets/pages/activities/spa/spa4.jpeg",
  top: "/assets/pages/activities/spa/spa5.jpeg",
  bottom: "/assets/pages/activities/spa/spa6.jpeg",
} as const;

interface ThreeDCubeProps {
  className?: string;
  images?: string[];
  enableScrollSpin?: boolean;
}

const ThreeDCube: React.FC<ThreeDCubeProps> = ({
  className = "",
  images = [],
  enableScrollSpin = true,
}) => {
  const MAX_TILT_X = 85;

  const cubeRef = useRef<HTMLDivElement>(null);
  const faces: Face[] = ["front", "right", "back", "left"];
  const [faceIndex, setFaceIndex] = useState(0);
  const [cubeSize, setCubeSize] = useState(250);
  const [hasInitialSpinCompleted, setHasInitialSpinCompleted] = useState(false);
  const [idleMotion, setIdleMotion] = useState({ y: 0, rotX: 0, rotY: 0, rotZ: 0 });
  const isDesktop = cubeSize >= 380;
  
  const [rotation, setRotation] = useState({ x: -1, y: 14 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const snapTimeout = useRef<number | null>(null);
  const introRafRef = useRef<number | null>(null);
  const depth = useMemo(() => cubeSize / 2, [cubeSize]);

  useEffect(() => {
    const updateCubeSize = () => {
      setCubeSize(window.innerWidth >= 1024 ? 380 : 250);
    };

    updateCubeSize();
    window.addEventListener("resize", updateCubeSize);
    return () => window.removeEventListener("resize", updateCubeSize);
  }, []);

  useEffect(() => {
    if (hasInitialSpinCompleted) return;

    const duration = 1700;
    const startY = 14;
    const endY = startY + 60;
    const startX = 0;
    const endX = 0;
    let startTime: number | null = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 6);

    const animate = (time: number) => {
      if (isDragging.current) {
        setHasInitialSpinCompleted(true);
        return;
      }

      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setRotation({
        x: startX + (endX - startX) * eased,
        y: startY + (endY - startY) * eased,
      });

      if (progress < 1) {
        introRafRef.current = window.requestAnimationFrame(animate);
        return;
      }

      setRotation({ x: 0, y: endY });
      setFaceIndex(0);
      setHasInitialSpinCompleted(true);
    };

    introRafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (introRafRef.current) window.cancelAnimationFrame(introRafRef.current);
    };
  }, [hasInitialSpinCompleted]);

  // Start Drag
  const startDrag = (x: number, y: number) => {
    isDragging.current = true;
    lastPosition.current = { x, y };
  };

  // During Drag
  const onDrag = (x: number, y: number) => {
    if (!isDragging.current) return;

    const deltaX = x - lastPosition.current.x;
    const deltaY = y - lastPosition.current.y;

    setRotation((prev) => ({
      x: Math.max(-MAX_TILT_X, Math.min(MAX_TILT_X, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));

    lastPosition.current = { x, y };
  };

  // End Drag
  const endDrag = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!enableScrollSpin) return;

    lastScrollY.current = window.scrollY;

    const snapToNearestFace = () => {
      setRotation((prev) => {
        const snappedY = Math.round(prev.y / 90) * 90;
        const normalized = ((snappedY % 360) + 360) % 360;
        const index = ((Math.round(normalized / 90) % faces.length) + faces.length) % faces.length;
        setFaceIndex(index);
        return { ...prev, y: snappedY };
      });
    };

    const onScroll = () => {
      if (isDragging.current) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      if (Math.abs(delta) < 1) return;

      setRotation((prev) => ({
        x: prev.x,
        y: prev.y + delta * 0.18,
      }));

      if (snapTimeout.current) window.clearTimeout(snapTimeout.current);
      snapTimeout.current = window.setTimeout(snapToNearestFace, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimeout.current) window.clearTimeout(snapTimeout.current);
    };
  }, [enableScrollSpin, faces.length]);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    const yAmplitude = isDesktop ? 10 : 7;
    const xAmplitude = isDesktop ? 1.8 : 1.2;
    const yRotAmplitude = isDesktop ? 2.6 : 1.8;
    const zAmplitude = isDesktop ? 1.4 : 0.9;
    const periodMs = isDesktop ? 3200 : 3400;

    const animateFloat = (time: number) => {
      const phase = ((time - start) / periodMs) * Math.PI * 2;
      if (isDragging.current) {
        setIdleMotion({ y: 0, rotX: 0, rotY: 0, rotZ: 0 });
      } else {
        setIdleMotion({
          y: Math.sin(phase) * yAmplitude,
          rotX: Math.sin(phase * 0.86) * xAmplitude,
          rotY: Math.cos(phase * 0.72) * yRotAmplitude,
          rotZ: Math.sin(phase * 0.65) * zAmplitude,
        });
      }
      rafId = window.requestAnimationFrame(animateFloat);
    };

    rafId = window.requestAnimationFrame(animateFloat);
    return () => window.cancelAnimationFrame(rafId);
  }, [isDesktop]);

  const cubeImages = {
    front: images[0] ?? spaFaceImages.front,
    back: images[1] ?? spaFaceImages.back,
    right: images[2] ?? spaFaceImages.right,
    left: images[3] ?? spaFaceImages.left,
    top: images[4] ?? spaFaceImages.top,
    bottom: images[5] ?? spaFaceImages.bottom,
  };

  const faceClassName = "absolute h-full w-full overflow-hidden rounded-[20px] bg-cover bg-center";
  const faceShadow = "0 38px 70px rgba(90, 46, 24, 0.24), 0 14px 26px rgba(102, 52, 27, 0.14)";
  const cubeStageSpacing = 58;
  const faceTransforms = [
    { key: "front", image: cubeImages.front, transform: `translateZ(${depth}px)` },
    { key: "back", image: cubeImages.back, transform: `rotateY(180deg) translateZ(${depth}px)` },
    { key: "right", image: cubeImages.right, transform: `rotateY(90deg) translateZ(${depth}px)` },
    { key: "left", image: cubeImages.left, transform: `rotateY(-90deg) translateZ(${depth}px)` },
    { key: "top", image: cubeImages.top, transform: `rotateX(90deg) translateZ(${depth}px)` },
    { key: "bottom", image: cubeImages.bottom, transform: `rotateX(-90deg) translateZ(${depth}px)` },
  ];

  return (
    <div className={`flex flex-col justify-center items-center py-24 ${className}`}>

      <div
        className="relative isolate touch-none perspective-[1000px] cursor-grab active:cursor-grabbing mt-8"
        style={{
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
          marginBottom: `${cubeStageSpacing}px`,
          filter: isDesktop
            ? "drop-shadow(0 96px 74px rgba(8,5,4,0.62))"
            : "drop-shadow(0 82px 64px rgba(8,5,4,0.58))",
        }}
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) =>
          startDrag(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchMove={(e) => {
          e.preventDefault();
          onDrag(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={endDrag}
      >
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] h-[64px] w-[86%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,6,5,0.68)_0%,rgba(10,6,5,0.3)_50%,rgba(10,6,5,0)_82%)] blur-lg" />
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%+26px)] h-[42px] w-[54%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,4,3,0.62)_0%,rgba(6,4,3,0)_78%)] blur-md" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ boxShadow: faceShadow }}
        />

        <div
          ref={cubeRef}
          className={`relative z-20 w-full h-full transform-style-3d ${
            hasInitialSpinCompleted ? "transition-transform duration-300 ease-out" : ""
          }`}
          style={{
            transform: `translateY(${idleMotion.y}px) rotateX(${rotation.x + idleMotion.rotX}deg) rotateY(${rotation.y + idleMotion.rotY}deg) rotateZ(${idleMotion.rotZ}deg)`,
          }}
        >
          {faceTransforms.map((face) => (
            <div
              key={`main-${face.key}`}
              className={faceClassName}
              style={{
                backgroundImage: `url(${face.image})`,
                transform: face.transform,
              }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,244,220,0.18),inset_0_-24px_34px_rgba(12,8,6,0.22)]" />
            </div>
          ))}
        </div>
      </div>
     {/* Controls */}
     <CarouselControls
        total={faces.length}
        index={faceIndex}
        onNext={() => {
          setFaceIndex((prev) => (prev + 1) % faces.length);
          setRotation((prev) => ({ ...prev, y: prev.y - 90 }));
        }}
        onPrev={() => {
          setFaceIndex((prev) => (prev - 1 + faces.length) % faces.length);
          setRotation((prev) => ({ ...prev, y: prev.y + 90 }));
        }}
        progressTrackColor="rgba(73,38,28,0.18)"
        progressFillColor="var(--color-secondary)"
        buttonColor="var(--color-secondary)"
        iconColor="var(--color-secondary)"
        className="!mt-14 lg:!mt-24 !mb-8 w-full max-w-[400px] !px-0"
        progressBarClassName="w-[160px] max-w-[160px] shrink-0 lg:!-ml-6"
        buttonsClassName="lg:!ml-40"
      />
    </div>
  );
};

export default ThreeDCube;
