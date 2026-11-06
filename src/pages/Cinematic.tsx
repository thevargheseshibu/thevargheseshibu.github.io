import { useEffect } from "react";
import Home from "./Home";
import { PortfolioPreview } from "../lib/portfolio-preview";
import "../styles/cinematic-preview.css";

/** Same portfolio architecture, with review-only media and authentic photographs. */
export default function Cinematic() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Varghese Shibu / Cinematic portfolio preview";
    return () => {
      document.title = previous;
    };
  }, []);
  return (
    <PortfolioPreview.Provider value={true}>
      <div className="cinematic-review" data-experience="merged-portfolio">
        <Home />
      </div>
    </PortfolioPreview.Provider>
  );
}
