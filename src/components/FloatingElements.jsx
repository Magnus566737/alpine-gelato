import { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import "./FloatingElements.css";

function createLemonTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = "#f6e27a";
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fdf3b0";
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 22, 0, Math.PI * 2);
  ctx.fill();

  const wedges = 10;
  ctx.strokeStyle = "rgba(214, 178, 40, 0.55)";
  ctx.lineWidth = 3;
  for (let i = 0; i < wedges; i++) {
    const a = (i / wedges) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * (size / 2 - 22), cy + Math.sin(a) * (size / 2 - 22));
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function LemonSlice(props) {
  const ref = useRef(null);
  const map = useMemo(() => createLemonTexture(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z += 0.0035;
    ref.current.position.y = props.baseY + Math.sin(t * 0.5) * 0.15;
  });

  return (
    <group ref={ref} position={[0, props.baseY, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[1, 1, 0.12, 48]} />
        <meshStandardMaterial attach="material-0" color="#e8c94a" roughness={0.6} />
        <meshStandardMaterial attach="material-1" map={map} roughness={0.4} />
        <meshStandardMaterial attach="material-2" map={map} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Rosemary(props) {
  const ref = useRef(null);

  const needles = useMemo(() => {
    const list = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const side = i % 2 === 0 ? 1 : -1;
      list.push({
        y: -0.9 + t * 1.8,
        angle: side * (0.9 + t * 0.3),
        len: 0.42 - t * 0.18,
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y += 0.002;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.08;
  });

  return (
    <group ref={ref} position={[0, props.baseY, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.04, 2, 8]} />
        <meshStandardMaterial color="#6b5636" roughness={0.8} />
      </mesh>
      {needles.map((n, i) => (
        <mesh key={i} position={[0, n.y, 0]} rotation={[0, 0, n.angle]}>
          <coneGeometry args={[0.045, n.len, 6]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#4a6b3a" : "#5c7f46"} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function WineGlass(props) {
  const ref = useRef(null);

  const profile = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.5, 0),
      new THREE.Vector2(0.52, 0.02),
      new THREE.Vector2(0.1, 0.06),
      new THREE.Vector2(0.06, 0.5),
      new THREE.Vector2(0.05, 0.55),
      new THREE.Vector2(0.42, 0.85),
      new THREE.Vector2(0.5, 1.05),
      new THREE.Vector2(0.48, 1.3),
      new THREE.Vector2(0.3, 1.5),
      new THREE.Vector2(0.28, 1.52),
      new THREE.Vector2(0, 1.52),
    ];
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y += 0.0025;
    ref.current.position.y = props.baseY + Math.sin(t * 0.45 + 1) * 0.1;
  });

  return (
    <group ref={ref} position={[0, props.baseY, 0]} scale={0.85}>
      <mesh castShadow>
        <latheGeometry args={[profile, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.28}
          roughness={0.05}
          metalness={0}
          transmission={0.9}
          thickness={0.4}
          ior={1.4}
        />
      </mesh>
    </group>
  );
}

function Scene({ variant }) {
  return (
    <>
      <ambientLight intensity={1.1} color="#fff7ea" />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#fff2d6" castShadow />
      <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={null}>
        {variant === "lemon" && <LemonSlice baseY={0} />}
        {variant === "rosemary" && <Rosemary baseY={0} />}
        {variant === "wine" && <WineGlass baseY={-0.3} />}
        <ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={4} blur={2.2} far={1.6} color="#8c6a3a" />
      </Suspense>
    </>
  );
}

export function FloatingObject({ variant = "lemon", className = "" }) {
  return (
    <div className={`floating-object ${className}`}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 4], fov: 32 }} gl={{ alpha: true }}>
        <Scene variant={variant} />
      </Canvas>
    </div>
  );
}

export default function FloatingElements() {
  return (
    <div className="floating-strip" aria-hidden="true">
      <FloatingObject variant="lemon" className="fo-lemon" />
      <FloatingObject variant="rosemary" className="fo-rosemary" />
      <FloatingObject variant="wine" className="fo-wine" />
    </div>
  );
}
