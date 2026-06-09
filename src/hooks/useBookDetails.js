/**
 * useBookDetails.js — Hook para buscar detalhes extras de uma obra
 *
 * Busca a descrição e metadados da Works API quando um livro é selecionado.
 * Os dados essenciais (título, autor, capa, idioma) já vêm da busca —
 * este hook só complementa com descrição e assuntos.
 */

import { useState, useEffect } from 'react'
import { fetchBookDetails } from '../services/openLibrary'

export function useBookDetails(workKey) {
  const [details, setDetails] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  useEffect(() => {
    if (!workKey) {
      setDetails(null)
      setStatus('idle')
      return
    }

    let cancelled = false
    setStatus('loading')
    setDetails(null)

    fetchBookDetails(workKey)
      .then((data) => {
        if (!cancelled) {
          setDetails(data)
          setStatus('success')
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Detalhes extras são opcionais — falha silenciosa
          setDetails(null)
          setStatus('error')
        }
      })

    return () => { cancelled = true }
  }, [workKey])

  return { details, status }
}
