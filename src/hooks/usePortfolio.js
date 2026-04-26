// src/hooks/usePortfolio.js
// Legacy hook — now returns static data, no API call needed
import data from "../data/portfolio.json";

export function usePortfolio() {
  return { data, loading: false, error: null };
}
