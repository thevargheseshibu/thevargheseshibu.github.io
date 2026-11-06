import { ArrowDownRight } from "lucide-react";
import { awards, certifications, profile } from "../../data/content";

export default function Credentials() {
  return (
    <div className="experience-credentials" aria-labelledby="credentials-heading">
      <div className="credentials-heading">
        <h3 id="credentials-heading" className="serif-accent">
          Credentials
        </h3>
        {profile.resumeUrl && (
          <a className="credentials-download label" href={profile.resumeUrl} download>
            Download résumé <ArrowDownRight size={22} aria-hidden="true" />
          </a>
        )}
      </div>
      <div className="credentials-group">
        <h3 className="label">Certifications</h3>
        <ol className="credentials-index">
          {certifications.map((item, index) => (
            <li key={item.title}>
              <span className="credentials-number label" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="credentials-title">{item.title}</p>
                <p className="credentials-issuer">{item.issuer}</p>
              </div>
              <span className="credentials-item-year label">{item.year}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="credentials-group">
        <h3 className="label">Awards</h3>
        <ol className="credentials-index">
          {awards.map((item, index) => (
            <li key={item.title + ("year" in item ? item.year : "")}>
              <span className="credentials-number label" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="credentials-title">{item.title}</p>
                <p className="credentials-issuer">{item.issuer}</p>
              </div>
              {"year" in item && <span className="credentials-item-year label">{item.year}</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
