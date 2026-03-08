"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import StarTooltip from "./StarTooltip";
import MemberProfileCard from "./MemberProfileCard";
import { resolveTier } from "@/lib/memberUtils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MemberProfile {
  id: string;
  name: string;
  profile_image: string;
  plan: string;
  role: string;
  bio: string;
}

interface StarData {
  userId: string;
  name: string;
  profileImage: string;
  bio: string;
  tier: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const tierColors: Record<string, string> = {
  free: "#ADD8E6",
  monthly: "#FFD700",
  annual: "#FF8C00",
  core: "#FF00FF",
};

const GALAXY_RADIUS = 50;
const SPIRAL_ARMS = 4;
const BG_STAR_COUNT = 2000;
const MAX_MEMBERS = 500;
const MIN_GALAXY_STARS = 200;
const CONSTELLATION_MAX_DIST = 15;
const MAX_CONSTELLATION_CONNECTIONS = 200;
const CONSTELLATION_PROBABILITY = 0.6;
const RAYCAST_THRESHOLD = 1.5;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRGB(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function getTierStarSize(tier: string): number {
  switch (tier) {
    case "core":
      return 4.0;
    case "annual":
      return 2.8;
    case "monthly":
      return 2.2;
    default:
      return 1.6;
  }
}

function getSpiralPosition(index: number, total: number): THREE.Vector3 {
  const arm = index % SPIRAL_ARMS;
  const armAngle = (arm / SPIRAL_ARMS) * Math.PI * 2;
  const t =
    Math.floor(index / SPIRAL_ARMS) /
    Math.max(1, Math.ceil(total / SPIRAL_ARMS));
  const distance = t * GALAXY_RADIUS;
  const spiralAngle = armAngle + t * Math.PI * 3;

  const spread = 2.5 * (1 + t);
  const rx = (Math.random() - 0.5) * spread;
  const rz = (Math.random() - 0.5) * spread;
  const ry = (Math.random() - 0.5) * 1.5 * (1 - t * 0.5);

  return new THREE.Vector3(
    Math.cos(spiralAngle) * distance + rx,
    ry,
    Math.sin(spiralAngle) * distance + rz,
  );
}

function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.15, "rgba(255,255,255,0.7)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */

const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aRandom;
  attribute vec3 aColor;

  varying vec3 vColor;

  uniform float uTime;

  void main() {
    vColor = aColor;
    float flicker = 1.0 + 0.12 * sin(uTime * 2.0 + aRandom * 6.2831);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * flicker * (200.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  varying vec3 vColor;

  void main() {
    vec4 tex = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor, 1.0) * tex;
  }
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MemberStarMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    galaxyGroup: THREE.Group;
    starPoints: THREE.Points | null;
    starData: StarData[];
    baseSizes: Float32Array;
    animId: number;
  } | null>(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    profileImage: "",
    membershipPlan: "",
  });

  const [profileCard, setProfileCard] = useState({
    visible: false,
    userId: "",
    name: "",
    profileImage: "",
    bio: "",
    membershipPlan: "",
  });

  /* ---------- Build galaxy from member data ---------- */

