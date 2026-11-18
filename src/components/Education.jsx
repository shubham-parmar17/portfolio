import { education } from '../data';

export default function Education() {
  return (
    <section className="education wrap" id="education" aria-labelledby="edu-heading">
      <div className="eduHeader">
        <span className="subhead">Academic Background</span>
        <h2 className="display" id="edu-heading">Education</h2>
      </div>
      <div className="eduCard">
        <div className="eduTop">
          <div>
            <span className="eduYear display">{education.duration}</span>
            <h3 className="eduDegree">{education.degree}</h3>
            <p className="eduInstitution">{education.institution}</p>
          </div>
          <span className="eduBadge">{education.status}</span>
        </div>
        <p className="eduDetails">{education.details}</p>
      </div>
    </section>
  );
}
