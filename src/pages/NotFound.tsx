import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <p className="label label-accent">Error 404 · Route not found</p>
        <h1 className="display mt-6 text-[clamp(5rem,22vw,16rem)]">Lost</h1>
        <Link to="/" className="label mt-10 inline-block border-b border-crimson pb-1 text-bone">
          Return home
        </Link>
      </div>
    </main>
  );
}
