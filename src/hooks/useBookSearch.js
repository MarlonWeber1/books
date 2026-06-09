/**
 * useBookSearch.js — Hook para gerenciar o estado da busca de livros
 * Implementado no Commit 2 (feat-book-search)
 */

import { useState, useCallback } from 'react'

/**
 * @returns {{
 *   query: string,
 *   results: Array,
 *   selectedBook: Object|null,
 *   status: 'idle'|'loading'|'success'|'error',
 *   error: string|null,
 *   search: (q: string) => void,
 *   selectBook: (book: Object) => void,
 *   clearSelection: () => void,
 * }}
 */
export function useBookSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  const search = useCallback(async (q) => {
    // Implementado no Commit 2
  }, [])

  const selectBook = useCallback((book) => {
    setSelectedBook(book)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedBook(null)
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
  }
}
