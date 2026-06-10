# 📚 Biblioatlas

> Pesquise uma obra literária e visualize no mapa os países onde seu idioma é falado.

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=flat-square&logo=leaflet)
![License](https://img.shields.io/badge/license-MIT-gold?style=flat-square)

---

## ✨ Funcionalidades

- 🔍 **Busca de livros** em tempo real via Open Library (debounce 400ms)
- 📖 **Painel de detalhes** com capa, autores, sinopse, assuntos e lugares
- 🌐 **Seleção de idioma múltipla** — clique em um ou mais idiomas detectados na obra
- 🗺️ **Mapa interativo** com marcadores de todos os países que falam os idiomas selecionados
- 🎯 **Popup por país** com bandeira, capital e população
- 🌙 **Dark mode nativo** com design system próprio

---

## 🛠️ Stack Técnica

| Camada | Tecnologia | Motivo da escolha |
|--------|-----------|------------------|
| UI Framework | React 19 | Hooks modernos, compatibilidade com react-leaflet v5 |
| Build Tool | Vite 8 | HMR instantâneo, rolldown bundler |
| Mapas | React-Leaflet 5 + Leaflet 1.9 | API madura, tiles customizáveis, divIcon sem dependências |
| Estilização | CSS Modules + Custom Properties | Escopo local + design system global via `:root` |
| Ícones | Phosphor Icons | Consistência visual, tree-shakeable |
| Fontes | Outfit + JetBrains Mono | Legibilidade premium, via Google Fonts |

---

## 🌐 APIs Utilizadas

### Open Library (openlibrary.org)
| Endpoint | Uso |
|----------|-----|
| `GET /search.json?q={query}&limit=10` | Busca paginada de obras |
| `GET /works/{key}.json` | Detalhes extras: sinopse, assuntos, lugares |
| `https://covers.openlibrary.org/b/id/{id}-{size}.jpg` | Capas das obras |

### REST Countries (restcountries.com)
| Endpoint | Uso |
|----------|-----|
| `GET /v3.1/lang/{language}?fields=...` | Países por idioma |

> ⚠️ **Importante:** A API REST Countries v3.1 exige o **nome por extenso em inglês** no parâmetro de idioma (`/lang/english`, não `/lang/en`). Esta nuance foi descoberta durante o desenvolvimento e documentada no [PROCESS.md](./PROCESS.md).

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── BookCard/          # Card de resultado com efeito spotlight
│   ├── BookDetails/       # Painel de detalhes + seleção de idioma
│   ├── BookList/          # Lista com 5 estados (idle/loading/empty/error/results)
│   ├── SearchBar/         # Input com debounce e clear
│   └── WorldMap/          # Mapa Leaflet com marcadores e popups
│
├── hooks/
│   ├── useBookSearch.js   # FSM: idle→loading→success/error, debounce 400ms
│   ├── useBookDetails.js  # Busca detalhes Works API, cleanup no unmount
│   └── useCountries.js    # Aceita string[] de códigos ISO, busca paralela
│
├── services/
│   ├── openLibrary.js     # searchBooks(), fetchBookDetails(), getCoverUrl()
│   └── restCountries.js   # fetchCountriesByLanguages(), ISO→nome API
│
└── utils/
    └── languageMapper.js  # MARC21→ISO 639-1, prioridade de idioma, nomes PT-BR
```

### Fluxo de Dados

```
[SearchBar] ──debounce 400ms──► useBookSearch
                                     │
                              Open Library API
                                     │
                             [BookList] ◄──── resultados
                                     │
                          clique num livro
                                     │
                           [BookDetails] ◄── useBookDetails (Works API)
                                     │
                        detectAllLanguages()    ← languageMapper.js
                        detectPrimaryLanguage()  ← prioridade en>pt>es>...
                                     │
                         pills clicáveis (multi-seleção)
                                     │
                              onLanguagesChange([])
                                     │
                             useCountries(codes[])
                                     │
                      fetchCountriesByLanguages() ─► REST Countries API
                         (Promise.allSettled, paralelo)
                                     │
                              [WorldMap] ◄── marcadores + popups
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js >= 18
- npm >= 9

### Instalação

```bash
git clone https://github.com/MarlonWeber1/books.git
cd books
npm install
```

### Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:5173
```

### Build de produção

```bash
npm run build
npm run preview
```

---

## 📦 Histórico de Commits

| Commit | Escopo | Descrição |
|--------|--------|-----------|
| `setup-inicial` | infra | Scaffold React 19 + Vite, design system global, App shell |
| `feat-book-search` | feature | Integração Open Library, useBookSearch FSM, SearchBar, BookList |
| `feat-book-details` | feature | Works API, useBookDetails, BookDetails split-layout |
| `feat-map-integration` | feature | REST Countries, useCountries, WorldMap Leaflet |
| `fix(map)` | fix | CSS global Leaflet, altura explícita, invalidateSize |
| `fix(map+language)` | fix | API name format, detectPrimaryLanguage, multi-seleção |
| `fix-error-handling` | fix | Retry, offline detection, slow indicator, aria-live |
| `docs-ai-process` | docs | README + PROCESS atualizados |

---

## 📄 Processo de Desenvolvimento

O desenvolvimento foi conduzido com assistência de IA. Veja o relato completo em [PROCESS.md](./PROCESS.md).

---

## 📝 Licença

MIT © 2025 Marlon Weber
