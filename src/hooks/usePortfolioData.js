// src/hooks/usePortfolioData.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

/**
 * Fetches the full portfolio payload from GET /api/portfolio once on mount.
 * Returns { data, loading, error } where data is:
 * {
 *   profile:     { name, role, bio, location, email, phone, linkedin_url, github_url, available }
 *   experiences: [ { key, title, sub, status, type, date, bullets[], tags[] } ]
 *   skillSuites: [ { id, label, countText, tests: [{ name, pct, tag }] } ]
 *   projects:    [ { id, icon, name, label, type, desc, github, meta[][], tags[] } ]
 * }
 */
export function usePortfolioData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      try {
        const res = await axios.get(`${API}/api/portfolio`)
        if (!cancelled) setData(res.data)
      } catch (err) {
        if (!cancelled) {
          console.error('[usePortfolioData] fetch failed:', err)
          setError(err.message ?? 'Failed to load portfolio data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
