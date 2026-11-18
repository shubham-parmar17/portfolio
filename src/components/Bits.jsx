import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { go, scrollToTarget, reduced, hasPreloaderRun } from '../transition';

export const TLink = ({ to, children, onClick, ...p }) => (
  <a
    href={'#' + to}
    onClick={(e) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      go(to);
    }}
    {...p}
  >
    {children}
  </a>
);

export const SectionLink = ({ toId, children, onClick, ...p }) => {
  const loc = useLocation();
  return (
    <a
      href={`#${toId}`}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (loc.pathname !== '/') {
          go('/');
          setTimeout(() => scrollToTarget(toId), 750);
        } else {
          scrollToTarget(toId);
        }
      }}
      {...p}
    >
      {children}
    </a>
  );
};

// Counter plus curtain, shown once per browser session.
export function Preloader({ lenisRef }) {
  const [done, setDone] = useState(() => reduced() || hasPreloaderRun());
  const box = useRef(), num = useRef();

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = 'hidden';
    if (lenisRef?.current) lenisRef.current.stop();

    const o = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.seen = '1'; } catch {}
        document.body.style.overflow = '';
        if (lenisRef?.current) lenisRef.current.start();
        setDone(true);
      }
    })
      .to(o, {
        v: 100,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0');
        }
      })
      .to(box.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' });

    return () => {
      document.body.style.overflow = '';
      if (lenisRef?.current) lenisRef.current.start();
      tl.kill();
    };
  }, [done, lenisRef]);

  if (done) return null;
  return (
    <div ref={box} className="pre" aria-hidden="true">
      <p>Shubham</p>
      <span ref={num} className="display">000</span>
    </div>
  );
}

export function Cursor() {
  const el = useRef(), label = useRef();
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches || reduced()) return;
    const node = el.current;
    if (!node) return;

    const x = gsap.quickTo(node, 'x', { duration: 0.25, ease: 'power3' });
    const y = gsap.quickTo(node, 'y', { duration: 0.25, ease: 'power3' });
    let initialized = false;

    const ov = (e) => {
      const interactive = e.target.closest && e.target.closest('a, button');
      const dataCursor = e.target.closest && e.target.closest('[data-cursor]');
      if (interactive) {
        if (label.current) label.current.textContent = '';
        node.classList.remove('label');
        node.classList.add('big');
      } else if (dataCursor) {
        if (label.current) label.current.textContent = dataCursor.dataset.cursor || '';
        node.classList.add('label');
        node.classList.remove('big');
      } else {
        if (label.current) label.current.textContent = '';
        node.classList.remove('label', 'big');
      }
    };

    const mv = (e) => {
      if (!initialized) {
        gsap.set(node, { x: e.clientX, y: e.clientY, opacity: 1 });
        node.style.display = 'block';
        initialized = true;
      } else {
        x(e.clientX);
        y(e.clientY);
      }
    };

    const onLeave = () => {
      if (initialized) gsap.to(node, { opacity: 0, duration: 0.15 });
    };

    const onEnter = () => {
      if (initialized) gsap.to(node, { opacity: 1, duration: 0.15 });
    };

    addEventListener('mousemove', mv);
    addEventListener('mouseover', ov);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      removeEventListener('mousemove', mv);
      removeEventListener('mouseover', ov);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return <div ref={el} className="cursor" aria-hidden="true"><span ref={label} /></div>;
}

export function Magnet(props) {
  const r = useRef();

  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches || reduced()) return;
    const el = r.current;
    if (!el) return;

    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

    const mv = (e) => {
      const b = el.getBoundingClientRect();
      const curX = gsap.getProperty(el, 'x') || 0;
      const curY = gsap.getProperty(el, 'y') || 0;
      const centerX = b.left + b.width / 2 - curX;
      const centerY = b.top + b.height / 2 - curY;
      x((e.clientX - centerX) * 0.12);
      y((e.clientY - centerY) * 0.2);
    };

    const lv = () => {
      x(0);
      y(0);
    };

    el.addEventListener('mousemove', mv);
    el.addEventListener('mouseleave', lv);
    return () => {
      el.removeEventListener('mousemove', mv);
      el.removeEventListener('mouseleave', lv);
    };
  }, []);

  return <a ref={r} {...props} />;
}
