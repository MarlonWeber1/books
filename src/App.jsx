import { useBookSearch } from './hooks/useBookSearch'
import { SearchBar } from './components/SearchBar'
import { BookList } from './components/BookList'
import styles from './App.module.css'

/**
 * App — Shell principal da aplicação Biblioatlas.
 *
 * Layout split-screen:
 * - Coluna esquerda (380px): SearchBar + BookList
 * - Coluna direita (1fr): BookDetails + WorldMap (Commits 3 e 4)
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

  return (
    <div className={styles.root}>
      {/* Header */}
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

      {/* Main split layout */}
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
                onSelect={selectBook}
              />
            </aside>

            {/* Painel direito: detalhes + mapa (Commits 3 e 4) */}
            <section className={styles.panelRight}>
              {selectedBook ? (
                <div className={styles.placeholderPanel}>
                  <span className={styles.placeholderLabel}>Selecionado</span>
                  <p style={{ color: 'var(--ink-primary)', fontWeight: 500 }}>
                    {selectedBook.title}
                  </p>
                  <p>Detalhes e mapa adicionados nos Commits 3 e 4</p>
                </div>
              ) : (
                <div className={styles.placeholderPanel}>
                  <span className={styles.placeholderLabel}>Detalhes + Mapa</span>
                  <p>Selecione um livro para ver os detalhes</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
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
