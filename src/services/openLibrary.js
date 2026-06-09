/**
 * openLibrary.js — Camada de serviço para a Open Library API
 * Documentação: https://openlibrary.org/developers/api
 *
 * Implementado no Commit 2 (feat-book-search)
 */

const BASE_URL = 'https://openlibrary.org'

/**
 * Pesquisa livros pelo título.
 * @param {string} query — Título ou palavras-chave
 * @param {number} limit — Máximo de resultados (padrão: 20)
 * @returns {Promise<Array>} Lista normalizada de resultados
 */
export async function searchBooks(query, limit = 20) {
  // Implementado no Commit 2
  throw new Error('Not implemented yet')
}

/**
 * Busca os detalhes completos de uma obra pelo seu key da Open Library.
 * @param {string} workKey — Ex: "/works/OL45883W"
 * @returns {Promise<Object>} Objeto normalizado com detalhes da obra
 */
export async function fetchBookDetails(workKey) {
  // Implementado no Commit 3
  throw new Error('Not implemented yet')
}
