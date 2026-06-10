/**
 * BookCard — Card individual de resultado de busca
 *
 * Layout: thumbnail à esquerda + metadados à direita
 * Sem card 3-colunas iguais (proibido pelas skills).
 * Design: spotlight border sutil no hover, scale 0.98 no active.
 *
 * Nota: o campo de idioma foi removido deste card.
 * A Open Library retorna os idiomas de TODAS as edições sem ordem garantida,
 * tornando inviável exibir um idioma confiável no card de busca.
 * O idioma é exibido e selecionável no painel BookDetails (após clicar no livro),
 * onde a função detectPrimaryLanguage() aplica a ordem de prioridade correta.
 */

import { BookOpen, User, Calendar } from '@phosphor-icons/react'
import styles from './BookCard.module.css'

export function BookCard({ book, isSelected, onClick }) {
  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Capa do livro */}
      <div className={styles.cover}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa de ${book.title}`}
            className={styles.coverImg}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={styles.coverFallback}
          style={{ display: book.coverUrl ? 'none' : 'flex' }}
          aria-hidden="true"
        >
          <BookOpen size={22} weight="duotone" />
        </div>
      </div>

      {/* Metadados */}
      <div className={styles.meta}>
        <h3 className={styles.title}>{book.title}</h3>

        {book.authors.length > 0 && (
          <p className={styles.metaRow}>
            <User size={12} weight="fill" aria-hidden="true" />
            <span>{book.authors.slice(0, 2).join(', ')}</span>
          </p>
        )}

        <div className={styles.tags}>
          {book.year && (
            <span className={styles.tag}>
              <Calendar size={11} weight="fill" aria-hidden="true" />
              {book.year}
            </span>
          )}
          {book.editionCount > 0 && (
            <span className={styles.tag}>
              {book.editionCount} {book.editionCount === 1 ? 'edição' : 'edições'}
            </span>
          )}
        </div>
      </div>

      {/* Indicador de seleção */}
      {isSelected && <span className={styles.selectedDot} aria-hidden="true" />}
    </article>
  )
}
