/**
 * useCountries.js — Hook para buscar países por um ou múltiplos idiomas
 *
 * Melhorias (Commit 5 - fix-error-handling):
 * - Indicador de lentidão após 6s de loading (isSlow)
 * - Mensagem de erro diferenciada para falha de rede vs erro de API
 * - Retry já está encapsulado no fetchWithRetry dentro de restCountries.js
 */

import { useState, useEffect } from 'react'
import { fetchCountriesByLanguages } from '../services/restCountries'

const SLOW_THRESHOLD_MS = 6_000

/**
 * @param {string|string[]|null} languageCodes — ISO 639-1 code(s)
 */
export function useCountries(languageCodes) {
  const [countries, setCountries] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [isSlow, setIsSlow] = useState(false)

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
      setIsSlow(false)
      return
    }

    let cancelled = false
    let slowTimer = null

    setStatus('loading')
    setCountries([])
    setError(null)
    setIsSlow(false)

    // Indica lentidão se a resposta demorar mais de 6 segundos
    slowTimer = setTimeout(() => {
      if (!cancelled) setIsSlow(true)
    }, SLOW_THRESHOLD_MS)

    fetchCountriesByLanguages(codes)
      .then((data) => {
        if (cancelled) return
        setCountries(data)
        setStatus(data.length === 0 ? 'empty' : 'success')
        setIsSlow(false)
      })
      .catch((err) => {
        if (cancelled) return
        const isNetworkError = !navigator.onLine || err.message?.includes('fetch')
        setError(
          isNetworkError
            ? 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
            : (err.message ?? 'Erro ao buscar países. Tente novamente.')
        )
        setStatus('error')
        setIsSlow(false)
      })
      .finally(() => {
        clearTimeout(slowTimer)
      })

    return () => {
      cancelled = true
      clearTimeout(slowTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeKey])

  return { countries, status, error, isSlow }
}
