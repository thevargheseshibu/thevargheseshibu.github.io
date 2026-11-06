import { createContext, useContext } from "react";
/** Review-only enhancements layered onto the shared portfolio. */
export const PortfolioPreview = createContext(false);
export const usePortfolioPreview = () => useContext(PortfolioPreview);
export const originalPortrait = {
  src: "/images/cinematic/original-portrait.jpg",
  width: 1080,
  height: 1080,
  alt: "Original photograph of Varghese Shibu",
};
