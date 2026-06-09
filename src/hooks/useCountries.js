/**
 * useCountries.js — Hook para buscar países por um ou múltiplos idiomas
 */

import { useState, useEffect } from 'react'
import { fetchCountriesByLanguages } from '../services/restCountries'

/**
 * @param {string|string[]|null} languageCodes — ISO 639-1 code(s)
 */
export function useCountries(languageCodes) {
  const [countries, setCountries] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  // Normaliza para array e cria chave estável para o useEffect
  const codes = Array.isArray(languageCodes)
    ? languageCodes
    : languageCodes
    ? [languageCodes]
    : []

  const codeKey = codes.join(',')

  useEffect(() => {
    if (!codeKey) {
      setCountries([])
      setStatus('idle')
      setError(null)
      return
    }

    let cancelled = false
    setStatus('loading')
    setCountries([])
    setError(null)

    fetchCountriesByLanguages(codes)
      .then((data) => {
        if (cancelled) return
        setCountries(data)
        setStatus(data.length === 0 ? 'empty' : 'success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message ?? 'Erro ao buscar países.')
        setStatus('error')
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeKey])

  return { countries, status, error }
}
