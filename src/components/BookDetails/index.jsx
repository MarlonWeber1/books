/**
 * BookDetails — Painel de detalhes da obra selecionada
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────┐
 *   │  [Capa L]   Título (proeminente)                 │
 *   │  200×280    Autor(es)                            │
 *   │             Ano · Edições                        │
 *   │             ─────────────────────────────────    │
 *   │             Idioma Principal  [badge ISO]        │
 *   │             [btn: Explorar no Mapa →]            │
 *   └──────────────────────────────────────────────────┘
 *   │  Sinopse (se disponível)                        │
 *   │  Tags de assuntos                               │
 *   └──────────────────────────────────────────────────┘
 */

import { BookOpen, User, Calendar, Books, Translate, ArrowSquareOut, Globe } from '@phosphor-icons/react'
import { useBookDetails } from '../../hooks/useBookDetails'
import { normalizeLanguageCode, getLanguageName } from '../../utils/languageMapper'
import { getCoverUrl } from '../../services/openLibrary'
import styles from './BookDetails.module.css'

/** Extrai e normaliza o idioma principal de um livro */
function getPrimaryLanguage(languages) {
  if (!languages?.length) return null
  for (const lang of languages) {
    const iso = normalizeLanguageCode(lang)
    if (iso) return iso
  }
  return null
}

/** Estado quando nenhum livro está selecionado */
function EmptyPanel() {
  return (
    <div className={styles.emptyPanel}>
      <div className={styles.emptyIllustration} aria-hidden="true">
        {/* SVG: livro aberto + globo */}
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <rect x="8" y="14" width="30" height="40" rx="4" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1.5"/>
          <rect x="12" y="14" width="30" height="40" rx="4" fill="var(--bg-overlay)" stroke="var(--border-default)" strokeWidth="1.5"/>
          <line x1="18" y1="26" x2="36" y2="26" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="31" x2="36" y2="31" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="36" x2="28" y2="36" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="52" cy="46" r="14" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5"/>
          <ellipse cx="52" cy="46" rx="5.5" ry="14" fill="none" stroke="var(--accent-dim)" strokeWidth="1"/>
          <line x1="38" y1="46" x2="66" y2="46" stroke="var(--accent-dim)" strokeWidth="1"/>
          <line x1="40" y1="39" x2="64" y2="39" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2"/>
          <line x1="40" y1="53" x2="64" y2="53" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2"/>
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

/** Skeleton para o painel enquanto carrega detalhes extras */
function DetailsSkeleton() {
  return (
    <div className={styles.skeletonWrap} aria-hidden="true">
      <div className={`skeleton ${styles.skeletonDesc}`} />
      <div className={`skeleton ${styles.skeletonDescShort}`} />
      <div className={`skeleton ${styles.skeletonDescShort}`} style={{ width: '55%' }} />
    </div>
  )
}

export function BookDetails({ book, onExploreMap }) {
  const { details, status: detailsStatus } = useBookDetails(book?.key)

  if (!book) return <EmptyPanel />

  const isoLang = getPrimaryLanguage(book.languages)
  const langName = isoLang ? getLanguageName(isoLang) : null
  const coverLarge = getCoverUrl(book.coverId, 'L')
  const openLibraryUrl = `https://openlibrary.org${book.key}`

  return (
    <article className={`${styles.panel} stagger-item`} style={{ animationDelay: '0ms' }}>

      {/* ── Seção superior: capa + info principal ── */}
      <div className={styles.topSection}>

        {/* Capa grande */}
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

        {/* Metadados principais */}
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

          {/* Separador */}
          <div className={styles.divider} />

          {/* Idioma principal */}
          <div className={styles.langSection}>
            <p className={styles.langLabel}>
              <Translate size={13} weight="bold" aria-hidden="true" />
              Idioma principal
            </p>

            {isoLang ? (
              <div className={styles.langBadge}>
                <span className={styles.langIso}>{isoLang.toUpperCase()}</span>
                <span className={styles.langName}>{langName}</span>
              </div>
            ) : (
              <p className={styles.langUnknown}>Não informado</p>
            )}
          </div>

          {/* Botão de ação */}
          <div className={styles.actions}>
            <button
              className={`btn btn-primary ${styles.mapBtn}`}
              onClick={() => onExploreMap(isoLang)}
              disabled={!isoLang}
              title={!isoLang ? 'Idioma não disponível para este livro' : undefined}
            >
              <Globe size={16} weight="bold" aria-hidden="true" />
              Ver no mapa
            </button>

            <a
              href={openLibraryUrl}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-ghost ${styles.olLink}`}
            >
              Open Library
              <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Seção de detalhes extras (works API) ── */}
      {detailsStatus === 'loading' && <DetailsSkeleton />}

      {detailsStatus === 'success' && details && (
        <div className={styles.bottomSection}>

          {/* Sinopse */}
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

          {/* Tags de assuntos */}
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

          {/* Lugares */}
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
