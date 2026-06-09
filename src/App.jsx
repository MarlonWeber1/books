import { useState } from 'react'
import { useBookSearch } from './hooks/useBookSearch'
import { SearchBar } from './components/SearchBar'
import { BookList } from './components/BookList'
import { BookDetails } from './components/BookDetails'
import styles from './App.module.css'

/**
 * App — Shell principal da aplicação Biblioatlas.
 *
 * Estado gerenciado aqui:
 * - useBookSearch: query, results, selectedBook, status, error
 * - exploreLanguage: código ISO 639-1 do idioma a mapear (Commit 4)
 *
 * Layout split-screen:
 * - Coluna esquerda (380px): SearchBar + BookList
 * - Coluna direita (1fr)  : BookDetails + WorldMap
 */
function App() {
  const {
    query,
    results,
    selectedBook,
    status,
    error,
    search,
    selectBook,
    clear,
  } = useBookSearch()

  // Idioma a ser explorado no mapa (preenchido pelo botão "Ver no mapa")
  const [exploreLanguage, setExploreLanguage] = useState(null)

  function handleExploreMap(isoCode) {
    setExploreLanguage(isoCode)
    // WorldMap será adicionado no Commit 4
  }

  // Ao trocar de livro selecionado, limpa o mapa anterior
  function handleSelectBook(book) {
    selectBook(book)
    setExploreLanguage(null)
  }

  return (
    <div className={styles.root}>
      {/* ── Header ─────────────────────────────────── */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="5" y="4" width="13" height="18" rx="2" fill="#e8d5b0" stroke="#c4a96d" strokeWidth="1"/>
                <rect x="7" y="4" width="13" height="18" rx="2" fill="#f0e6c8" stroke="#c4a96d" strokeWidth="1"/>
                <line x1="10" y1="10" x2="17" y2="10" stroke="#9b8060" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="10" y1="13" x2="17" y2="13" stroke="#9b8060" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="22" cy="22" r="7" fill="#0e0f11" stroke="#c4a96d" strokeWidth="1.5"/>
                <path d="M22 19 L22 22 L24 24" stroke="#c4a96d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.brandName}>Biblioatlas</span>
            </div>
            <p className={styles.tagline}>
              Pesquise uma obra e veja os países onde seu idioma é falado
            </p>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────── */}
      <main className={styles.main}>
        <div className="container">
          <div className={styles.layout}>

            {/* Painel esquerdo: busca + listagem */}
            <aside className={styles.panelLeft}>
              <SearchBar
                value={query}
                onSearch={search}
                onClear={clear}
                isLoading={status === 'loading'}
              />
              <BookList
                results={results}
                status={status}
                error={error}
                query={query}
                selectedBook={selectedBook}
                onSelect={handleSelectBook}
              />
            </aside>

            {/* Painel direito: detalhes + mapa */}
            <section className={styles.panelRight}>
              <BookDetails
                book={selectedBook}
                onExploreMap={handleExploreMap}
              />
              {/* WorldMap adicionado no Commit 4 */}
              {exploreLanguage && (
                <div className={styles.mapPlaceholder}>
                  <span className={styles.placeholderLabel}>Mapa</span>
                  <p>
                    Buscando países com idioma{' '}
                    <strong style={{ color: 'var(--accent)' }}>
                      {exploreLanguage.toUpperCase()}
                    </strong>
                    …
                  </p>
                  <p>WorldMap adicionado no Commit 4</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <p>
            Dados via{' '}
            <a href="https://openlibrary.org/developers/api" target="_blank" rel="noreferrer">
              Open Library
            </a>{' '}
            e{' '}
            <a href="https://restcountries.com" target="_blank" rel="noreferrer">
              REST Countries
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
