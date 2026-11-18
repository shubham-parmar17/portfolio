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
  const [activeIndex, setActiveIndex] = useState(0);
  const setActive = (index) => {
    const next = Math.max(0, Math.min(journey.length - 1, index));
    setActiveIndex((current) => current === next ? current : next);
  };

  useEffect(() => {
    const section = root.current;
    if (!section || reduced()) return;
    const route = section.querySelector('#route');
    const marker = section.querySelector('#marker');
    const stops = gsap.utils.toArray(section.querySelectorAll('.stop'));
    if (!route || !marker || !stops.length) return;
    const focusHandlers = stops.map((stop, index) => {
      const handler = () => setActive(index);
      stop.addEventListener('focusin', handler);
      return handler;
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const length = route.getTotalLength();
      gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'journey-scroll',
          trigger: section,
          start: 'top top',
          end: () => `+=${stops.length * window.innerHeight * 0.6}`,
          pin: section.querySelector('.jStage'),
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!isNavigating.current) {
              setActive(Math.min(stops.length - 1, Math.floor(self.progress * stops.length)));
            }
          },
        },
      });
      timeline.to(route, { strokeDashoffset: 0, duration: 1 }, 0);
      timeline.to(marker, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] }, duration: 1 }, 0);
      stops.forEach((stop, index) => {
        timeline.to(stop, { autoAlpha: 1, duration: 0.05 }, Number(stop.dataset.at));
        gsap.set(stop, { autoAlpha: 1 });
      });
    });

    media.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      const observer = new IntersectionObserver((entries) => {
        if (isNavigating.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(stops.indexOf(entry.target));
        });
      }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
      stops.forEach((stop) => {
        observer.observe(stop);
      });
      gsap.fromTo(section.querySelector('.routeFill'), { scaleY: 0 }, {
        scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
      return () => observer.disconnect();
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh);
    return () => {
      media.revert();
      stops.forEach((stop, index) => stop.removeEventListener('focusin', focusHandlers[index]));
    };
  }, []);

  const goTo = (index) => {
    const stop = root.current?.querySelectorAll('.stop')[index];
    if (!stop) return;
    isNavigating.current = true;
    setActive(index);
    if (window.innerWidth >= 900) {
      const st = ScrollTrigger.getById('journey-scroll');
      if (st) {
        const targetScroll = st.start + (st.end - st.start) * (index / (journey.length - 1));
        window.scrollTo({ top: targetScroll, behavior: reduced() ? 'instant' : 'smooth' });
      } else {
        stop.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'center' });
      }
    } else {
      stop.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'center' });
    }
    stop.querySelector('a')?.focus({ preventScroll: true });
    setTimeout(() => { isNavigating.current = false; }, 800);
  };

  return (
    <section className="journey" id="journey" ref={root} aria-labelledby="journey-title">
      <div className="jStage">
        <header className="jHeader wrap">
          <div><span className="subhead">Roadmap</span><h2 className="display" id="journey-title">My Journey</h2></div>
          <div className="jControls" aria-label="Roadmap navigation">
            <span className="jCount" aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(journey.length).padStart(2, '0')}</span>
            <button className="jArrow" type="button" aria-label="Previous roadmap phase" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}>←</button>
            <button className="jArrow" type="button" aria-label="Next roadmap phase" disabled={activeIndex === journey.length - 1} onClick={() => goTo(activeIndex + 1)}>→</button>
          </div>
        </header>
        <div className="jMap wrap">
          <svg className="jRoute" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
            <path className="routeBase" d="M90 110 H440 Q500 110 500 170 V260 H760 Q820 260 820 320 V420 H1080" />
            <path id="route" className="routeLine" d="M90 110 H440 Q500 110 500 170 V260 H760 Q820 260 820 320 V420 H1080" />
            <circle id="marker" className="routeMarker" r="13" cx="90" cy="110" />
          </svg>
          <span className="routeMobile" aria-hidden="true"><span className="routeFill" /></span>
          <ol className="stops" aria-label="Learning milestones">
            {journey.map((item, index) => (
              <li className={`stop stop-${index + 1}${index === activeIndex ? ' is-active' : ''}`} key={item.year} data-at={index / (journey.length - 1)} aria-current={index === activeIndex ? 'step' : undefined}>
                <span className="stopDot" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className="stopContent">
                  <div className="stopMeta"><span>{item.year}</span><span>{item.highlight}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {item.proof && <TLink className="stopProof" to={item.proof}>See project</TLink>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
