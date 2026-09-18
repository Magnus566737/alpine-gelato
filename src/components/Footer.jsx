import "./Footer.css";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#hero" className="footer-brand">
          SMASH<span className="brand-dot">.</span>
        </a>

        <div className="footer-divider" />

        <div className="footer-columns">
          <div className="footer-col">
            <span className="eyebrow">Visit</span>
            <p>Block 4, Clifton, Karachi</p>
            <p>Open 12pm – 2am, daily</p>
          </div>
          <div className="footer-col">
            <span className="eyebrow">Contact</span>
            <p>+92 300 000 0000</p>
            <p>hello@smashkarachi.com</p>
          </div>
          <div className="footer-col">
            <span className="eyebrow">Follow</span>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="TikTok">TikTok</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© {YEAR} SMASH Karachi. All rights reserved.</p>
          <p className="footer-credit">
            Hero 3D model:{" "}
            <a
              href="https://sketchfab.com/3d-models/burger-realistic-free-18e59d7dbd2243c69f469e0f056f44c4"
              target="_blank"
              rel="noopener noreferrer"
            >
              &ldquo;Burger Realistic (Free)&rdquo;
            </a>{" "}
            by erebus3d, licensed{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY 4.0
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
