/**
 * restCountries.js — Camada de serviço para a REST Countries API v3.1
 * Documentação: https://restcountries.com
 *
 * Implementado no Commit 4 (feat-map-integration)
 */

const BASE_URL = 'https://restcountries.com/v3.1'

/**
 * Busca todos os países que possuem um determinado idioma.
 * @param {string} languageCode — Código ISO 639-1 (ex: "pt", "en", "fr")
 * @returns {Promise<Array>} Lista normalizada de países com lat/lng
 */
export async function fetchCountriesByLanguage(languageCode) {
  // Implementado no Commit 4
  throw new Error('Not implemented yet')
}
