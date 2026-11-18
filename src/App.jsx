import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Home from './pages/Home';
import Case from './pages/Case';
import { Preloader, Cursor, TLink, SectionLink, Magnet } from './components/Bits';
import { Clock } from './components/Extras';
import { dur, ease } from './motion';
import { github, email, linkedin } from './data';
import { setNav, setScroller, reduced, state } from './transition';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const nav = useNavigate(), loc = useLocation();
  const wipe = useRef(), lenis = useRef(), busy = useRef(false);
  const currentPath = useRef(loc.pathname);
  currentPath.current = loc.pathname;

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.theme;
      return saved === 'paper' || saved === 'blue' ? saved : 'blue';
    } catch {
      return 'blue';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.theme = theme; } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'blue' ? '#2038E8' : '#F5F6F8');
  }, [theme]);

  // smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduced()) return;
    const l = new Lenis({ lerp: 0.09 });
    lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // Bridge for target scrolling with Lenis
  useEffect(() => {
    setScroller((target) => {
      const el = typeof target === 'string' ? document.getElementById(target) : target;
      if (!el) return;
      if (lenis.current) {
        lenis.current.scrollTo(el, { offset: -70, immediate: reduced() });
      } else {
        el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      }
    });
    return () => setScroller(null);
  }, []);

  // animated route changes: wipe up, swap page, wipe away
  useEffect(() => {
    setNav((to) => {
      if (busy.current || to === currentPath.current) return;
      if (reduced()) {
        nav(to);
        if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        return;
      }
      busy.current = true;
      state.busy = true;
      gsap.timeline({
        onComplete: () => {
          busy.current = false;
          state.busy = false;
          ScrollTrigger.refresh();
        }
      })
        .set(wipe.current, { transformOrigin: 'bottom', pointerEvents: 'all' })
        .to(wipe.current, { scaleY: 1, duration: dur.wipe, ease: ease.inOut })
        .add(() => {
          nav(to);
          if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
          gsap.set('.progress', { scaleX: 0 });
        })
        .set(wipe.current, { transformOrigin: 'top' })
        .to(wipe.current, { scaleY: 0, duration: dur.wipe, ease: ease.inOut }, '+=0.05')
        .set(wipe.current, { pointerEvents: 'none' });
    });
    return () => setNav(null);
  }, [nav]);

  useEffect(() => {
    if (!busy.current) {
      if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      gsap.set('.progress', { scaleX: 0 });
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(id);
  }, [loc.pathname]);

  // reading progress
  useEffect(() => {
    if (reduced()) return;
    const t = gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
    return () => {
      if (t.scrollTrigger) t.scrollTrigger.kill();
      t.kill();
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Preloader lenisRef={lenis} /><Cursor />
      <div ref={wipe} className="wipe" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
      <nav className="bar wrap" aria-label="Main navigation">
        <TLink to="/" className="brand">Shubham</TLink>
        <div className="navLinks" role="menubar">
          <SectionLink toId="work" className="navItem" role="menuitem">Projects</SectionLink>
          <SectionLink toId="journey" className="navItem" role="menuitem">Roadmap</SectionLink>
          <SectionLink toId="skills" className="navItem" role="menuitem">Skills</SectionLink>
          <SectionLink toId="education" className="navItem" role="menuitem">Education</SectionLink>
          <SectionLink toId="about" className="navItem" role="menuitem">About</SectionLink>
          <SectionLink toId="contact" className="navItem" role="menuitem">Contact</SectionLink>
        </div>
        <div className="navActions">
          <Clock />
          <button
            type="button"
            className="themeBtn"
            aria-label={theme === 'blue' ? 'Switch to Paper theme' : 'Switch to Blue theme'}
            onClick={() => setTheme(theme === 'blue' ? 'paper' : 'blue')}
          >
            {theme === 'blue' ? 'Paper theme' : 'Blue theme'}
          </button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<Case />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer className="contact wrap" id="contact" role="contentinfo">
        <div className="contactHeader">
          <span className="subhead">Contact & Opportunities</span>
          <h2 className="display contactTitle">Let’s connect</h2>
          <p className="contactIntro">
            I am actively looking for software engineering internships and open to technical discussions. Feel free to connect.
          </p>
        </div>
        <Magnet
          className="big display"
          href={email ? 'mailto:' + email : github}
          target={email ? undefined : '_blank'}
          rel={email ? undefined : 'noopener noreferrer'}
        >
          {email ? 'Send an email' : 'Let’s build something'} <span className="ctaArrow" aria-hidden="true">↗</span>
        </Magnet>
        <div className="foot">
          <span>Shubham • BE in CSE, Chandigarh University</span>
          <span className="footLinks">
            {email && <a href={'mailto:' + email}>Email ↗</a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
            <a href={github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </span>
        </div>
      </footer>
    </>
  );
}
