import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Testimonials.css";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    quote: "The Black Truffle Wagyu is worth every rupee. This isn't a burger joint, it's a tasting menu that happens to be handheld.",
    name: "Ayesha K.",
    rating: 5,
  },
  {
    quote: "Booked a table for four, ended up ordering for eight. The Ember Stack alone justifies the drive across the city.",
    name: "Bilal R.",
    rating: 5,
  },
  {
    quote: "Best smash burger in Karachi, full stop. The room, the service, the plating — it all feels considered.",
    name: "Sana M.",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonials-header .eyebrow, .testimonials-header h2", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.utils.toArray(".review-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials section" ref={sectionRef}>
      <div className="container">
        <div className="testimonials-header">
          <p className="eyebrow">Word of Mouth</p>
          <h2>What Karachi Is Saying.</h2>
        </div>

        <div className="review-grid">
          {REVIEWS.map((r) => (
            <div className="review-card" key={r.name}>
              <span className="review-quote-mark">&ldquo;</span>
              <p className="review-text">{r.quote}</p>
              <div className="review-stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="review-name">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
