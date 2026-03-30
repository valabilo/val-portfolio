// src/hooks/usePortfolio.js
// Single hook that fetches ALL portfolio data from one endpoint.
// Every page/component imports from this hook — no duplicate requests.
import { useState, useEffect } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;

let cache = null; // module-level cache so refetching is avoided on navigation

export function usePortfolio() {
  const [data, setData] = useState(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) {
      setData(cache);
      setLoading(false);
      return;
    }
    axios
      .get(BASE + "/api/portfolio")
      .then((res) => {
        cache = res.data;
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