  const buildGalaxy = useCallback(
    (galaxyGroup: THREE.Group, members: MemberProfile[]) => {
      // Dispose previous children
      while (galaxyGroup.children.length > 0) {
        const child = galaxyGroup.children[0];
        galaxyGroup.remove(child);
        if (
          child instanceof THREE.Points ||
          child instanceof THREE.LineSegments
        ) {
          child.geometry.dispose();
          const mat = child.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      }

      const memberCount = Math.min(members.length, MAX_MEMBERS);
      const fillerCount = Math.max(0, MIN_GALAXY_STARS - memberCount);
      const totalStars = memberCount + fillerCount;

      const positions = new Float32Array(totalStars * 3);
      const colors = new Float32Array(totalStars * 3);
      const sizes = new Float32Array(totalStars);
      const randoms = new Float32Array(totalStars);
      const starData: StarData[] = [];

      // --- Member stars ---
      for (let i = 0; i < memberCount; i++) {
        const p = members[i];
        const tier = resolveTier(p.role, p.plan);
        const pos = getSpiralPosition(i, totalStars);
        const [r, g, b] = hexToRGB(tierColors[tier] || tierColors.free);

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
        sizes[i] = getTierStarSize(tier);
        randoms[i] = Math.random();

        starData.push({
          userId: p.id,
          name: p.name || "AstroSci Member",
          profileImage: p.profile_image || "",
          bio: p.bio || "",
          tier,
        });
      }

      // --- Filler stars (dimmer, non-interactive) ---
      for (let i = memberCount; i < totalStars; i++) {
        const pos = getSpiralPosition(i, totalStars);
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.5;
        sizes[i] = 0.6 + Math.random() * 0.4;
        randoms[i] = Math.random();
      }

      // --- Points geometry ---
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      const texture = createGlowTexture();
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: texture },
        },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      galaxyGroup.add(points);

      // --- Constellation connections ---
      const connectionVerts: number[] = [];

      // Connect core team members
      const coreIndices = starData
        .map((s, i) => (s.tier === "core" ? i : -1))
        .filter((i) => i >= 0);

      for (let i = 0; i < coreIndices.length; i++) {
        for (let j = i + 1; j < coreIndices.length; j++) {
          const a = coreIndices[i] * 3;
          const b = coreIndices[j] * 3;
          connectionVerts.push(
            positions[a],
            positions[a + 1],
            positions[a + 2],
            positions[b],
            positions[b + 1],
            positions[b + 2],
          );
        }
      }

      // Connect nearby same-tier stars
      const tierBuckets: Record<string, number[]> = {};
      starData.forEach((s, i) => {
        if (s.tier === "core") return;
        if (!tierBuckets[s.tier]) tierBuckets[s.tier] = [];
        tierBuckets[s.tier].push(i);
      });

      for (const indices of Object.values(tierBuckets)) {
        for (
          let i = 0;
          i < indices.length && connectionVerts.length / 6 < MAX_CONSTELLATION_CONNECTIONS;
          i++
        ) {
          for (let j = i + 1; j < indices.length; j++) {
            const ai = indices[i] * 3;
            const bi = indices[j] * 3;
            const dx = positions[ai] - positions[bi];
            const dy = positions[ai + 1] - positions[bi + 1];
            const dz = positions[ai + 2] - positions[bi + 2];
            const distSq = dx * dx + dy * dy + dz * dz;
            if (
              distSq < CONSTELLATION_MAX_DIST * CONSTELLATION_MAX_DIST &&
              Math.random() > CONSTELLATION_PROBABILITY
            ) {
              connectionVerts.push(
                positions[ai],
                positions[ai + 1],
                positions[ai + 2],
                positions[bi],
                positions[bi + 1],
                positions[bi + 2],
              );
            }
          }
        }
      }

      if (connectionVerts.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(connectionVerts, 3),
        );
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        galaxyGroup.add(new THREE.LineSegments(lineGeo, lineMat));
      }

