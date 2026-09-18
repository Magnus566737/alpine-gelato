import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Loader.css";

gsap.registerPlugin(ScrollTrigger);

export default function Loader({ onComplete }) {
  const rootRef = useRef(null);
  const wordRef = useRef(null);
  const barFillRef = useRef(null);
  const panelTopRef = useRef(null);
  const panelBottomRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            document.body.style.overflow = "";
            ScrollTrigger.refresh();
            onComplete?.();
          },
        })
        .from(wordRef.current, { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" })
        .to(barFillRef.current, { scaleX: 1, duration: 1, ease: "power2.inOut" }, "-=0.15")
        .to(wordRef.current, { opacity: 0, y: -18, duration: 0.45, ease: "power2.in" }, "+=0.2")
        .to(
          panelTopRef.current,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "reveal"
        )
        .to(
          panelBottomRef.current,
          { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
          "reveal"
        )
        .set(rootRef.current, { autoAlpha: 0 });
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="loader-panel loader-panel-top" ref={panelTopRef} />
      <div className="loader-panel loader-panel-bottom" ref={panelBottomRef} />
      <div className="loader-content">
        <p className="loader-word" ref={wordRef}>
          SMASH<span>.</span>
        </p>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" ref={barFillRef} />
        </div>
      </div>
    </div>
  );
}
