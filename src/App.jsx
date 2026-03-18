import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';

const BeanImage = lazy(() => import('./components/BeanImage'));

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
  const heroY = useTransform(smoothProgress, [0, 1], ['0%', '20%']);
  const heroRotate = useTransform(smoothProgress, [0, 1], ['0deg', '-5deg']);

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
    if (!email.trim()) {
      return;
    }
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
        <motion.div className="progress-rail" style={{ scaleX: smoothProgress }} />
        <DotGrid x={mouse.x} y={mouse.y} />
        <div className="ambient ambient-a" aria-hidden="true" />
        <div className="ambient ambient-b" aria-hidden="true" />

        <header className="top-nav glass">
          <a href="#top" className="brand-mark" onClick={() => setMobileNavOpen(false)}>
            KOFIE//EXTRACTION LAB
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
              <a href="#architecture" onClick={() => setMobileNavOpen(false)}>
                Architecture
              </a>
              <a href="#releases" onClick={() => setMobileNavOpen(false)}>
                Releases
              </a>
              <a href="#access" onClick={() => setMobileNavOpen(false)}>
                Access
              </a>
            </nav>
            <ThemeToggle
              theme={theme}
              onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            />
          </div>
        </header>

        <main>
          <section className="hero section" id="top">
            <motion.div
              className="hero-copy"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="chip glass">Hardware-Grade Coffee Platform</p>
              <h1 className="dot-heading">KOFIE</h1>
              <p className="subtitle">Extraction 01. The Purest Signal.</p>
              <p className="hero-lead">
                We roast in narrow tolerance windows and publish every curve. No noise. No romance.
                Only repeatable flavor architecture.
              </p>
            </motion.div>

            <motion.div className="hero-visual glass" style={{ y: heroY, rotate: heroRotate }}>
              <Suspense fallback={<div className="bean-skeleton" aria-hidden="true" />}>
                <BeanImage />
              </Suspense>
              <div className="bean-overlay" aria-hidden="true" />
            </motion.div>

            <div className="hero-stats">
              <article className="glass stat-card">
                <p>Signal Stability</p>
                <strong>99.2%</strong>
              </article>
              <article className="glass stat-card">
                <p>Roast Delta</p>
                <strong>+/- 0.3C</strong>
              </article>
              <article className="glass stat-card">
                <p>Median Rest Time</p>
                <strong>9 Days</strong>
              </article>
            </div>
          </section>

          <section className="section" id="architecture">
            <h2 className="section-title">Component Breakdown</h2>
            <div className="bento-grid">
              <article className="glass tile">
                <p className="tile-label">The Source</p>
                <p className="dot-copy">-01.2823 / 36.8155</p>
                <p className="muted">Kiambu Highlands / Elev. 1820m / Lot 7-B</p>
              </article>

              <article className="glass tile">
                <p className="tile-label">The Roast</p>
                <RoastCurve />
              </article>

              <article className="glass tile notes-tile">
                <p className="tile-label">The Notes</p>
                <p className="notes">CITRUS. CACAO. AIR.</p>
              </article>

              <article className="glass tile manifest-tile">
                <p className="tile-label">Process Manifest</p>
                <ul className="manifest-list">
                  <li>Batch size: 6.0 kg</li>
                  <li>Development: 16.2%</li>
                  <li>Drop temp: 203.6C</li>
                  <li>Agtron: 71</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="section releases" id="releases">
            <h2 className="section-title">Current Releases</h2>
            <div className="release-shell glass">
              <div className="release-head">
                <span>Batch ID</span>
                <span>Name</span>
                <span>Process</span>
                <span>Score</span>
              </div>
              <div className="release-body" role="list" aria-label="Release list">
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
                    <span data-label="Batch ID">{row.id}</span>
                    <span data-label="Name">{row.name}</span>
                    <span data-label="Process">{row.process}</span>
                    <span data-label="Score">{row.score}</span>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section className="section hardware-section">
            <h2 className="section-title">Hardware Gallery</h2>
            <div className="gallery-row" role="list" aria-label="Coffee packaging gallery">
              {['K-01', 'K-02', 'K-03', 'K-04'].map((pack, i) => (
                <motion.article
                  key={pack}
                  className="pack-card glass"
                  role="listitem"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="pack-inner">
                    <span>{pack}</span>
                    <span>Transparent Bag</span>
                    <span>Whole Bean / 250g</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="section access-section" id="access">
            <h2 className="section-title">Terminal Access</h2>
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
                  placeholder="Enter Email to Subscribe..."
                  autoComplete="email"
                />
                <span className="cursor" aria-hidden="true" />
                <button type="submit" className="pill-button submit-pill">
                  <span className="dot-indicator" aria-hidden="true" />
                  Sync
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
                    Signal accepted. You are in queue.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <footer className="footer glass">
          <div className="footer-item">
            <p className="footer-label">Time</p>
            <strong>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </strong>
          </div>
          <div className="footer-item">
            <p className="footer-label">Location</p>
            <strong>Roastery Core</strong>
          </div>
          <a className="footer-item footer-link" href="#top">
            <p className="footer-label">System</p>
            <strong>Return to Top</strong>
          </a>
          <a className="footer-item footer-link" href="#" aria-label="Privacy policy">
            <p className="footer-label">Policy</p>
            <strong>Privacy Policy</strong>
          </a>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
