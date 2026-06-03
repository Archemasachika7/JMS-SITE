"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Rotating wireframe torus knot — an elegant mathematical surface ─── */
function Knot() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.18;
    ref.current.rotation.y = t * 0.26;
  });

  return (
    <group ref={ref}>
      {/* Solid translucent core */}
      <mesh>
        <torusKnotGeometry args={[1.15, 0.36, 220, 32, 2, 3]} />
        <meshStandardMaterial
          color="#7f1d1d"
          emissive="#f43f5e"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Cyan wireframe overlay */}
      <mesh scale={1.005}>
        <torusKnotGeometry args={[1.15, 0.36, 200, 24, 2, 3]} />
        <meshBasicMaterial color="#f43f5e" wireframe transparent opacity={0.5} />
      </mesh>
      {/* Violet outer wireframe shell */}
      <mesh scale={1.45}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#fb7185" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ─── Drifting field of points (lattice) ─── */
function PointField() {
  const ref = useRef<THREE.Points>(null);
  const count = 140;
  const positions = useRef<Float32Array>();
  if (!positions.current) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    positions.current = arr;
  }

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#fda4af" transparent opacity={0.7} />
    </points>
  );
}

export default function MathObject3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.1} color="#f43f5e" />
      <pointLight position={[-5, -3, 2]} intensity={0.8} color="#fb7185" />
      <Suspense fallback={null}>
        <Knot />
        <PointField />
      </Suspense>
    </Canvas>
  );
}
