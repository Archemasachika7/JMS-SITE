"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.position.y = Math.sin(t) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.0008;
      glowRef.current.position.y = Math.sin(t) * 0.1;
    }
  });

  return (
    <group>
      {/* Atmospheric glow - outer */}
      <mesh ref={glowRef} scale={1.25}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Atmospheric glow - inner ring */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Planet body */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#1e1b4b"
          roughness={0.8}
          metalness={0.2}
          distort={0.2}
          speed={1.5}
        />
      </Sphere>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 2, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#22d3ee" />
    </group>
  );
}

export default function Planet3D() {
  return (
    <div className="w-full h-full" style={{ minHeight: "300px" }}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#1e1b4b] animate-pulse" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Planet />
        </Canvas>
      </Suspense>
    </div>
  );
}
