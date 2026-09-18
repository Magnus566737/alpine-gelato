import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SignatureDishes.css";

gsap.registerPlugin(ScrollTrigger);

const DISHES = [
  {
    name: "The Ember Stack",
    desc: "Double smashed wagyu, bourbon-glazed short rib, smoked gouda, crispy onions — built for the ones who don't share.",
    price: "Rs. 2,450",
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=1100&q=80",
  },
  {
    name: "Black Truffle Wagyu",
    desc: "Full-blood wagyu smash, shaved black truffle, gruyère, truffle aioli, gold leaf. The one that started the waitlist.",
    price: "Rs. 3,200",
    img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1100&q=80",
  },
  {
    name: "Blue Fire",
    desc: "Chargrilled wagyu, blue cheese crumble, hot honey, pickled fresno — sweet, sharp, and lit from the inside.",
    price: "Rs. 2,150",
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1100&q=80",
  },
];

export default function SignatureDishes() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dishes-header .eyebrow, .dishes-header h2", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.utils.toArray(".dish-row").forEach((row) => {
        const img = row.querySelector(".dish-photo img");
        const copy = row.querySelectorAll(".dish-copy > *");

        gsap.from(copy, {
          x: row.classList.contains("reverse") ? -50 : 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 75%" },
        });

        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dishes section" id="dishes" ref={sectionRef}>
      <div className="container">
        <div className="dishes-header">
          <p className="eyebrow">Signature</p>
          <h2>The Dishes People Drive For.</h2>
        </div>

        <div className="dish-list">
          {DISHES.map((dish, i) => (
            <div className={`dish-row ${i % 2 === 1 ? "reverse" : ""}`} key={dish.name}>
              <div className="dish-photo">
                <img src={dish.img} alt={dish.name} loading="lazy" />
              </div>
              <div className="dish-copy">
                <span className="dish-number">0{i + 1}</span>
                <h3>{dish.name}</h3>
                <p>{dish.desc}</p>
                <span className="dish-price">{dish.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
