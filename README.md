# Biblioatlas

> Pesquise uma obra literária e visualize no mapa interativo os países onde seu idioma principal é falado.

## Stack

- **React 19** via Vite
- **React Leaflet** — mapa interativo
- **Open Library API** — base de dados de livros
- **REST Countries API** — dados geográficos por idioma
- **CSS puro** (design system com CSS Custom Properties)

## Como executar

```bash
# Clone o repositório
gh repo clone MarlonWeber1/books
cd books

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Funcionalidades

- [x] Busca de livros por título (Open Library API)
- [x] Exibição de detalhes: título, autor, ano, idioma, capa
- [x] Mapa interativo com países destacados pelo idioma
- [x] Estados de loading, erro e vazio tratados

## Estrutura do Projeto

```
src/
├── components/
│   ├── SearchBar/      # Campo de busca com debounce
│   ├── BookList/       # Grade de resultados com skeleton
│   ├── BookCard/       # Card individual de livro
│   ├── BookDetails/    # Painel de detalhes expandido
│   └── WorldMap/       # Mapa Leaflet com marcadores
├── hooks/
│   ├── useBookSearch.js  # Gerencia estado de busca
│   └── useCountries.js   # Gerencia estado do mapa
├── services/
│   ├── openLibrary.js    # Integração com Open Library
│   └── restCountries.js  # Integração com REST Countries
└── utils/
    └── languageMapper.js # Normalização de códigos de idioma
```

## APIs utilizadas

| API | Endpoint | Propósito |
|-----|----------|-----------|
| Open Library | `/search.json?title=` | Busca de livros |
| Open Library | `/works/{key}.json` | Detalhes da obra |
| REST Countries | `/v3.1/lang/{code}` | Países por idioma |

## Licença

MIT
