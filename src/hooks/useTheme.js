/**
 * useTheme.js — Gerencia tema claro/escuro
 *
 * Persiste a preferência em localStorage.
 * Respeita prefers-color-scheme como valor inicial quando não há preferência salva.
 * Aplica a classe `theme-transitioning` por 300ms para a transição suave de cores.
 */

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'biblioatlas-theme'
const TRANSITION_MS = 300

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch (_) { /* localStorage bloqueado */ }

  // Fallback: preferência do sistema
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  // Aplica o atributo no <html> e o flag de transição
  useEffect(() => {
    const html = document.documentElement

    // Inicia transição de cor suave
    html.classList.add('theme-transitioning')
    html.setAttribute('data-theme', theme)

    const timer = setTimeout(() => {
      html.classList.remove('theme-transitioning')
    }, TRANSITION_MS)

    // Persiste a escolha
    try { localStorage.setItem(STORAGE_KEY, theme) } catch (_) { /* */ }

    return () => clearTimeout(timer)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = theme === 'dark'

  return { theme, isDark, toggle }
}
