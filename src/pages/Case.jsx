import { useEffect, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { projects } from '../data';
import { TLink } from '../components/Bits';
import { dur, ease } from '../motion';
import { reduced, state } from '../transition';

export default function Case() {
  const root = useRef();
  const { slug } = useParams();
  const i = projects.findIndex((p) => p.slug === slug);
  const p = i >= 0 ? projects[i] : null;
  const next = projects.length > 1 && i >= 0 ? projects[(i + 1) % projects.length] : null;

  useEffect(() => {
    document.title = p ? `${p.title} – Shubham` : 'Not found – Shubham';
  }, [p]);

  useLayoutEffect(() => {
    if (reduced() || !p) return;
    const delay = state.busy ? 0.9 : 0.1;
    const c = gsap.context(() => {
      gsap.from('.caseBadge', { opacity: 0, y: -10, duration: 0.5, delay });
      gsap.from('.line>span', { yPercent: 112, duration: dur.reveal, stagger: 0.1, ease: ease.out, delay });
      gsap.from('.caseDetails', { opacity: 0, y: 20, duration: 0.8, delay: delay + 0.3 });
    }, root);
    return () => c.revert();
  }, [slug, p]);

  if (!p) {
    return (
      <main id="main-content" className="wrap pad">
        <h1 className="display">Not found</h1>
        <p className="lede" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>The case study you’re looking for doesn’t exist.</p>
        <TLink className="more" to="/">← Back home</TLink>
      </main>
    );
  }

  return (
    <main ref={root} id="main-content" className="wrap pad">
      <div className="caseBadge">
        <span className="caseNum">Project {p.num}</span>
      </div>
      <h1 className="display case"><span className="line"><span>{p.title}</span></span></h1>
      <p className="lede">{p.tagline}</p>
      <div className="caseDetails">
        <dl>
          <div><dt>Stack</dt><dd>{p.stack.join(' • ')}</dd></div>
          {p.repo && <div><dt>Code</dt><dd><a href={p.repo} target="_blank" rel="noopener noreferrer">GitHub Repository ↗</a></dd></div>}
          {p.sections?.map((s) => (
            <div key={s.h}><dt>{s.h}</dt><dd>{s.p}</dd></div>
          ))}
        </dl>
        {next && next.slug !== p.slug ? (
          <TLink className="nextLink display" to={'/work/' + next.slug}>Next: {next.title} →</TLink>
        ) : (
          <TLink className="nextLink display" to="/">← Back home</TLink>
        )}
      </div>
    </main>
  );
}
