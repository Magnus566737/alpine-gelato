import { useEffect, useState } from "react";
import "./Navbar.css";

const LINKS = [
  { label: "Dishes", href: "#dishes" },
  { label: "Menu", href: "#menu" },
  { label: "Story", href: "#ambience" },
  { label: "Reserve", href: "#reservation" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = () => setOpen(false);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${open ? "open" : ""}`}>
      <div className="navbar-inner container">
        <a href="#" className="brand">
          SMASH<span className="brand-dot">.</span>
        </a>

        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#reservation" className="btn nav-cta">
          Book a Table
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav-mobile">
        <ul>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#reservation" onClick={handleLinkClick} className="btn solid">
              Book a Table
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
