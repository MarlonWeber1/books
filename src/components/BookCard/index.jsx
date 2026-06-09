/**
 * BookCard — Card individual de resultado de busca
 *
 * Layout: thumbnail à esquerda + metadados à direita
 * Sem card 3-colunas iguais (proibido pelas skills).
 * Design: spotlight border sutil no hover, scale 0.98 no active.
 */

import { BookOpen, User, Calendar, Translate } from '@phosphor-icons/react'
import { getLanguageName, normalizeLanguageCode } from '../../utils/languageMapper'
import styles from './BookCard.module.css'

function getFirstLanguage(languages) {
  if (!languages?.length) return null
  return normalizeLanguageCode(languages[0])
}

export function BookCard({ book, isSelected, onClick }) {
  const isoLang = getFirstLanguage(book.languages)
  const langName = isoLang ? getLanguageName(isoLang) : null

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
          {langName && (
            <span className={styles.tag}>
              <Translate size={11} weight="fill" aria-hidden="true" />
              {langName}
            </span>
          )}
        </div>

        {book.editionCount > 0 && (
          <p className={styles.editions}>
            {book.editionCount} {book.editionCount === 1 ? 'edição' : 'edições'}
          </p>
        )}
      </div>

      {/* Indicador de seleção */}
      {isSelected && <span className={styles.selectedDot} aria-hidden="true" />}
    </article>
  )
}
