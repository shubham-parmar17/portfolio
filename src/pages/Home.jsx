import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, bio, status } from '../data';
import { TLink } from '../components/Bits';
import { Marquee, ScrubText } from '../components/Extras';
import Journey from '../components/Journey';
import Skills from '../components/Skills';
import Education from '../components/Education';
import { ease } from '../motion';
import { reduced, state } from '../transition';

const boxes = [[1, 70, 'React'], [166, 70, 'REST API'], [331, 1, 'MySQL'], [331, 139, 'PostgreSQL']];
const links = ['M109 98H166', 'M274 98H302V29H331', 'M274 98H302V167H331'];

export default function Home() {
  const root = useRef();
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 460);
    return () => clearTimeout(id);
  }, [openProject]);

  useLayoutEffect(() => {
    document.title = 'Shubham – Computer Science & Engineering Student';
    const ctx = gsap.context(() => {
      if (reduced()) return;
      let seen;
      try { seen = sessionStorage.seen; } catch {}
      const delay = seen ? (state.busy ? 0.9 : 0.1) : 1.7;

      gsap.timeline({ delay, defaults: { ease: ease.out } })
        .from('.badge', { opacity: 0, y: -8, duration: 0.25 })
        .from('.line>span', { yPercent: 112, duration: 0.55, stagger: 0.08 }, '-=0.1')
        .from('.heroFoot p', { opacity: 0, duration: 0.3 }, '-=0.15')
        .from('.heroActions', { opacity: 0, y: 8, duration: 0.25 }, '-=0.1')
        .fromTo('.sys .d',
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set('.sys .d', { clearProps: 'strokeDasharray,strokeDashoffset' });
            }
          },
          '-=0.7'
        )
        .from('.sys .t', { opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.6');

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} id="main-content">
      <header className="hero wrap">
        <div>
          <div className="badge" aria-label={`Status: ${status}`}>
            <span className="badgeDot" aria-hidden="true" />
            <span>{status}</span>
          </div>

          <h1 className="display" aria-label="I build full-stack applications and systems for the web.">
            <span className="line"><span>I build full-stack</span></span>
            <span className="line"><span>applications & systems</span></span>
            <span className="line"><span>for the web.</span></span>
          </h1>

          <div className="heroFoot">
            <div>
              <p>{bio}</p>
              <div className="heroActions">
                <a href="#work" className="heroBtn primary">View projects</a>
                <a href="#contact" className="heroBtn secondary">Contact</a>
              </div>
            </div>
            <svg className="sys" viewBox="0 0 440 210" role="img" aria-label="Diagram: React interface communicates with a REST API backend, connected to MySQL and PostgreSQL databases.">
              {links.map((d) => <path key={d} className="d" pathLength="1" d={d} />)}
              {boxes.map(([x, y, t]) => (
                <g key={t}>
                  <path className="d box-bg" pathLength="1" d={`M${x} ${y}h108v56h-108z`} />
                  <text className="t" x={x + 54} y={y + 33} textAnchor="middle">{t}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </header>

      <Marquee items={['C++', 'Python', 'JavaScript', 'React', 'Node.js', 'Express', 'MySQL', 'PostgreSQL', 'Git', 'GitHub']} />

      <div className="workShell">
        <section className="work wrap" id="work" aria-labelledby="wh">
          <div className="workHeader">
            <span className="subhead">Selected Projects</span>
            <h2 className="display" id="wh">Featured Work</h2>
          </div>

          {projects.map((p) => (
            <article className={`proj${openProject === p.slug ? ' is-open' : ''}`} key={p.slug} data-cursor="Read">
              <h3>
                <button
                  className="projToggle"
                  type="button"
                  aria-expanded={openProject === p.slug}
                  aria-controls={`project-details-${p.slug}`}
                  onClick={() => setOpenProject(openProject === p.slug ? null : p.slug)}
                >
                  <span className="projLeft">
                    <span className="projNum">{p.num}</span>
                    <span className="projTitle">{p.title}</span>
                  </span>
                  <span className="projMark" aria-hidden="true">{openProject === p.slug ? '−' : '+'}</span>
                </button>
              </h3>
              <div
                className={`projPanel${openProject === p.slug ? ' is-open' : ''}`}
                id={`project-details-${p.slug}`}
                aria-hidden={openProject !== p.slug}
              >
                <div className="projPanelInner">
                  <div className="projDetails">
                    <p>{p.tagline}</p>
                    <div className="tech">{p.stack.join(' • ')}</div>
                    <TLink className="more" to={'/work/' + p.slug} tabIndex={openProject === p.slug ? 0 : -1}>Read the case study ↗</TLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      <Journey />

      <Skills />

      <Education />

      <section className="about wrap" id="about" aria-labelledby="about-heading">
        <div className="aboutHeader">
          <span className="subhead">About Me</span>
          <h2 className="display" id="about-heading">Background & Philosophy</h2>
          <ScrubText className="lede">I build software by mastering core principles and engineering dependable, production-ready systems.</ScrubText>
        </div>
        <div className="aboutSub">
          <p>
            I am a Computer Science and Engineering undergraduate at Chandigarh University graduating in 2028. My primary engineering focus spans full-stack application development, RESTful service architecture, and relational database modeling.
          </p>
          <p>
            I enjoy solving challenges where data integrity and user experience intersect — from designing normalized schemas in MySQL and PostgreSQL to building responsive, accessible user interfaces with React. My objective is to contribute to real-world software systems that deliver measurable value.
          </p>
        </div>
      </section>
    </main>
  );
}
