/**
 * WorldMap — Mapa interativo com marcadores dos países por idioma
 *
 * Fixes aplicados:
 * 1. CSS do Leaflet movido para main.jsx (import global)
 * 2. Altura do MapContainer explícita em px (não 100% relativo)
 * 3. Estado idle com instrução visível
 * 4. Invalidação de tamanho após mount (invalidateSize)
 */

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, WifiSlash, Globe, ArrowRight } from '@phosphor-icons/react'
import styles from './WorldMap.module.css'

const MAP_HEIGHT = 380

// ── Ícone de bandeira por país ──────────────────────────────────────────────
function createFlagIcon(flagUrl, countryName) {
  if (!flagUrl) {
    // Fallback: marcador circular dourado
    return L.divIcon({
      className: '',
      html: `<span style="
        display:block;width:14px;height:14px;border-radius:50%;
        background:#c4a96d;border:2px solid #8a7148;
        box-shadow:0 0 0 4px rgba(196,169,109,0.20);
      "></span>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    })
  }

  const html = `
    <div style="
      width:22px;height:22px;
      border-radius:50%;
      overflow:hidden;
      border:2px solid rgba(255,255,255,0.30);
      box-shadow:0 2px 6px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.18);
      cursor:pointer;
    ">
      <img
        src="${flagUrl}"
        alt="${countryName}"
        style="width:100%;height:100%;object-fit:cover;display:block"
        loading="lazy"
      />
    </div>
  `

  return L.divIcon({
    className: '',
    html,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  })
}

// Ícone fallback reutilizável (sem bandeira)
const fallbackIcon = createFlagIcon(null, '')

function formatPopulation(n) {
  if (!n) return '—'
  return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

// ── Auto-ajusta bounds e corrige tamanho após mount ─────────────────────────
function MapController({ countries }) {
  const map = useMap()

  useEffect(() => {
    // Força o Leaflet a recalcular o tamanho do container após o mount
    setTimeout(() => map.invalidateSize(), 0)
  }, [map])

  useEffect(() => {
    if (!countries.length) return
    const coords = countries.filter((c) => Array.isArray(c.latlng)).map((c) => c.latlng)
    if (!coords.length) return
    try {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5, animate: true })
    } catch {
      // bounds inválidos para um único ponto
      if (countries[0]?.latlng) {
        map.setView(countries[0].latlng, 4)
      }
    }
  }, [countries, map])

  return null
}

// ── Estados alternativos ────────────────────────────────────────────────────
// ── Estado skeleton com indicador de lentidão ──────────────────────────────
function MapSkeleton({ isSlow }) {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className={`skeleton ${styles.skeleton}`} aria-label="Carregando mapa…" />
      {isSlow && (
        <div className={styles.slowIndicator} aria-live="polite">
          A API está demorando mais que o esperado…
        </div>
      )}
    </div>
  )
}

function IdleState() {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateContent}>
        <div className={styles.stateIcon}>
          <ArrowRight size={22} weight="bold" />
        </div>
        <p className={styles.stateTitle}>Clique em "Ver no mapa"</p>
        <p className={styles.stateDesc}>
          Selecione um livro e clique no botão para ver os países no mapa.
        </p>
      </div>
    </div>
  )
}

function EmptyState({ languageCode }) {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateContent}>
        <div className={styles.stateIcon}><Globe size={24} weight="duotone" /></div>
        <p className={styles.stateTitle}>Sem países mapeados</p>
        <p className={styles.stateDesc}>
          Nenhum país encontrado com o idioma{' '}
          <strong>{languageCode?.toUpperCase()}</strong> na base de dados.
        </p>
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateContent}>
        <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
          <WifiSlash size={22} weight="duotone" />
        </div>
        <p className={styles.stateTitle}>Falha ao carregar países</p>
        <p className={styles.stateDesc}>{message}</p>
      </div>
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────
export function WorldMap({ countries, status, error, isSlow, languageCodes, bookTitle }) {
  const sectionRef = useRef(null)
  const codes = Array.isArray(languageCodes) ? languageCodes : languageCodes ? [languageCodes] : []
  const showMap = status === 'success' && countries.length > 0

  const langLabel = codes.length > 0
    ? codes.map(c => c.toUpperCase()).join(' + ')
    : ''

  return (
    <section
      ref={sectionRef}
      className={`${styles.wrapper} stagger-item`}
      style={{ animationDelay: '80ms' }}
      aria-label={`Mapa de países por idioma`}
    >
      {/* Cabeçalho */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <MapPin size={14} weight="fill" aria-hidden="true" className={styles.pinIcon} />
          <span className={styles.headerTitle}>
            {bookTitle
              ? `"${bookTitle.length > 28 ? bookTitle.slice(0, 28) + '…' : bookTitle}"`
              : 'Distribuição geográfica'}
            {langLabel ? ` · ${langLabel}` : ''}
          </span>
        </div>
        {status === 'success' && (
          <span className={styles.countBadge}>
            {countries.length} {countries.length === 1 ? 'país' : 'países'}
          </span>
        )}
        {status === 'loading' && (
          <span className={styles.loadingBadge}>Buscando…</span>
        )}
      </div>

      {/* Corpo */}
      <div className={styles.mapArea} style={{ height: MAP_HEIGHT }}>

        {(status === 'idle') && <IdleState />}
        {status === 'loading' && <MapSkeleton isSlow={isSlow} />}
        {status === 'empty' && <EmptyState languageCode={langLabel} />}
        {status === 'error' && <ErrorState message={error} />}

        {showMap && (
          <MapContainer
            key={codes.join(',')}         /* remonta ao mudar seleção */
            center={[20, 10]}
            zoom={2}
            style={{ height: MAP_HEIGHT, width: '100%' }}
            scrollWheelZoom
            zoomControl
            attributionControl
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
            />

            <MapController countries={countries} />

            {countries.map((country) => (
              <Marker
                key={country.code ?? country.name}
                position={country.latlng}
                icon={createFlagIcon(country.flagUrl, country.name)}
              >
                <Popup>
                  <div className={styles.popupContent}>
                    {country.flagUrl && (
                      <img
                        src={country.flagUrl}
                        alt={`Bandeira de ${country.name}`}
                        className={styles.flag}
                      />
                    )}
                    <div className={styles.popupInfo}>
                      <strong className={styles.popupName}>{country.name}</strong>
                      {country.capital && (
                        <span className={styles.popupDetail}>Cap.: {country.capital}</span>
                      )}
                      {country.population && (
                        <span className={styles.popupDetail}>Pop.: {formatPopulation(country.population)}</span>
                      )}
                      {country.region && (
                        <span className={styles.popupRegion}>{country.region}</span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </section>
  )
}
