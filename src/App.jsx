import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';

const roastCurve = [18, 32, 42, 55, 64, 70, 82, 78, 88];
const releaseRows = [
  { id: 'R/01', name: 'Signal Bloom', process: 'Washed', score: '91.2' },
  { id: 'R/02', name: 'Quiet Voltage', process: 'Natural', score: '90.5' },
  { id: 'R/03', name: 'Mono Pulse', process: 'Honey', score: '89.9' },
];

function DotGrid({ x, y }) {
  return (
    <div
      className="dot-grid"
      style={{
        transform: `translate3d(${x * 0.015}px, ${y * 0.015}px, 0)`,
      }}
      aria-hidden="true"
    />
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="pill-button" onClick={onToggle} aria-label="Toggle theme">
      <span className="dot-indicator" aria-hidden="true" />
      {theme === 'light' ? 'Night System' : 'Day System'}
    </button>
  );
}

function RoastCurve() {
  const points = useMemo(() => {
    const step = 100 / (roastCurve.length - 1);
    return roastCurve.map((v, i) => `${i * step},${100 - v}`).join(' ');
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="roast-graph" role="img" aria-label="Roast curve graph">
      <polyline points={points} className="curve-grid" />
      <motion.polyline
        points={points}
        className="curve-line"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [time, setTime] = useState(() => new Date());
  const [subscribed, setSubscribed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.45,
  });

  useEffect(() => {
    const updateMouse = (e) => {
      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.5;
      setMouse({ x: e.clientX - cx, y: e.clientY - cy });
    };

    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 840) {
        setMobileNavOpen(false);
      }
    };

    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };

    const timer = window.setInterval(() => setTime(new Date()), 1000);
    window.addEventListener('pointermove', updateMouse);
    window.addEventListener('resize', closeMenuOnDesktop);
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('pointermove', updateMouse);
      window.removeEventListener('resize', closeMenuOnDesktop);
      window.removeEventListener('keydown', closeOnEscape);
      window.clearInterval(timer);
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 2200);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        className={`app theme-${theme}`}
        initial={{ opacity: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(6px)' }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        <DotGrid x={mouse.x} y={mouse.y} />
        <div className="ambient ambient-a" aria-hidden="true" />
        <div className="ambient ambient-b" aria-hidden="true" />

        <header className="top-nav">
          <div className="nav-container">
            <a href="#top" className="brand-mark" onClick={() => setMobileNavOpen(false)}>
              KOFIE//ROASTERY
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
              aria-controls="site-nav-panel"
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
            <div id="site-nav-panel" className={`nav-panel ${mobileNavOpen ? 'is-open' : ''}`}>
              <nav className="nav-links" aria-label="Section links">
                <a href="#roastery" onClick={() => setMobileNavOpen(false)}>
                  The Roastery
                </a>
                <a href="#collections" onClick={() => setMobileNavOpen(false)}>
                  Collections
                </a>
                <a href="#experience" onClick={() => setMobileNavOpen(false)}>
                  Experience
                </a>
              </nav>
              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              />
            </div>
          </div>
        </header>

        <main>
          <section className="hero-v2" id="top">
            <div className="hero-v2-grid">
              <motion.div 
                className="hero-v2-text"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hero-tag">Sourcing // Roasting // Brewing</div>
                <h1 className="hero-v2-title">THOUGHTFUL<br />COFFEE</h1>
                <p className="hero-v2-lead">
                  We believe in the quiet beauty of a perfect roast. From the high-altitude farms of Kiambu to your morning ritual, we ensure every bean tells its own unique story.
                </p>
                <div className="hero-v2-actions">
                  <a href="#collections" className="btn-sharp primary">Explore Collections</a>
                  <a href="#roastery" className="btn-sharp">Our Story</a>
                </div>
              </motion.div>
              
              <motion.div 
                className="hero-v2-image-wrap"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <img src="/beans.png" alt="Roasted Coffee Beans" className="hero-v2-image" />
                <div className="hero-v2-image-overlay" />
                <div className="hero-v2-image-info">
                  <span>Batch: K-082</span>
                  <span>Origin: Kiambu Highland</span>
                </div>
              </motion.div>
            </div>
            
            <div className="hero-v2-footer">
              <div className="scroll-indicator">
                <span className="line" />
                <span className="text">Scroll to explore</span>
              </div>
              <div className="hero-v2-stats">
                <div className="stat">
                  <strong>1820m</strong>
                  <span>Average Elevation</span>
                </div>
                <div className="stat">
                  <strong>88+</strong>
                  <span>SCA Cup Score</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="roastery">
            <h2 className="section-title">The Roastery Approach</h2>
            <div className="bento-grid">
              <article className="glass tile">
                <p className="tile-label">Direct Sourcing</p>
                <p className="dot-copy">ORIGIN // 01.2823</p>
                <p className="muted">Working with farmers who prioritize quality and sustainability above all else.</p>
              </article>

              <article className="glass tile">
                <p className="tile-label">Roast Profile</p>
                <RoastCurve />
              </article>

              <article className="glass tile notes-tile">
                <p className="tile-label">Flavor Profile</p>
                <p className="notes">JASMINE. PEACH. HONEY.</p>
              </article>

              <article className="glass tile manifest-tile">
                <p className="tile-label">Quality Metrics</p>
                <ul className="manifest-list">
                  <li>Roast Level: Light-Medium</li>
                  <li>Density: High</li>
                  <li>Moisture: 10.5%</li>
                  <li>Water Activity: 0.58aw</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="section releases" id="collections">
            <h2 className="section-title">Current Collections</h2>
            <div className="release-shell glass">
              <div className="release-head">
                <span>Lot ID</span>
                <span>Name</span>
                <span>Process</span>
                <span>Tasting Notes</span>
              </div>
              <div className="release-body" role="list" aria-label="Collection list">
                {releaseRows.map((row, i) => (
                  <motion.article
                    key={row.id}
                    role="listitem"
                    className="release-row"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                  >
                    <span data-label="Lot ID">{row.id}</span>
                    <span data-label="Name">{row.name}</span>
                    <span data-label="Process">{row.process}</span>
                    <span data-label="Notes">Floral, Bright, Syrupy</span>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section className="section experience-gallery" id="experience">
            <h2 className="section-title">Coffee Experience</h2>
            <div className="gallery-row-v2" role="list" aria-label="Coffee experience gallery">
              {[
                { title: 'The Roast', desc: 'Precision heat application.', img: '/vibe.png' },
                { title: 'The Brew', desc: 'Optimal extraction methods.', img: '/hero.png' },
                { title: 'The Bean', desc: 'Sourced from volcanic soil.', img: '/beans.png' },
              ].map((item, i) => (
                <motion.article
                  key={item.title}
                  className="exp-card glass"
                  role="listitem"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="exp-image-wrap">
                    <img src={item.img} alt={item.title} className="exp-image" />
                  </div>
                  <div className="exp-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="section subscribe-section" id="access">
            <h2 className="section-title">Stay Updated</h2>
            <div className="access-grid">
              <form className="terminal glass" onSubmit={onSubmit}>
                <label htmlFor="email" className="sr-only">
                  Email for subscription
                </label>
                <span className="terminal-prefix">&gt;</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join our mailing list for fresh roasts..."
                  autoComplete="email"
                />
                <span className="cursor" aria-hidden="true" />
                <button type="submit" className="btn-sharp submit-btn">
                  Subscribe
                </button>
              </form>

              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    className="success-chip glass"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    Welcome to the Roastery. Check your inbox soon.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <footer className="footer-v2 glass">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2 className="footer-logo">KOFIE</h2>
              <p className="footer-tagline">Thoughtful Roasting since 2026</p>
              <div className="footer-status">
                <span className="dot-indicator" />
                Roastery Active // {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div className="footer-nav-group">
              <p className="footer-heading">Navigate</p>
              <ul className="footer-links">
                <li><a href="#top">Top</a></li>
                <li><a href="#roastery">Process</a></li>
                <li><a href="#collections">Shop</a></li>
                <li><a href="#experience">Story</a></li>
              </ul>
            </div>

            <div className="footer-nav-group">
              <p className="footer-heading">Connect</p>
              <ul className="footer-links">
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-nav-group">
              <p className="footer-heading">Location</p>
              <p className="footer-text">
                Central Roastery<br />
                Artisan Quarter<br />
                City Core
              </p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">© 2026 KOFIE. ALL RIGHTS RESERVED.</p>
            <div className="footer-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
