import { useState, useEffect } from 'react'
import { BookOpen, User, Calendar, Books, ArrowSquareOut, Globe } from '@phosphor-icons/react'
import { useBookDetails } from '../../hooks/useBookDetails'
import {
  detectPrimaryLanguage,
  detectAllLanguages,
  getLanguageName,
} from '../../utils/languageMapper'
import { getCoverUrl } from '../../services/openLibrary'
import styles from './BookDetails.module.css'

function EmptyPanel() {
  return (
    <div className={styles.emptyPanel}>
      <div className={styles.emptyIllustration} aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <rect x="8" y="14" width="30" height="40" rx="4" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5"/>
          <rect x="12" y="14" width="30" height="40" rx="4" fill="var(--bg-overlay)" stroke="var(--border-default)" strokeWidth="1.5"/>
          <line x1="18" y1="26" x2="36" y2="26" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="31" x2="36" y2="31" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="36" x2="28" y2="36" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="52" cy="46" r="14" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5"/>
          <ellipse cx="52" cy="46" rx="5.5" ry="14" fill="none" stroke="var(--accent-dim)" strokeWidth="1"/>
          <line x1="38" y1="46" x2="66" y2="46" stroke="var(--accent-dim)" strokeWidth="1"/>
        </svg>
      </div>
      <p className={styles.emptyTitle}>Selecione uma obra</p>
      <p className={styles.emptyDesc}>
        Clique em um livro à esquerda para ver os detalhes
        e o mapa dos países onde seu idioma é falado.
      </p>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className={styles.skeletonWrap} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonDesc}`} />
      <div className={`skeleton ${styles.skeletonDescShort}`} />
      <div className={`skeleton ${styles.skeletonDescShort}`} style={{ width: '55%' }} />
    </div>
  )
}

export function BookDetails({ book, onLanguagesChange }) {
  const { details, status: detailsStatus } = useBookDetails(book?.key)

  const allLangs = book ? detectAllLanguages(book.languages) : []
  const primaryLang = book ? detectPrimaryLanguage(book.languages) : null

  // Multi-seleção: começa com o idioma principal selecionado
  const [selected, setSelected] = useState(primaryLang ? [primaryLang] : [])

  // Reseta ao trocar de livro
  useEffect(() => {
    const initial = primaryLang ? [primaryLang] : []
    setSelected(initial)
    onLanguagesChange?.(initial)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.key])

  function toggleLang(iso) {
    setSelected((prev) => {
      const next = prev.includes(iso)
        ? prev.filter((l) => l !== iso)  // remove
        : [...prev, iso]                  // adiciona
      // Garante ao menos um selecionado
      const final = next.length ? next : [iso]
      onLanguagesChange?.(final)
      return final
    })
  }

  if (!book) return <EmptyPanel />

  const coverLarge = getCoverUrl(book.coverId, 'L')
  const openLibraryUrl = `https://openlibrary.org${book.key}`

  return (
    <article className={`${styles.panel} stagger-item`} style={{ animationDelay: '0ms' }}>

      {/* ── Capa + Info ─────────────────────────────────────── */}
      <div className={styles.topSection}>
        <div className={styles.coverWrap}>
          {coverLarge ? (
            <img
              src={coverLarge}
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
            style={{ display: coverLarge ? 'none' : 'flex' }}
            aria-hidden="true"
          >
            <BookOpen size={36} weight="duotone" />
          </div>
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{book.title}</h2>

          {book.authors.length > 0 && (
            <p className={styles.authors}>
              <User size={13} weight="fill" aria-hidden="true" />
              {book.authors.join(', ')}
            </p>
          )}

          <div className={styles.metaRow}>
            {book.year && (
              <span className={styles.metaItem}>
                <Calendar size={12} weight="fill" aria-hidden="true" />
                {book.year}
              </span>
            )}
            {book.editionCount > 0 && (
              <span className={styles.metaItem}>
                <Books size={12} weight="fill" aria-hidden="true" />
                {book.editionCount} {book.editionCount === 1 ? 'edição' : 'edições'}
              </span>
            )}
          </div>

          <div className={styles.divider} />

          {/* ── Seleção de idiomas ─────────────────────────── */}
          <div className={styles.langSection}>
            <p className={styles.langLabel}>
              <Globe size={13} weight="bold" aria-hidden="true" />
              {allLangs.length > 1
                ? `Idiomas detectados — selecione para mapear`
                : 'Idioma da obra'}
            </p>

            {allLangs.length > 0 ? (
              <>
                <div className={styles.langPills} role="group" aria-label="Selecione idiomas para o mapa">
                  {allLangs.map((iso) => {
                    const isActive = selected.includes(iso)
                    return (
                      <button
                        key={iso}
                        type="button"
                        className={`${styles.langPill} ${isActive ? styles.langPillActive : ''}`}
                        onClick={() => toggleLang(iso)}
                        aria-pressed={isActive}
                        title={`${isActive ? 'Remover' : 'Adicionar'} ${getLanguageName(iso)}`}
                      >
                        <span className={styles.langPillIso}>{iso.toUpperCase()}</span>
                        <span className={styles.langPillName}>{getLanguageName(iso)}</span>
                        {isActive && <span className={styles.checkMark} aria-hidden="true">✓</span>}
                      </button>
                    )
                  })}
                </div>
                {selected.length > 0 && (
                  <p className={styles.selectionHint}>
                    {selected.length === 1
                      ? `Mostrando países com idioma: ${getLanguageName(selected[0])}`
                      : `Mostrando países com ${selected.length} idiomas combinados`}
                  </p>
                )}
              </>
            ) : (
              <p className={styles.langUnknown}>Idioma não informado nesta edição</p>
            )}
          </div>

          {/* ── Ações ─────────────────────────────────────── */}
          <div className={styles.actions}>
            <a
              href={openLibraryUrl}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-ghost ${styles.olLink}`}
            >
              <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
              Ver no Open Library
            </a>
          </div>
        </div>
      </div>

      {/* ── Detalhes extras ──────────────────────────────────── */}
      {detailsStatus === 'loading' && <DetailsSkeleton />}

      {detailsStatus === 'success' && details && (
        <div className={styles.bottomSection}>
          {details.description && (
            <div className={styles.descBlock}>
              <h3 className={styles.sectionLabel}>Sinopse</h3>
              <p className={styles.description}>
                {details.description.length > 600
                  ? details.description.slice(0, 600) + '…'
                  : details.description}
              </p>
            </div>
          )}
          {details.subjects.length > 0 && (
            <div className={styles.subjectsBlock}>
              <h3 className={styles.sectionLabel}>Assuntos</h3>
              <div className={styles.tagsList}>
                {details.subjects.map((s) => (
                  <span key={s} className={styles.subjectTag}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {details.subjectPlaces.length > 0 && (
            <div className={styles.subjectsBlock}>
              <h3 className={styles.sectionLabel}>Lugares</h3>
              <div className={styles.tagsList}>
                {details.subjectPlaces.map((p) => (
                  <span key={p} className={styles.subjectTag}>{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
