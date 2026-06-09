/**
 * useCountries.js — Hook para gerenciar o estado do mapa de países
 * Implementado no Commit 4 (feat-map-integration)
 */

import { useState, useCallback } from 'react'

/**
 * @returns {{
 *   countries: Array,
 *   status: 'idle'|'loading'|'success'|'error',
 *   error: string|null,
 *   loadCountries: (languageCode: string) => void,
 *   reset: () => void,
 * }}
 */
export function useCountries() {
  const [countries, setCountries] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const loadCountries = useCallback(async (languageCode) => {
    // Implementado no Commit 4
  }, [])

  const reset = useCallback(() => {
    setCountries([])
    setStatus('idle')
    setError(null)
  }, [])

  return { countries, status, error, loadCountries, reset }
}
