import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

// Per-mesh explode behavior, keyed by the GLB's own node names.
// "bun" fuses the top and bottom bun into a single mesh in this export, and
// "vegeis" fuses the patty, cheese, tomato and sauce into one mesh — this
// particular free model doesn't ship those as separate parts. Rather than
// pretend they physically separate, "vegeis" gets FOUR labels that cross-
// fade in sequence near the same floating piece as it explodes, calling out
// each ingredient in turn. The lettuce leaves are genuinely separate meshes
// and fan out independently.
const EXPLODE_CONFIG = {
  bun: {
    offset: 0.9,
    x: -0.4,
    z: 0,
    spin: 0.12,
    labels: [{ text: "Brioche Bun — Baked Daily", from: 0.06, to: 0.94 }],
  },
  vegeis: {
    offset: 2.4,
    x: 0.55,
    z: 0.15,
    spin: -0.22,
    labels: [
      { text: "180g Wagyu Blend", from: 0.1, to: 0.32 },
      { text: "Aged Cheddar — Melted", from: 0.28, to: 0.5 },
      { text: "Beef Tomato", from: 0.46, to: 0.68 },
      { text: "House Sauce", from: 0.64, to: 0.9 },
    ],
  },
  pPlane14: {
    offset: 3.8,
    x: 1.3,
    z: 0.7,
    spin: 0.4,
    labels: [{ text: "Crispy Iceberg", from: 0.08, to: 0.94 }],
  },
  pPlane15: { offset: 4.3, x: -1.2, z: 0.85, spin: -0.35 },
  pPlane16: { offset: 4.8, x: 1.0, z: -1.0, spin: 0.3 },
  pPlane17: { offset: 5.3, x: -1.3, z: -0.7, spin: -0.28 },
};

// Canvas runs frameloop="demand" (see Hero.jsx) so nothing redraws while the
// tab is backgrounded or the burger is sitting still. Anything that animates
// on its own — the idle turntable, the camera bob — has to explicitly call
// invalidate() each frame it's active, and Hero's GSAP scroll handler (which
// lives outside the Canvas) needs a way to request a frame too. This bridge
// hands that `invalidate` function out to a ref Hero can call directly.
function InvalidateBridge({ invalidateRef }) {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidateRef.current = invalidate;
  }, [invalidate, invalidateRef]);
  return null;
}

function CameraLife({ cameraRef, idleRef, baseYRef }) {
  useFrame(({ invalidate }) => {
    const camera = cameraRef.current;
    if (!camera) return;
    const idle = idleRef.current;
    const t = performance.now() * 0.001;
    camera.position.y = baseYRef.current + Math.sin(t * 0.5 + 1.3) * 0.08 * idle;
    if (idle > 0.001) invalidate();
  });
  return null;
}

