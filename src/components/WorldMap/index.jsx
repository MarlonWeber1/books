/**
 * WorldMap — Mapa interativo com marcadores dos países por idioma
 *
 * Features:
 * - Tiles dark (CartoDB Dark Matter)
 * - Marcadores circulares customizados (cor accent do design system)
 * - Popup com bandeira, nome, capital e população
 * - Auto-ajuste de bounds ao carregar países
 * - Estados: loading skeleton, empty (idioma sem países), error, mapa
 * - Acessível: aria-label no container
 */

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, WifiSlash, Globe } from '@phosphor-icons/react'
import styles from './WorldMap.module.css'

// ── Ícone customizado (divIcon — evita o bug de paths no Vite) ──────────────
const MARKER_HTML = `
  <span style="
    display:block;
    width:12px;height:12px;
    border-radius:50%;
    background:#c4a96d;
    border:2px solid #8a7148;
    box-shadow:0 0 0 4px rgba(196,169,109,0.18);
    transition:transform 160ms cubic-bezier(0.23,1,0.32,1);
  "></span>
`

const markerIcon = L.divIcon({
  className: '',
  html: MARKER_HTML,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -10],
})

// ── Formata população com separador de milhar ──────────────────────────────
function formatPopulation(n) {
  if (!n) return '—'
  return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

// ── Componente interno: auto-ajusta o mapa aos países ─────────────────────
function BoundsFitter({ countries }) {
  const map = useMap()

  useEffect(() => {
    if (!countries.length) return
    const coords = countries
      .filter((c) => c.latlng)
      .map((c) => c.latlng)

    if (!coords.length) return

    try {
      const bounds = L.latLngBounds(coords)
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5, animate: true })
    } catch {
      // bounds inválidos (ex: país único sem área)
    }
  }, [countries, map])

  return null
}

// ── Estados alternativos ───────────────────────────────────────────────────
function MapSkeleton() {
  return (
    <div className={styles.statePanelInner} aria-busy="true" aria-label="Carregando mapa">
      <div className={`skeleton ${styles.skeletonMap}`} />
    </div>
  )
}

function EmptyState({ languageCode }) {
  return (
    <div className={styles.stateContent}>
      <div className={styles.stateIcon}>
        <Globe size={26} weight="duotone" />
      </div>
      <p className={styles.stateTitle}>Sem países mapeados</p>
      <p className={styles.stateDesc}>
        Nenhum país encontrado com o idioma{' '}
        <strong>{languageCode?.toUpperCase()}</strong> na base de dados.
      </p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className={styles.stateContent}>
      <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
        <WifiSlash size={24} weight="duotone" />
      </div>
      <p className={styles.stateTitle}>Falha ao carregar países</p>
      <p className={styles.stateDesc}>{message}</p>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export function WorldMap({ countries, status, error, languageCode, bookTitle }) {
  const mapRef = useRef(null)

  // Impede que eventos de scroll no mapa propaguem para a página
  function handleWheel(e) {
    e.stopPropagation()
  }

  return (
    <section
      className={`${styles.wrapper} stagger-item`}
      style={{ animationDelay: '60ms' }}
      aria-label={`Mapa: países com idioma ${languageCode?.toUpperCase() ?? ''}`}
      onWheel={handleWheel}
    >
      {/* Cabeçalho do mapa */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <MapPin size={15} weight="fill" aria-hidden="true" className={styles.pinIcon} />
          <span className={styles.headerTitle}>
            {bookTitle
              ? `Países onde "${bookTitle.length > 30 ? bookTitle.slice(0, 30) + '…' : bookTitle}" é lido`
              : 'Distribuição geográfica do idioma'}
          </span>
        </div>
        {status === 'success' && (
          <span className={styles.countBadge}>
            {countries.length} {countries.length === 1 ? 'país' : 'países'}
          </span>
        )}
      </div>

      {/* Corpo: mapa ou estado alternativo */}
      <div className={styles.mapArea}>
        {status === 'loading' && <MapSkeleton />}

        {status === 'empty' && (
          <div className={styles.statePanel}>
            <EmptyState languageCode={languageCode} />
          </div>
        )}

        {status === 'error' && (
          <div className={styles.statePanel}>
            <ErrorState message={error} />
          </div>
        )}

        {status === 'success' && countries.length > 0 && (
          <MapContainer
            ref={mapRef}
            center={[20, 10]}
            zoom={2}
            className={styles.leafletMap}
            scrollWheelZoom={true}
            zoomControl={true}
            attributionControl={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
            />

            <BoundsFitter countries={countries} />

            {countries.map((country) => (
              <Marker
                key={country.code ?? country.name}
                position={country.latlng}
                icon={markerIcon}
              >
                <Popup className={styles.popup}>
                  <div className={styles.popupContent}>
                    {/* Bandeira */}
                    {country.flagUrl && (
                      <img
                        src={country.flagUrl}
                        alt={`Bandeira de ${country.name}`}
                        className={styles.flag}
                      />
                    )}
                    {/* Info */}
                    <div className={styles.popupInfo}>
                      <strong className={styles.popupName}>{country.name}</strong>
                      {country.capital && (
                        <span className={styles.popupDetail}>
                          Capital: {country.capital}
                        </span>
                      )}
                      {country.population && (
                        <span className={styles.popupDetail}>
                          Pop.: {formatPopulation(country.population)}
                        </span>
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
