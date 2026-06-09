import { useState } from 'react'
import { useBookSearch } from './hooks/useBookSearch'
import { useCountries } from './hooks/useCountries'
import { SearchBar } from './components/SearchBar'
import { BookList } from './components/BookList'
import { BookDetails } from './components/BookDetails'
import { WorldMap } from './components/WorldMap'
import styles from './App.module.css'

/**
 * App — Shell principal da aplicação Biblioatlas.
 *
 * Fluxo de dados:
 * 1. Usuário digita → useBookSearch dispara busca debounced
 * 2. Usuário clica em livro → selectedBook definido
 * 3. BookDetails detecta idiomas e seleciona o principal por padrão
 * 4. useCountries reage ao array de idiomas selecionados
 * 5. WorldMap renderiza marcadores dos países retornados
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

  // Array de códigos ISO dos idiomas atualmente selecionados no BookDetails
  const [selectedLanguages, setSelectedLanguages] = useState([])

  // Reage automaticamente à mudança de idiomas selecionados
  const { countries, status: mapStatus, error: mapError } = useCountries(selectedLanguages)

  function handleSelectBook(book) {
    selectBook(book)
    setSelectedLanguages([]) // reseta — BookDetails vai notificar com o primário
  }

  return (
    <div className={styles.root}>
      {/* ── Header ─────────────────────────────────────────── */}
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

      {/* ── Main ───────────────────────────────────────────── */}
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
                onLanguagesChange={setSelectedLanguages}
              />

              {/* Mapa: visível sempre que um livro está selecionado */}
              {selectedBook && (
                <WorldMap
                  countries={countries}
                  status={mapStatus}
                  error={mapError}
                  languageCodes={selectedLanguages}
                  bookTitle={selectedBook?.title}
                />
              )}
            </section>

          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
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
