import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { journey } from '../data';
import { reduced } from '../transition';
import { TLink } from './Bits';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Journey() {
  const root = useRef(null);
  const isNavigating = useRef(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const section = root.current;
    if (!section || reduced()) return;
    const path = section.querySelector('#route');
    const marker = section.querySelector('#marker');
    const stops = gsap.utils.toArray(section.querySelectorAll('.stop'));
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'journey-scroll', trigger: section, start: 'top top', end: () => `+=${stops.length * innerHeight * .6}`,
        pin: section.querySelector('.jStage'), scrub: .6, invalidateOnRefresh: true,
        onUpdate: (self) => { if (!isNavigating.current) setActive(Math.min(stops.length - 1, Math.floor(self.progress * stops.length))); },
      } });
      tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
      tl.to(marker, { motionPath: { path, align: path, alignOrigin: [.5,.5] }, duration: 1 }, 0);
      stops.forEach((stop, i) => tl.to(stop, { autoAlpha: 1, duration: .05 }, Number(stop.dataset.at)));
    });
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting && !isNavigating.current) setActive(stops.indexOf(entry.target));
      }), { rootMargin: '-35% 0px -45% 0px' });
      stops.forEach((stop) => observer.observe(stop));
      gsap.fromTo(section.querySelector('.routeFill'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      return () => observer.disconnect();
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh);
    return () => mm.revert();
  }, []);

  const goTo = (index) => {
    const stop = root.current?.querySelectorAll('.stop')[index];
    if (!stop) return;
    isNavigating.current = true;
    setActive(index);
    if (innerWidth >= 900) {
      const trigger = ScrollTrigger.getById('journey-scroll');
      if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / (journey.length - 1), behavior: reduced() ? 'instant' : 'smooth' });
      else stop.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else stop.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'center' });
    stop.querySelector('a')?.focus({ preventScroll: true });
    window.setTimeout(() => { isNavigating.current = false; }, 800);
  };

  return <section className="journey" id="journey" ref={root} aria-labelledby="journey-title">
    <div className="jStage">
      <header className="jHeader wrap">
        <div><span className="subhead">Roadmap</span><h2 className="display" id="journey-title">My Journey</h2></div>
        <div className="jControls" aria-label="Roadmap navigation">
          <span className="jCount" aria-live="polite">{String(active + 1).padStart(2,'0')} / {String(journey.length).padStart(2,'0')}</span>
          <button className="jArrow" type="button" aria-label="Previous roadmap phase" disabled={!active} onClick={() => goTo(active - 1)}>←</button>
          <button className="jArrow" type="button" aria-label="Next roadmap phase" disabled={active === journey.length - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
      </header>
      <div className="jMap wrap">
        <svg className="jRoute" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
          <path className="routeBase" d="M20 20 H620 Q642 20 642 42 V345 Q642 370 620 370 H20" />
          <path id="route" className="routeLine" d="M20 20 H620 Q642 20 642 42 V345 Q642 370 620 370 H20" />
          <circle id="marker" className="routeMarker" r="13" cx="20" cy="20" />
        </svg>
        <span className="routeMobile" aria-hidden="true"><span className="routeFill" /></span>
        <ol className="stops" aria-label="Learning milestones">
          {journey.map((item, i) => <li className={`stop stop-${i + 1}${active === i ? ' is-active' : ''}`} key={item.year} data-at={i / (journey.length - 1)} aria-current={active === i ? 'step' : undefined}>
            <span className="stopDot" aria-hidden="true">{String(i + 1).padStart(2,'0')}</span>
            <div className="stopContent"><div className="stopMeta"><span>{item.year}</span><span>{item.highlight}</span></div><h3>{item.title}</h3><p>{item.desc}</p>{item.proof && <TLink className="stopProof" to={item.proof}>See project</TLink>}</div>
          </li>)}
        </ol>
      </div>
    </div>
  </section>;
}
