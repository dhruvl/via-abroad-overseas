"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/utils/geo";
import { originIndia, highlightedGlobeRoutes } from "@/data/destinations";

const RADIUS = 2.15;

function DestinationNode({ position }: { position: [number, number, number] }) {
  const ref = React.useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 2 + position[0]) * 0.15;
    ref.current.scale.setScalar(scale);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.028, 12, 12]} />
      <meshBasicMaterial color="#e2c569" />
    </mesh>
  );
}

function RouteArc({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const mid = new THREE.Vector3(
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  )
    .normalize()
    .multiplyScalar(RADIUS * 1.35);

  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={mid.toArray()}
      color="#d4af37"
      lineWidth={1}
      transparent
      opacity={0.55}
      dashed={false}
    />
  );
}

function GlobeGroup() {
  const groupRef = React.useRef<THREE.Group>(null);
  const pointer = React.useRef({ x: 0, y: 0 });
  const { size } = useThree();

  React.useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.045;
    const targetX = pointer.current.y * 0.12;
    const targetZ = -pointer.current.x * 0.1;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.03;
  });

  const origin = latLngToVector3(originIndia.lat, originIndia.lng, RADIUS);

  return (
    <group ref={groupRef} scale={size.width < 640 ? 0.8 : 1}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#122a4d"
          transparent
          opacity={0.55}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.001, 24, 24]} />
        <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.08, 32, 32]} />
        <meshBasicMaterial color="#35619f" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      <mesh position={origin}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {highlightedGlobeRoutes.map((destination) => {
        const end = latLngToVector3(
          destination.coordinates.lat,
          destination.coordinates.lng,
          RADIUS
        );
        return (
          <React.Fragment key={destination.slug}>
            <RouteArc start={origin} end={end} />
            <DestinationNode position={end} />
          </React.Fragment>
        );
      })}
    </group>
  );
}

export function GlobeScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 3, 5]} intensity={40} color="#e2c569" />
      <pointLight position={[-5, -3, -5]} intensity={15} color="#35619f" />
      <GlobeGroup />
    </Canvas>
  );
}