      return { points, starData, baseSizes: new Float32Array(sizes) };
    },
    [],
  );

  /* ---------- Scene lifecycle ---------- */

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000408);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 30, 60);
    camera.lookAt(0, 0, 0);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- OrbitControls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 200;
    controls.minDistance = 10;
    controls.enablePan = false;

    // --- Galaxy group (rotates as a whole) ---
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // --- Deep-space background stars ---
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(BG_STAR_COUNT * 3);
    for (let i = 0; i < BG_STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 350;
      bgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i * 3 + 2] = r * Math.cos(phi);
    }
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 0.4,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // --- Subtle nebula glow (large additive blobs) ---
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array([
      -30, 5, -40, 40, -8, 20, -10, 10, 50, 25, -5, -35,
    ]);
    const nebulaColors = new Float32Array([
      0.3, 0.1, 0.5, 0.1, 0.2, 0.5, 0.4, 0.1, 0.3, 0.1, 0.3, 0.4,
    ]);
    nebulaGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nebulaPositions, 3),
    );
    nebulaGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(nebulaColors, 3),
    );
    const nebulaMat = new THREE.PointsMaterial({
      size: 60,
      vertexColors: true,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    // --- Store scene refs ---
    sceneRef.current = {
      renderer,
      scene,
      camera,
      controls,
      galaxyGroup,
      starPoints: null,
      starData: [],
      baseSizes: new Float32Array(0),
      animId: 0,
    };

    // --- Raycasting ---
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: RAYCAST_THRESHOLD };
    const mouseNDC = new THREE.Vector2();
    let hoveredIdx = -1;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNDC, camera);

      const ref = sceneRef.current;
      if (!ref?.starPoints) return;

      const hits = raycaster.intersectObject(ref.starPoints);
      if (
        hits.length > 0 &&
        hits[0].index != null &&
        hits[0].index < ref.starData.length
      ) {
        const idx = hits[0].index;
        hoveredIdx = idx;
        const d = ref.starData[idx];
        renderer.domElement.style.cursor = "pointer";
        setTooltip({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          name: d.name,
          profileImage: d.profileImage,
          membershipPlan: d.tier,
        });
      } else {
        hoveredIdx = -1;
        renderer.domElement.style.cursor = "default";
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const onPointerClick = () => {
      const ref = sceneRef.current;
      if (!ref || hoveredIdx < 0 || hoveredIdx >= ref.starData.length) return;
      const d = ref.starData[hoveredIdx];
      setProfileCard({
        visible: true,
        userId: d.userId,
        name: d.name,
        profileImage: d.profileImage,
        bio: d.bio,
        membershipPlan: d.tier,
      });
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onPointerClick);

    // --- Resize handler ---
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- Animation loop ---
    const clock = new THREE.Clock();

    function animate() {
      const ref = sceneRef.current;
      if (!ref) return;
      ref.animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Slow galaxy rotation
      ref.galaxyGroup.rotation.y = elapsed * 0.05;

      // Update shader time + hover scale
      if (ref.starPoints) {
        const mat = ref.starPoints.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = elapsed;

        const sizeAttr = ref.starPoints.geometry.getAttribute("aSize");
        const arr = sizeAttr.array as Float32Array;
        for (let i = 0; i < ref.baseSizes.length; i++) {
          arr[i] = i === hoveredIdx ? ref.baseSizes[i] * 2.0 : ref.baseSizes[i];
        }
        (sizeAttr as THREE.BufferAttribute).needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // --- Load member data ---
    async function loadMembers() {
      let members: MemberProfile[];

      if (!isSupabaseConfigured()) {
        // Demo data when Supabase is not configured
        members = [
          { id: "1", name: "Alice", profile_image: "", plan: "", role: "admin", bio: "Core team leader" },
          { id: "2", name: "Bob", profile_image: "", plan: "annual", role: "", bio: "Annual subscriber" },
          { id: "3", name: "Charlie", profile_image: "", plan: "monthly", role: "", bio: "Monthly subscriber" },
          { id: "4", name: "Dave", profile_image: "", plan: "", role: "", bio: "Free member" },
        ];
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, profile_image, plan, role, bio")
          .limit(MAX_MEMBERS);

        if (error) {
          console.warn("[galaxy] fetch error:", error.message);
          return;
        }
        members = (data || []) as MemberProfile[];
      }

      // Pause animation on the old points while rebuilding
      if (sceneRef.current) sceneRef.current.starPoints = null;
      hoveredIdx = -1;

      const result = buildGalaxy(galaxyGroup, members);
      if (sceneRef.current) {
        sceneRef.current.starPoints = result.points;
        sceneRef.current.starData = result.starData;
        sceneRef.current.baseSizes = result.baseSizes;
      }
    }

    loadMembers();

    // Realtime subscription for new members
    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured()) {
      channel = supabase
        .channel("galaxy-profiles")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "profiles" },
          () => {
            loadMembers();
          },
        )
        .subscribe();
    }

    // --- Cleanup ---
    return () => {
      if (sceneRef.current) cancelAnimationFrame(sceneRef.current.animId);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onPointerClick);
      window.removeEventListener("resize", onResize);
      if (channel) supabase.removeChannel(channel);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [buildGalaxy]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <StarTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        name={tooltip.name}
        profileImage={tooltip.profileImage}
        membershipPlan={tooltip.membershipPlan}
      />
      <MemberProfileCard
        visible={profileCard.visible}
        onClose={() =>
          setProfileCard((prev) => ({ ...prev, visible: false }))
        }
        userId={profileCard.userId}
        name={profileCard.name}
        profileImage={profileCard.profileImage}
        bio={profileCard.bio}
        membershipPlan={profileCard.membershipPlan}
      />
    </div>
  );
}
