/**
 * useBookSearch.js — Hook de gerenciamento de estado da busca
 *
 * Responsabilidades:
 * - Debounce de 400ms antes de disparar a requisição
 * - Cancelamento de requisições obsoletas via AbortController
 * - Máquina de estados: idle → loading → success | error
 * - Seleção de livro para exibição nos painéis de detalhes/mapa
 */

import { useState, useCallback, useRef } from 'react'
import { searchBooks } from '../services/openLibrary'

const DEBOUNCE_MS = 400

export function useBookSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  const debounceTimer = useRef(null)

  /**
   * Inicia uma busca debounced.
   * Cancela a busca anterior se o usuário ainda estiver digitando.
   */
  const search = useCallback((q) => {
    setQuery(q)
    clearTimeout(debounceTimer.current)

    if (!q.trim()) {
      setResults([])
      setStatus('idle')
      setError(null)
      return
    }

    setStatus('loading')

    debounceTimer.current = setTimeout(async () => {
      try {
        const books = await searchBooks(q)
        setResults(books)
        setStatus('success')
        setError(null)
        // Limpa seleção anterior se nova busca foi realizada
        setSelectedBook(null)
      } catch (err) {
        // Ignora erros de abort (usuário digitou mais rápido)
        if (err.name === 'AbortError' || err.name === 'TimeoutError') return
        setError(err.message ?? 'Erro ao buscar livros. Tente novamente.')
        setStatus('error')
        setResults([])
      }
    }, DEBOUNCE_MS)
  }, [])

  const selectBook = useCallback((book) => {
    setSelectedBook(book)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedBook(null)
  }, [])

  const clear = useCallback(() => {
    clearTimeout(debounceTimer.current)
    setQuery('')
    setResults([])
    setSelectedBook(null)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    query,
    results,
    selectedBook,
    status,
    error,
    search,
    selectBook,
    clearSelection,
    clear,
  }
}
