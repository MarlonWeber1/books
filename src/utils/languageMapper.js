/**
 * languageMapper.js — Utilitário de normalização de códigos de idioma
 *
 * A Open Library retorna códigos de idioma em formatos variados:
 * - Códigos MARC21: "/languages/eng", "/languages/por"
 * - Códigos ISO 639-1: "en", "pt"
 * - Nomes completos: "English", "Portuguese"
 *
 * Este utilitário normaliza todos para ISO 639-1 de 2 letras,
 * que é o formato aceito pela REST Countries API.
 *
 * Implementado no Commit 3 (feat-book-details)
 */

/** Mapa de códigos MARC21/Open Library → ISO 639-1 */
export const MARC_TO_ISO = {
  eng: 'en',
  por: 'pt',
  spa: 'es',
  fra: 'fr',
  deu: 'de',
  ita: 'it',
  rus: 'ru',
  zho: 'zh',
  jpn: 'ja',
  ara: 'ar',
  hin: 'hi',
  kor: 'ko',
  nld: 'nl',
  pol: 'pl',
  swe: 'sv',
  nor: 'no',
  dan: 'da',
  fin: 'fi',
  tur: 'tr',
  ces: 'cs',
  hun: 'hu',
  ron: 'ro',
  cat: 'ca',
  ukr: 'uk',
  vie: 'vi',
  ind: 'id',
  msa: 'ms',
  heb: 'he',
  lat: 'la',
  ell: 'el',
  bul: 'bg',
  hrv: 'hr',
  srp: 'sr',
  slk: 'sk',
  slv: 'sl',
}

/** Nomes de idiomas legíveis por humanos (ISO 639-1 → label PT-BR) */
export const LANGUAGE_NAMES = {
  en: 'Inglês',
  pt: 'Português',
  es: 'Espanhol',
  fr: 'Francês',
  de: 'Alemão',
  it: 'Italiano',
  ru: 'Russo',
  zh: 'Chinês',
  ja: 'Japonês',
  ar: 'Árabe',
  hi: 'Hindi',
  ko: 'Coreano',
  nl: 'Holandês',
  pl: 'Polonês',
  sv: 'Sueco',
  no: 'Norueguês',
  da: 'Dinamarquês',
  fi: 'Finlandês',
  tr: 'Turco',
  cs: 'Tcheco',
  hu: 'Húngaro',
  ro: 'Romeno',
  ca: 'Catalão',
  uk: 'Ucraniano',
  vi: 'Vietnamita',
  id: 'Indonésio',
  ms: 'Malaio',
  he: 'Hebraico',
  la: 'Latim',
  el: 'Grego',
  bg: 'Búlgaro',
  hr: 'Croata',
  sr: 'Sérvio',
  sk: 'Eslovaco',
  sl: 'Esloveno',
}

/**
 * Normaliza um código de idioma de qualquer formato para ISO 639-1.
 * @param {string|Object} lang — Ex: "/languages/eng", "eng", "en", { key: "/languages/por" }
 * @returns {string|null} Código ISO 639-1 ou null se não reconhecido
 */
export function normalizeLanguageCode(lang) {
  // Implementado no Commit 3
  return null
}

/**
 * Retorna o nome legível de um idioma pelo código ISO 639-1.
 * @param {string} isoCode — Ex: "pt"
 * @returns {string} Nome do idioma ou o próprio código se não mapeado
 */
export function getLanguageName(isoCode) {
  return LANGUAGE_NAMES[isoCode] ?? isoCode?.toUpperCase() ?? 'Desconhecido'
}
