import { useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BurgerScene from "./BurgerScene";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const TITLE_LINES = [["Smash."], ["Wagyu.", "Fire."]];

const wordVariants = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

function handleCreated({ gl }) {
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.2;
}

export default function Hero() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const outroRef = useRef(null);
  const scrollCueRef = useRef(null);
  const cameraRef = useRef(null);
  const layerRefs = useRef({});
  const labelRefs = useRef({});
  const idleRef = useRef(1);
  const invalidateRef = useRef(null);
  const cameraBaseYRef = useRef(2.1);

  const registerRef = useCallback((id, obj) => {
    layerRefs.current[id] = obj;
  }, []);

  const registerLabelRef = useCallback((id, descriptor) => {
    labelRefs.current[id] = descriptor;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let snapped = false;

      const applyExplode = (explodeAmt) => {
        const camera = cameraRef.current;
        const meshes = layerRefs.current;
        const labels = labelRefs.current;

        Object.values(meshes).forEach((mesh) => {
          const cfg = mesh.userData.explode;
          mesh.position.y = cfg.offset * explodeAmt;
          mesh.position.x = cfg.x * explodeAmt;
          mesh.position.z = cfg.z * explodeAmt;
          mesh.rotation.y = cfg.spin * explodeAmt * Math.PI;
        });

        Object.values(labels).forEach(({ el, from, to }) => {
          if (!el) return;
          const mid = (from + to) / 2;
          const halfWidth = Math.max(0.001, (to - from) / 2);
          const dist = Math.abs(explodeAmt - mid);
          const opacity = gsap.utils.clamp(0, 1, 1 - dist / halfWidth);
          el.style.opacity = opacity;
          el.style.transform = `translateX(${(1 - opacity) * 10}px)`;
        });

        if (camera) {
          camera.position.z = 13 + explodeAmt * 12;
          cameraBaseYRef.current = 2.1 + explodeAmt * 3.6;
          camera.lookAt(0, -0.75 + explodeAmt * 2.2, 0);
        }
      };

      const introEl = introRef.current;
      const outroEl = outroRef.current;
      const cueEl = scrollCueRef.current;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const explodeAmt = p <= 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;
          applyExplode(explodeAmt);
          idleRef.current = 1 - gsap.utils.clamp(0, 1, p / 0.05);

          const introFade = 1 - gsap.utils.clamp(0, 1, p / 0.1);
          introEl.style.opacity = introFade;
          introEl.style.transform = `translateX(${(1 - introFade) * -40}px)`;

          cueEl.style.opacity = 1 - gsap.utils.clamp(0, 1, p / 0.035);

          const outroReveal = gsap.utils.clamp(0, 1, (p - 0.9) / 0.1);
          outroEl.style.opacity = outroReveal;
          outroEl.style.transform = `translateY(${(1 - outroReveal) * 30}px)`;

          if (p > 0.985 && !snapped) {
            snapped = true;
            const scales = Object.values(layerRefs.current).map((mesh) => mesh.scale);
            gsap
              .timeline({ onUpdate: () => invalidateRef.current?.() })
              .to(scales, { x: 1.04, y: 1.04, z: 1.04, duration: 0.14, ease: "power2.out" })
              .to(scales, { x: 1, y: 1, z: 1, duration: 0.4, ease: "elastic.out(1, 0.35)" });
          } else if (p < 0.96 && snapped) {
            snapped = false;
          }

          invalidateRef.current?.();
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  return (
    <section className="hero" ref={sectionRef} id="hero">
      <div className="hero-bg" />
      <div className="hero-spotlight" />

      <div className="hero-canvas-wrap">
        <Canvas
          frameloop="always"
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <BurgerScene
            cameraRef={cameraRef}
            registerRef={registerRef}
            registerLabelRef={registerLabelRef}
            idleRef={idleRef}
            invalidateRef={invalidateRef}
            cameraBaseYRef={cameraBaseYRef}
          />
        </Canvas>
      </div>

      <div className="hero-intro" ref={introRef}>
        <p className="eyebrow">Karachi's Finest</p>
        <h1 className="hero-title">
          {TITLE_LINES.map((line, li) => (
            <span className="hero-title-line" key={li}>
              {line.map((word) => {
                const i = wordIndex++;
                return (
                  <span className="hero-word-mask" key={word}>
                    <motion.span
                      className="hero-word"
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={wordVariants}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <p className="hero-sub">Hand-smashed 180g wagyu, brioche baked daily, fire every time.</p>
        <div className="hero-cta">
          <a href="#menu" className="btn solid">
            View Menu
          </a>
          <a href="#reservation" className="btn">
            Reserve a Table
          </a>
        </div>
      </div>

      <div className="hero-outro" ref={outroRef}>
        <h2>Every Layer, Perfected.</h2>
      </div>

      <div className="scroll-cue" ref={scrollCueRef}>
        <span />
        <p>Scroll</p>
      </div>
    </section>
  );
}
