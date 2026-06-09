/**
 * SearchBar — Campo de busca principal
 *
 * Features:
 * - Ícone de lupa (Phosphor Icons)
 * - Botão X para limpar (aparece com animação quando há texto)
 * - Indicador de loading inline
 * - Foco automático em mount
 * - Hint de atalho kbd visível no desktop
 */

import { useRef, useEffect } from 'react'
import { MagnifyingGlass, X, CircleNotch } from '@phosphor-icons/react'
import styles from './SearchBar.module.css'

export function SearchBar({ value, onSearch, onClear, isLoading }) {
  const inputRef = useRef(null)

  // Foco automático no mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(e) {
    onSearch(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClear()
      inputRef.current?.blur()
    }
  }

  const hasValue = value.length > 0

  return (
    <div className={styles.wrapper} role="search">
      <label htmlFor="book-search" className={styles.label}>
        Pesquisar obra
      </label>

      <div className={styles.inputRow}>
        {/* Ícone de lupa ou spinner */}
        <span className={styles.iconLeft} aria-hidden="true">
          {isLoading ? (
            <CircleNotch size={18} weight="bold" className={styles.spinner} />
          ) : (
            <MagnifyingGlass size={18} weight="bold" />
          )}
        </span>

        <input
          ref={inputRef}
          id="book-search"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={styles.input}
          placeholder="Ex: Dom Quixote, 1984, Harry Potter…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Título do livro"
          aria-busy={isLoading}
        />

        {/* Botão limpar — aparece com fade quando há texto */}
        <button
          type="button"
          className={`${styles.clearBtn} ${hasValue ? styles.clearVisible : ''}`}
          onClick={onClear}
          aria-label="Limpar busca"
          tabIndex={hasValue ? 0 : -1}
        >
          <X size={15} weight="bold" />
        </button>
      </div>

      <p className={styles.hint} id="book-search-hint">
        Digite para buscar. <kbd>Esc</kbd> limpa o campo.
      </p>
    </div>
  )
}
