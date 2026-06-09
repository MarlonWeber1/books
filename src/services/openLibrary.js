/**
 * openLibrary.js — Serviço para a Open Library API
 * https://openlibrary.org/developers/api
 */

const BASE_URL = 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org/b/id'

/** Campos solicitados na busca — minimiza payload */
const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'language',
  'cover_i',
  'edition_count',
].join(',')

/**
 * Retorna a URL da capa de um livro.
 * @param {number|null} coverId
 * @param {'S'|'M'|'L'} size
 */
export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null
  return `${COVERS_URL}/${coverId}-${size}.jpg`
}

/**
 * Pesquisa livros pelo título.
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function searchBooks(query, limit = 20) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const params = new URLSearchParams({
    title: trimmed,
    fields: SEARCH_FIELDS,
    limit: String(limit),
  })

  const res = await fetch(`${BASE_URL}/search.json?${params}`, {
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) {
    throw new Error(`Open Library respondeu com status ${res.status}`)
  }

  const data = await res.json()

  return (data.docs ?? []).map(normalizeSearchResult)
}

/**
 * Normaliza um resultado bruto da API para o formato interno da aplicação.
 * @param {Object} doc
 * @returns {Object}
 */
function normalizeSearchResult(doc) {
  return {
    key: doc.key ?? null,                          // "/works/OL45883W"
    title: doc.title ?? 'Título desconhecido',
    authors: doc.author_name ?? [],
    year: doc.first_publish_year ?? null,
    languages: doc.language ?? [],                 // ["eng", "por", ...]
    coverId: doc.cover_i ?? null,
    coverUrl: getCoverUrl(doc.cover_i),
    editionCount: doc.edition_count ?? 0,
  }
}
