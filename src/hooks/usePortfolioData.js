// src/hooks/usePortfolioData.js
import data from "../data/portfolio.json";

export function usePortfolioData() {
  return { data, loading: false, error: null };
}
