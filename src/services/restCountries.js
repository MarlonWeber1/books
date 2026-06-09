/**
 * restCountries.js — Serviço para a REST Countries API v3.1
 * https://restcountries.com
 */

const BASE_URL = 'https://restcountries.com/v3.1'

/** Campos solicitados — minimiza payload */
const FIELDS = 'name,cca2,latlng,flags,capital,population,region'

/**
 * Busca todos os países que possuem um determinado idioma.
 * @param {string} languageCode — Código ISO 639-1 (ex: "pt", "en")
 * @returns {Promise<Array>} Lista normalizada de países
 */
export async function fetchCountriesByLanguage(languageCode) {
  if (!languageCode) return []

  const res = await fetch(
    `${BASE_URL}/lang/${languageCode}?fields=${FIELDS}`,
    { signal: AbortSignal.timeout(10_000) }
  )

  // 404 = idioma sem países correspondentes — não é erro
  if (res.status === 404) return []

  if (!res.ok) {
    throw new Error(`REST Countries respondeu com status ${res.status}`)
  }

  const data = await res.json()

  // Filtra somente países com coordenadas válidas
  return data
    .map(normalizeCountry)
    .filter((c) => c.latlng !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Normaliza um objeto bruto da API para o formato interno da aplicação.
 */
function normalizeCountry(c) {
  const latlng =
    Array.isArray(c.latlng) && c.latlng.length === 2 ? c.latlng : null

  return {
    name: c.name?.common ?? 'Desconhecido',
    officialName: c.name?.official ?? null,
    code: c.cca2 ?? null,
    latlng,
    flagUrl: c.flags?.svg ?? c.flags?.png ?? null,
    capital: c.capital?.[0] ?? null,
    population: c.population ?? null,
    region: c.region ?? null,
  }
}
