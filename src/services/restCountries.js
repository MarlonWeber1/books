/**
 * restCountries.js — Serviço para a REST Countries API v3.1
 * https://restcountries.com
 *
 * IMPORTANTE: A API aceita nomes por extenso em inglês ("/lang/english"),
 * NÃO códigos ISO 639-1 ("/lang/en" → 404).
 */

const BASE_URL = 'https://restcountries.com/v3.1'
const FIELDS = 'name,cca2,latlng,flags,capital,population,region'

import { fetchWithRetry } from '../utils/fetchWithRetry'

/**
 * Mapa ISO 639-1 → nome em inglês aceito pela REST Countries API.
 * Endpoint: GET /v3.1/lang/{languageName}
 */
const ISO_TO_API_NAME = {
  en: 'english',
  pt: 'portuguese',
  es: 'spanish',
  fr: 'french',
  de: 'german',
  it: 'italian',
  ru: 'russian',
  zh: 'chinese',
  ja: 'japanese',
  ar: 'arabic',
  hi: 'hindi',
  ko: 'korean',
  nl: 'dutch',
  pl: 'polish',
  sv: 'swedish',
  no: 'norwegian',
  da: 'danish',
  fi: 'finnish',
  tr: 'turkish',
  cs: 'czech',
  hu: 'hungarian',
  ro: 'romanian',
  el: 'greek',
  he: 'hebrew',
  uk: 'ukrainian',
  id: 'indonesian',
  vi: 'vietnamese',
  ms: 'malay',
  ca: 'catalan',
  bg: 'bulgarian',
  hr: 'croatian',
  sk: 'slovak',
  sl: 'slovenian',
  sr: 'serbian',
  la: 'latin',
}

/**
 * Converte código ISO 639-1 para o nome aceito pela API.
 * @param {string} isoCode
 * @returns {string|null}
 */
export function isoToApiName(isoCode) {
  return ISO_TO_API_NAME[isoCode?.toLowerCase()] ?? null
}

/**
 * Busca países que falam um dado idioma.
 * @param {string} isoCode — Código ISO 639-1 (ex: "en", "pt")
 * @returns {Promise<Array>}
 */
export async function fetchCountriesByLanguage(isoCode) {
  if (!isoCode) return []

  const apiName = isoToApiName(isoCode)
  if (!apiName) {
    console.warn(`[restCountries] Idioma não mapeado para API: ${isoCode}`)
    return []
  }

  const res = await fetchWithRetry(
    () => fetch(
      `${BASE_URL}/lang/${apiName}?fields=${FIELDS}`,
      { signal: AbortSignal.timeout(10_000) }
    )
  )

  if (res.status === 404) return []

  if (!res.ok) {
    const isServerError = res.status >= 500
    throw new Error(
      isServerError
        ? `Servidor REST Countries indisponível (status ${res.status}). Tente novamente.`
        : `Erro ao buscar países para o idioma "${apiName}" (status ${res.status}).`
    )
  }

  const data = await res.json()

  return data
    .map(normalizeCountry)
    .filter((c) => c.latlng !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Busca países para múltiplos idiomas em paralelo, removendo duplicatas.
 * @param {string[]} isoCodes — Array de códigos ISO 639-1
 * @returns {Promise<Array>}
 */
export async function fetchCountriesByLanguages(isoCodes) {
  if (!isoCodes?.length) return []

  const results = await Promise.allSettled(
    isoCodes.map((code) => fetchCountriesByLanguage(code))
  )

  const seen = new Set()
  const countries = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    for (const country of result.value) {
      if (!seen.has(country.code)) {
        seen.add(country.code)
        countries.push(country)
      }
    }
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name))
}

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
