import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Ambience.css";

gsap.registerPlugin(ScrollTrigger);

export default function Ambience() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getMaxX = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + getMaxX(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray(".ambience-panel-content").forEach((content) => {
        gsap.from(content.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content,
            containerAnimation: tween,
            start: "left 75%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ambience" id="ambience" ref={sectionRef}>
      <div className="ambience-track" ref={trackRef}>
        <div className="ambience-panel quote-panel">
          <div className="ambience-panel-content">
            <span className="quote-mark">&ldquo;</span>
            <p className="ambience-quote">Food is our religion.</p>
          </div>
        </div>

        <div className="ambience-panel photo-panel">
          <img
            src="https://images.unsplash.com/photo-1753727471014-efe38840c7c7?auto=format&fit=crop&w=1600&q=80"
            alt="Warm, upscale dining room interior"
          />
        </div>

        <div className="ambience-panel story-panel">
          <div className="ambience-panel-content">
            <p className="eyebrow">Our Story</p>
            <h3>Built on Fire, Refined by Hand.</h3>
            <p className="story-copy">
              SMASH began as a single flat-top and a stubborn belief: a burger deserves the same
              discipline as any tasting menu. Every patty is hand-smashed to order, every bun baked
              before service, every plate finished the way we'd want it finished ourselves.
            </p>
          </div>
        </div>

        <div className="ambience-panel stats-panel">
          <div className="ambience-panel-content stats-content">
            <div className="stat">
              <span className="stat-value">2017</span>
              <span className="stat-label">Est.</span>
            </div>
            <div className="stat">
              <span className="stat-value">18</span>
              <span className="stat-label">Tables</span>
            </div>
            <div className="stat">
              <span className="stat-value">7</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
