import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FullMenu.css";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = {
  Starters: [
    { name: "Smoked Wagyu Bites", desc: "Torched wagyu trim, chili oil, spring onion", price: "Rs. 1,050" },
    { name: "Truffle Fries", desc: "Hand-cut, parmesan, black truffle oil", price: "Rs. 850" },
    { name: "Burrata & Charred Tomato", desc: "Fresh burrata, fire-roasted tomato, basil oil", price: "Rs. 1,150" },
  ],
  Mains: [
    { name: "The Original Smash", desc: "Double smashed wagyu, aged cheddar, house sauce", price: "Rs. 1,650" },
    { name: "Ember Stack", desc: "Bourbon short rib, smoked gouda, crispy onions", price: "Rs. 2,450" },
    { name: "Black Truffle Wagyu", desc: "Full-blood wagyu, shaved truffle, gruyère", price: "Rs. 3,200" },
    { name: "Blue Fire", desc: "Blue cheese, hot honey, pickled fresno", price: "Rs. 2,150" },
  ],
  Desserts: [
    { name: "Burnt Basque Cheesecake", desc: "Caramelized top, vanilla bean, sea salt", price: "Rs. 950" },
    { name: "Molten Chocolate Stack", desc: "Dark chocolate, gold dust, vanilla ice cream", price: "Rs. 1,050" },
  ],
  Drinks: [
    { name: "Smoked Old Fashioned", desc: "House bourbon blend, applewood smoke", price: "Rs. 1,400" },
    { name: "Gold Rush Fizz", desc: "Saffron, citrus, soda, honey", price: "Rs. 900" },
    { name: "Karak Espresso Martini", desc: "Espresso, karak reduction, vanilla vodka", price: "Rs. 1,200" },
  ],
};

const TABS = Object.keys(CATEGORIES);

export default function FullMenu() {
  const [active, setActive] = useState(TABS[0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menu-header .eyebrow, .menu-header h2, .menu-tabs", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="full-menu section" id="menu" ref={sectionRef}>
      <div className="container">
        <div className="menu-header">
          <p className="eyebrow">The Full Menu</p>
          <h2>Everything We Make.</h2>
        </div>

        <div className="menu-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`menu-tab ${active === tab ? "active" : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="menu-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {CATEGORIES[active].map((item) => (
              <div className="menu-item" key={item.name}>
                <div className="menu-item-top">
                  <h3>{item.name}</h3>
                  <span className="menu-item-price">{item.price}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
