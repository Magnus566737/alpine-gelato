import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Reservation.css";

gsap.registerPlugin(ScrollTrigger);

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, "7+"];

const fieldVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Reservation() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    guests: 2,
    requests: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reservation-photo", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="reservation section" id="reservation" ref={sectionRef}>
      <div className="reservation-grid">
        <div className="reservation-photo">
          <img
            src="https://images.unsplash.com/photo-1646473315764-c6cd47fe74c3?auto=format&fit=crop&w=1200&q=80"
            alt="Candlelit table set for dinner"
          />
        </div>

        <div className="reservation-form-wrap">
          <p className="eyebrow">Reserve</p>
          <h2>Come Hungry.</h2>
          <p className="reservation-copy">
            Tables move fast on weekends. Reserve ahead and we'll have the grill running hot for you.
          </p>

          {submitted ? (
            <div className="reservation-success">
              <h3>Table Requested</h3>
              <p>
                Thanks, {form.name || "friend"} — we've received your request for {form.guests} guest
                {form.guests === 1 ? "" : "s"} on {form.date || "your chosen date"}. We'll confirm shortly.
              </p>
              <button type="button" className="btn" onClick={() => setSubmitted(false)}>
                Reserve Another
              </button>
            </div>
          ) : (
            <form className="reservation-form" onSubmit={handleSubmit}>
              <motion.label
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fieldVariants}
              >
                <span>Full Name</span>
                <input type="text" name="name" required placeholder="Jane Doe" value={form.name} onChange={handleChange} />
              </motion.label>

              <div className="reservation-row">
                <motion.label
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={fieldVariants}
                >
                  <span>Date</span>
                  <input type="date" name="date" required value={form.date} onChange={handleChange} />
                </motion.label>
                <motion.label
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={fieldVariants}
                >
                  <span>Time</span>
                  <input type="time" name="time" required value={form.time} onChange={handleChange} />
                </motion.label>
              </div>

              <motion.label
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fieldVariants}
              >
                <span>Guests</span>
                <select name="guests" value={form.guests} onChange={handleChange}>
                  {GUEST_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </motion.label>

              <motion.label
                custom={4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fieldVariants}
              >
                <span>Special Requests</span>
                <textarea
                  name="requests"
                  rows={3}
                  placeholder="Allergies, celebrations, seating preference…"
                  value={form.requests}
                  onChange={handleChange}
                />
              </motion.label>

              <motion.button
                type="submit"
                className="btn solid reservation-submit"
                custom={5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fieldVariants}
              >
                Reserve a Table
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
