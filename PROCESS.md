# 🤖 PROCESS.md — Relato do Desenvolvimento com IA

> Registro do processo de desenvolvimento da aplicação **Biblioatlas** utilizando
> um agente de IA (Google Gemini / Antigravity) como par de programação.
> Disciplina: TECIV — Faculdade.

---

## 1. Contexto e Objetivo

O objetivo era desenvolver uma aplicação web completa em **React + Vite** que permitisse:
1. Pesquisar livros via Open Library
2. Visualizar, num mapa interativo, os países onde o idioma principal da obra é falado

O desenvolvimento foi conduzido em sessão colaborativa com um agente de IA, seguindo
um plano de 6 commits com escopo bem definido. O agente atuou como **Engenheiro de
Software Sênior especialista em React**, aplicando skills de design premium:
`design-taste-frontend-v1`, `impeccable` e `emil-design-eng`.

---

## 2. Plano de Commits (Workflow Definido no Início)

| # | Commit | Escopo |
|---|--------|--------|
| 1 | `setup-inicial` | Scaffold, dependências, design system |
| 2 | `feat-book-search` | Busca de livros + UI de resultados |
| 3 | `feat-book-details` | Detalhes da obra + Works API |
| 4 | `feat-map-integration` | Mapa Leaflet + REST Countries |
| 5 | `fix-error-handling` | Tratamento de erros (pulado a pedido) |
| 6 | `docs-ai-process` | Documentação (este arquivo) |

A estratégia de commits sequenciais serviu como **contexto estruturado** para o agente:
cada commit tinha escopo definido, o que reduziu ambiguidade nas instruções.

---

## 3. Decisões Técnicas e Justificativas

### 3.1 React 19 + react-leaflet v5
A versão 5 do react-leaflet é a única compatível com React 19
(o React 19 removeu APIs internas que versões anteriores do react-leaflet usavam).
O agente identificou isso antes de iniciar e instalou a versão correta.

### 3.2 CSS Modules + Custom Properties globais
Em vez de Tailwind CSS, optamos por **CSS Modules** (escopo local por componente)
combinados com **Custom Properties** no `:root` (design system global).
Isso permitiu:
- Tokens de cor, espaçamento e tipografia consistentes em toda a app
- Escopo de classes sem risco de colisão
- Overrides do Leaflet via seletores globais (`index.css`)

### 3.3 Fetch API com `AbortSignal.timeout`
Todas as requisições usam `AbortSignal.timeout(n)` em vez de `setTimeout` manual.
Isso simplifica o cancelamento de requisições e é a abordagem moderna recomendada.

### 3.4 FSM no `useBookSearch`
O hook de busca foi modelado como uma **máquina de estados finita** (FSM):
`idle → loading → success | error`. Isso evitou estados impossíveis como
"loading e erro ao mesmo tempo" e facilitou o controle dos 5 estados de UI.

### 3.5 `languageMapper.js` centralizado
A Open Library retorna códigos de idioma em 3 formatos diferentes:
- Objeto: `{ key: "/languages/eng" }`
- String path: `"/languages/eng"`
- Código MARC21 direto: `"eng"`

Um utilitário centralizado normaliza tudo para ISO 639-1 de 2 letras (`"en"`),
que é o formato necessário para a camada de tradução para a REST Countries API.

---

## 4. Bugs Encontrados e Como Foram Resolvidos

### Bug #1 — Mapa em branco (mais crítico)

**Sintoma:** O usuário clicava em "Ver no mapa" e nada aparecia.

**Investigação:** O agente executou um teste direto via Node.js:
```bash
node -e "fetch('https://restcountries.com/v3.1/lang/en').then(r => console.log(r.status))"
# Output: 404
```

**Causa raiz:** A REST Countries API v3.1 **não aceita** códigos ISO 639-1 no
endpoint `/lang/`. Ela exige o nome completo do idioma em inglês:
- ❌ `/v3.1/lang/en` → HTTP 404
- ✅ `/v3.1/lang/english` → HTTP 200 (91 países)

A documentação oficial da API não deixa isso claro. O bug foi descoberto
empiricamente, testando diretamente no terminal.

