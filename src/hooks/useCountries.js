/**
 * useCountries.js — Hook para gerenciar o estado do mapa de países
 *
 * Dispara a requisição automaticamente quando o código de idioma muda.
 * Usa cleanup de efeito para evitar race conditions.
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchCountriesByLanguage } from '../services/restCountries'

export function useCountries(languageCode) {
  const [countries, setCountries] = useState([])
  const [status, setStatus] = useState('idle') // 'idle'|'loading'|'success'|'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!languageCode) {
      setCountries([])
      setStatus('idle')
      setError(null)
      return
    }

    let cancelled = false
    setStatus('loading')
    setCountries([])
    setError(null)

    fetchCountriesByLanguage(languageCode)
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
  }, [languageCode])

  const reset = useCallback(() => {
    setCountries([])
    setStatus('idle')
    setError(null)
  }, [])

  return { countries, status, error, reset }
}
