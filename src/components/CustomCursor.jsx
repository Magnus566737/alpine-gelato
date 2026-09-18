import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    const over = (e) => {
      if (e.target.closest("a, button, input, textarea, select, [data-cursor-hover]")) {
        dot.classList.add("hover");
      }
    };
    const out = (e) => {
      if (e.target.closest("a, button, input, textarea, select, [data-cursor-hover]")) {
        dot.classList.remove("hover");
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />;
}
