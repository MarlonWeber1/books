/**
 * BookList — Lista de resultados com skeleton, empty state e error state
 *
 * Estados tratados:
 * - idle    : nenhuma busca realizada ainda (prompt inicial)
 * - loading : skeleton shimmer com N placeholders
 * - success + results.length === 0 : empty state
 * - success + results.length > 0   : lista com stagger de entrada
 * - error   : mensagem de erro com opção de tentar novamente
 */

import { BookOpen, MagnifyingGlass, WifiSlash } from '@phosphor-icons/react'
import { BookCard } from '../BookCard'
import styles from './BookList.module.css'

// Quantidade de skeletons exibidos enquanto carrega
const SKELETON_COUNT = 6

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonCover}`} />
      <div className={styles.skeletonMeta}>
        <div className={`skeleton ${styles.skeletonTitle}`} />
        <div className={`skeleton ${styles.skeletonLine}`} />
        <div className={styles.skeletonTags}>
          <div className={`skeleton ${styles.skeletonTag}`} />
          <div className={`skeleton ${styles.skeletonTag}`} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div className={styles.emptyState} role="status">
      <div className={styles.emptyIcon}>
        <BookOpen size={32} weight="duotone" />
      </div>
      <p className={styles.emptyTitle}>Nenhum resultado</p>
      <p className={styles.emptyDesc}>
        Não encontramos obras para{' '}
        <strong>&ldquo;{query}&rdquo;</strong>.<br />
        Tente um título diferente ou em outro idioma.
      </p>
    </div>
  )
}

function IdleState() {
  return (
    <div className={styles.emptyState} role="status">
      <div className={styles.emptyIcon}>
        <MagnifyingGlass size={30} weight="duotone" />
      </div>
      <p className={styles.emptyTitle}>Pesquise uma obra</p>
      <p className={styles.emptyDesc}>
        Digite o título de um livro acima para começar.
      </p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className={styles.errorState} role="alert">
      <div className={`${styles.emptyIcon} ${styles.errorIcon}`}>
        <WifiSlash size={28} weight="duotone" />
      </div>
      <p className={styles.emptyTitle}>Falha na conexão</p>
      <p className={styles.emptyDesc}>{message}</p>
    </div>
  )
}

export function BookList({ results, status, error, query, selectedBook, onSelect }) {
  if (status === 'idle') {
    return <IdleState />
  }

  if (status === 'loading') {
    return (
      <section aria-busy="true" aria-label="Carregando resultados">
        <div className={styles.list}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return <ErrorState message={error} />
  }

  if (status === 'success' && results.length === 0) {
    return <EmptyState query={query} />
  }

  return (
    <section aria-label={`${results.length} resultado(s) para "${query}"`}>
      <p className={styles.resultCount}>
        {results.length} resultado{results.length !== 1 ? 's' : ''}
      </p>
      <div className={styles.list}>
        {results.map((book, index) => (
          <div
            key={book.key ?? index}
            className="stagger-item"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <BookCard
              book={book}
              isSelected={selectedBook?.key === book.key}
              onClick={() => onSelect(book)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