function BurgerModel({ registerRef, registerLabelRef, idleRef }) {
  const { scene } = useGLTF("/burger.glb");
  const groupRef = useRef(null);

  const prepared = useMemo(() => {
    const cloned = scene.clone(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const scale = 6.4 / Math.max(size.x, size.y, size.z);

    const meshes = [];
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.userData.explode =
          EXPLODE_CONFIG[child.parent?.name] || EXPLODE_CONFIG[child.name] || { offset: 1, x: 0, z: 0, spin: 0 };
        child.userData.labelAnchor = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
        // The source materials are quite glossy (low roughness), which
        // combined with an environment map turns into a shiny, "plastic"
        // look. Flatten the specular response so it reads as food, not toy.
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (!mat) return;
          if (mat.roughness !== undefined) mat.roughness = Math.max(mat.roughness, 0.82);
          if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness, 0.04);
          if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 0.35;
        });
        meshes.push(child);
      }
    });

    return { cloned, center, scale, meshes };
  }, [scene]);

  const { invalidate } = useThree();

  useEffect(() => {
    prepared.meshes.forEach((mesh) => registerRef(mesh.uuid, mesh));
    // frameloop="demand" only renders in response to invalidate(); R3F's
    // implicit auto-invalidate on scene-graph changes doesn't reliably fire
    // for a pre-built object3D dropped in via <primitive>, so kick the very
    // first frame explicitly once the model has mounted.
    invalidate();
  }, [prepared, registerRef, invalidate]);

  const IDLE_SWING = THREE.MathUtils.degToRad(15);

  useFrame(({ invalidate }) => {
    if (!groupRef.current) return;
    const idle = idleRef.current;
    const t = performance.now() * 0.001;
    // Gentle product-shot turntable: oscillates within a narrow arc rather
    // than spinning all the way around.
    groupRef.current.rotation.y = Math.sin(t * 0.35) * IDLE_SWING * idle;
    groupRef.current.position.y = -0.4 + Math.sin(t * 0.6) * 0.14 * idle;
    if (idle > 0.001) invalidate();
  });

  const labelEntries = [];
  prepared.meshes.forEach((mesh) => {
    (mesh.userData.explode.labels || []).forEach((labelCfg, i) => {
      labelEntries.push({ mesh, labelCfg, key: `${mesh.uuid}-${i}`, index: i });
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      <group scale={prepared.scale}>
        <primitive
          object={prepared.cloned}
          position={[-prepared.center.x, -prepared.center.y, -prepared.center.z]}
        />
        {labelEntries.map(({ mesh, labelCfg, key, index }) => (
          <LayerLabel
            key={key}
            labelKey={key}
            mesh={mesh}
            labelCfg={labelCfg}
            index={index}
            center={prepared.center}
            registerLabelRef={registerLabelRef}
          />
        ))}
      </group>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={11} blur={2} far={2.6} resolution={512} color="#6b4a24" />
    </group>
  );
}

function LayerLabel({ mesh, labelCfg, index, center, labelKey, registerLabelRef }) {
  const setRef = useCallback((el) => registerLabelRef(labelKey, { el, from: labelCfg.from, to: labelCfg.to }), [
    labelKey,
    labelCfg.from,
    labelCfg.to,
    registerLabelRef,
  ]);
  const anchor = mesh.userData.labelAnchor;
  const side = mesh.userData.explode.x >= 0 ? 1 : -1;
  const localPos = [
    anchor.x - center.x + side * 1.7,
    anchor.y - center.y + index * 0.02,
    anchor.z - center.z,
  ];

  return (
    <Html center distanceFactor={9.5} position={localPos} zIndexRange={[20, 0]} occlude={false}>
      <div ref={setRef} className={`burger-label ${side > 0 ? "right" : "left"}`}>
        <span className="burger-label-dot" />
        <p>{labelCfg.text}</p>
      </div>
    </Html>
  );
}

export default function BurgerScene({ cameraRef, registerRef, registerLabelRef, idleRef, invalidateRef, cameraBaseYRef }) {
  return (
    <>
      <InvalidateBridge invalidateRef={invalidateRef} />
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1.9, 12]} fov={28} near={0.1} far={100} />
      <CameraLife cameraRef={cameraRef} idleRef={idleRef} baseYRef={cameraBaseYRef} />

      {/* Painted in explicitly (rather than relying on canvas alpha) because
          EffectComposer renders to an opaque target and would otherwise
          show through as black. */}
      <color attach="background" args={["#faf7f2"]} />

      <ambientLight intensity={0.65} color="#fff7ea" />
      {/* Key light: warm gold from top-right */}
      <spotLight
        position={[6.5, 9.5, 4.5]}
        angle={0.48}
        penumbra={0.75}
        intensity={4.2}
        color="#ffc773"
        distance={24}
        castShadow
      />
      {/* Soft fill from the opposite side so shadows don't crush to black */}
      <spotLight position={[-4, 4, -2]} angle={0.6} penumbra={0.9} intensity={1} color="#fffaf0" distance={16} />
      <directionalLight position={[0, 6, 6]} intensity={0.15} color="#ffffff" />
      {/* Soft top point light */}
      <pointLight position={[0, 7, 1]} intensity={3} color="#fff5e0" distance={18} decay={2} />

      <Suspense fallback={null}>
        {/* "restaurant" isn't a valid drei Environment preset — the actual
            list is apartment/city/dawn/forest/lobby/night/park/studio/
            sunset/warehouse. "lobby" is the closest indoor-hospitality match. */}
        <Environment preset="lobby" environmentIntensity={0.18} background={false} />
        <group position={[0, -1.5, 0]}>
          <BurgerModel registerRef={registerRef} registerLabelRef={registerLabelRef} idleRef={idleRef} />
        </group>
      </Suspense>

      {/* TEMP DEBUG: disabled to isolate demand-mode blank-canvas bug
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={1.3} height={480} />
      </EffectComposer>
      */}
    </>
  );
}

useGLTF.preload("/burger.glb");
