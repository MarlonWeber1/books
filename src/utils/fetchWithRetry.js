/**
 * fetchWithRetry.js — Utilitário para requisições com retry automático
 *
 * Tenta novamente em caso de falha transitória (erros de rede, timeout,
 * status 5xx). Não retenta erros 4xx (ex: 404 = dado não existe).
 *
 * @param {() => Promise<Response>} fetcher — função que retorna uma Promise<Response>
 * @param {number} maxAttempts — número máximo de tentativas (padrão: 2)
 * @param {number} baseDelayMs — delay base em ms antes de retentar (padrão: 600ms)
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(fetcher, maxAttempts = 2, baseDelayMs = 600) {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetcher()

      // Não retenta 4xx — são erros permanentes (ex: idioma não encontrado)
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Retenta 5xx (erro do servidor) se não for a última tentativa
      if (!response.ok && attempt < maxAttempts) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response
    } catch (err) {
      // Não retenta aborts/timeouts causados pelo usuário
      if (err.name === 'AbortError' || err.name === 'TimeoutError') throw err

      lastError = err

      if (attempt < maxAttempts) {
        // Backoff exponencial: 600ms, 1200ms, ...
        await delay(baseDelayMs * attempt)
      }
    }
  }

  throw lastError
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
