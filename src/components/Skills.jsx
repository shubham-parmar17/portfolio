import { skills } from '../data';

export default function Skills() {
  return (
    <section className="skills wrap" id="skills" aria-labelledby="skills-heading">
      <div className="skillsHeader">
        <span className="subhead">Core Competencies</span>
        <h2 className="display" id="skills-heading">Technical Arsenal</h2>
      </div>
      <div className="skillsGrid">
        {skills.map((s, idx) => (
          <div className={`skillCard skillCard-${idx + 1}`} key={s.area}>
            <div className="skillArea">
              <span className="skillIdx">0{idx + 1}</span>
              <h3>{s.area}</h3>
            </div>
            <ul className="skillList" aria-label={`${s.area} skills`}>
              {s.items.map((item) => (
                <li key={item} className="skillPill">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