**Fix:** Adicionado o mapa `ISO_TO_API_NAME` em `restCountries.js`:
```js
const ISO_TO_API_NAME = {
  en: 'english',
  pt: 'portuguese',
  es: 'spanish',
  // ...
}
```

---

### Bug #2 — Harry Potter exibindo idioma turco

**Sintoma:** Ao selecionar "Harry Potter", o painel mostrava **Turco** como idioma
principal, mesmo sendo uma obra originalmente em inglês.

**Causa raiz:** A Open Library retorna no campo `language` **todos os idiomas de
todas as edições** de uma obra, sem ordem garantida. O campo não representa o
idioma original — representa a soma de todas as traduções publicadas.
O agente estava simplesmente pegando o primeiro da lista, que poderia ser qualquer
edição indexada primeiro no banco.

**Fix:** A função `detectPrimaryLanguage()` foi criada com uma lista de prioridade:
```js
const LANGUAGE_PRIORITY = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ru', ...]
```
O algoritmo percorre a lista e retorna o **primeiro idioma prioritário** que
estiver presente na obra, em vez de pegar cegamente o primeiro da array.

---

### Bug #3 — Mapa renderizando em branco (CSS)

**Sintoma:** O `MapContainer` do Leaflet montava mas o mapa ficava cinza/branco,
sem tiles e sem marcadores.

**Causas (múltiplas):**
1. O CSS do Leaflet (`leaflet/dist/leaflet.css`) estava importado dentro do componente,
   causando conflitos de ordem de injeção com o CSS Modules
2. A altura do container estava definida como `height: 100%` sem um ancestral
   com altura explícita no contexto flex/grid
3. O Leaflet não recalculava o tamanho do container após o mount

**Fixes:**
```js
// main.jsx — CSS global antes do CSS da aplicação
import 'leaflet/dist/leaflet.css'
import './index.css'
```
```jsx
// Altura explícita em pixels, não relativa
<MapContainer style={{ height: 380, width: '100%' }} />
```
```jsx
// Força recálculo após mount
function MapController() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 0) }, [map])
  return null
}
```

---

## 5. Decisões de UX Tomadas Iterativamente

### Multi-seleção de idiomas
Inicialmente, o design previa um único idioma por vez ("Ver no mapa" como CTA).
Após feedback do usuário ("tem que ter a opção de selecionar mais de um idioma"),
o design foi expandido para:
- **Pills clicáveis** (toggle) para cada idioma detectado
- **Sem limite** de idiomas exibidos (lista completa com scroll)
- **Busca paralela** via `Promise.allSettled` para múltiplos idiomas
- **Deduplicação** por código `cca2` ao combinar resultados

### Mapa auto-disparado
O botão "Ver no mapa" foi removido. Agora o mapa carrega automaticamente
ao selecionar um livro, usando o idioma de maior prioridade como default.
O usuário pode refinar clicando nos outros idiomas.

---

## 6. O que Funcionou Bem no Processo com IA

- **Commits como contexto:** Definir o escopo de cada commit no início da sessão
  serviu como contexto estruturado. O agente sabia o que estava no escopo.
- **Iteração rápida:** Bugs de CSS e API foram identificados e corrigidos na mesma
  sessão, sem necessidade de pesquisa manual extensa.
- **Testes diretos:** Para o bug da REST Countries, o agente propôs e executou
  um teste no terminal (`node -e "fetch(...)"`) antes de escrever qualquer código.
- **Commits descritivos:** Cada commit foi documentado com causas, fixes e contexto,
  servindo como log de auditoria do desenvolvimento.

## 7. O que Exigiu Intervenção Humana

- **Identificação do bug do mapa:** O usuário precisou reportar que "nada aparece"
  para o agente investigar. O agente não tinha visibilidade do browser.
- **Feedback de UX:** A demanda por multi-seleção veio do usuário após ver o
  protótipo inicial com seleção única.
- **Aprovação de commits:** Cada etapa exigiu aprovação explícita antes de prosseguir,
  garantindo controle humano sobre o ritmo e direção do desenvolvimento.

---

## 8. Tecnologias e Versões

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-leaflet": "^5.0.0",
  "leaflet": "^1.9.4",
  "@phosphor-icons/react": "^2.1.7",
  "vite": "^8.0.16"
}
```

---

*Desenvolvido em Junho de 2025 — TECIV / Faculdade*
