"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Ring, Line } from "@react-three/drei";
import * as THREE from "three";

/* ─── Sun (central star) ─── */
function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      {/* Mid glow */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      {/* Sun body */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          roughness={0.3}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} color="#fde68a" distance={12} />
    </group>
  );
}

/* ─── Planet helper ─── */
interface PlanetProps {
  orbitRadius: number;
  size: number;
  color: string;
  emissive?: string;
  speed: number;
  initialAngle: number;
  tilt?: number;
  hasRing?: boolean;
  ringColor?: string;
  hasMoon?: boolean;
}

function OrbitingPlanet({
  orbitRadius,
  size,
  color,
  emissive,
  speed,
  initialAngle,
  tilt = 0,
  hasRing = false,
  ringColor,
  hasMoon = false,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = initialAngle + t * speed;

    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.008;
    }
    if (moonRef.current) {
      const moonAngle = t * 2.5;
      const moonDist = size * 2.5;
      moonRef.current.position.x = Math.cos(moonAngle) * moonDist;
      moonRef.current.position.z = Math.sin(moonAngle) * moonDist;
      moonRef.current.position.y = Math.sin(moonAngle * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Saturn-like ring */}
      {hasRing && (
        <Ring args={[size * 1.4, size * 2.2, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshBasicMaterial
            color={ringColor || "#c4b5a0"}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}

      {/* Moon */}
      {hasMoon && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[size * 0.3, 16, 16]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

/* ─── Orbit path ring (visual only) ─── */
function OrbitPath({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius]);

  return <Line points={points} color="#38bdf8" transparent opacity={0.08} lineWidth={1} />;
}

/* ─── Tiny background stars ─── */
function Stars({ count = 300 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#e0e7ff" sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

/* ─── Scene composition ─── */
function SolarSystemScene() {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={sceneRef} rotation={[0.5, 0, 0.1]}>
      <Stars />
      <Sun />

      {/* Orbit paths */}
      <OrbitPath radius={1.6} />
      <OrbitPath radius={2.4} />
      <OrbitPath radius={3.3} />
      <OrbitPath radius={4.3} />
      <OrbitPath radius={5.8} />

      {/* Mercury */}
      <OrbitingPlanet
        orbitRadius={1.6}
        size={0.08}
        color="#a1887f"
        speed={0.9}
        initialAngle={0}
      />
      {/* Venus */}
      <OrbitingPlanet
        orbitRadius={2.4}
        size={0.12}
        color="#ff8a65"
        emissive="#e65100"
        speed={0.65}
        initialAngle={1.8}
      />
      {/* Earth + Moon */}
      <OrbitingPlanet
        orbitRadius={3.3}
        size={0.13}
        color="#2563eb"
        emissive="#1d4ed8"
        speed={0.5}
        initialAngle={3.5}
        hasMoon
      />
      {/* Mars */}
      <OrbitingPlanet
        orbitRadius={4.3}
        size={0.1}
        color="#d32f2f"
        emissive="#b71c1c"
        speed={0.38}
        initialAngle={5.2}
      />
      {/* Saturn */}
      <OrbitingPlanet
        orbitRadius={5.8}
        size={0.22}
        color="#e8c56d"
        emissive="#c9a227"
        speed={0.2}
        initialAngle={2.0}
        tilt={0.3}
        hasRing
        ringColor="#d4c5a0"
      />

      {/* Ambient + rim lights */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 5, 5]} intensity={0.4} color="#c4b5fd" />
    </group>
  );
}

/* ─── Exported wrapper ─── */
export default function SolarSystem3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: "300px" }}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#f59e0b]/30 to-[#0c1e3d] animate-pulse" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 6, 10], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <SolarSystemScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
