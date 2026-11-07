import { Link } from "react-router-dom";
import { Arrow, Header, Label } from "./shared";

export default function NotFound() {
  return (
    <div className="os">
      <Header study />
      <main className="os-not-found" id="main" tabIndex={-1}>
        <Label>404 / Outside the structure</Label>
        <h1>
          Lost<span>.</span>
        </h1>
        <p>
          This opening leads somewhere else.
          <br />
          Let’s find your way back to the work.
        </p>
        <Link className="os-text-link" to="/">
          Return home <Arrow />
        </Link>
      </main>
    </div>
  );
}
