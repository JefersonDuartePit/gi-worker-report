# DESIGN-SYSTEM.md — GI Group · Portal do Worker

**Versão:** 1.0
**Base:** Identidade visual GI Group Holding Brasil
**Fonte:** Tokens CSS extraídos de gigroupholdingsolucoes.com.br

---

## 1. Princípios Visuais

- **Executivo e limpo** — sem excessos decorativos. Cada elemento visual tem um propósito.
- **Confiável** — azul marinho profundo como ancora. O relatório deve transmitir seriedade técnica.
- **Lúdico e navegável** — interações suaves, tooltips contextuais, transições com propósito.
- **Humano** — linguagem próxima, nunca fria. O worker é uma pessoa, não uma matrícula.

---

## 2. Paleta de Cores

### Cores primárias GI Group

```typescript
// tailwind.config.ts
colors: {
  gi: {
    // Primários
    navy:     '#00145A',   // Azul marinho — cor primária, headers, nav ativa
    blue:     '#1D57FB',   // Azul elétrico — CTAs, links, destaques
    // Neutros
    text:     '#666666',   // Texto corrido
    dark:     '#1E1E1E',   // Texto forte, títulos escuros
    charcoal: '#4B4C4D',   // Subtítulos, labels
    // Backgrounds
    white:    '#FFFFFF',
    light:    '#EFEFEF',   // Background de seções alternadas
    muted:    '#E6E9EA',   // Superfícies secundárias
    border:   '#DBDBDB',   // Bordas padrão
    // Semânticas
    red:      '#C10731',   // Erros, alertas críticos (usar com moderação)
    green:    '#49B100',   // Sucesso, status positivo
    amber:    '#FFC300',   // Atenção, pendente
    orange:   '#EB6608',   // Destaques quentes
    steel:    '#4E7EB1',   // Azul acinzentado — elementos secundários
    // Galaxy layout
    space:    '#000820',   // Fundo do espaço (deep blue-black)
    stardust: '#8899cc',   // Texto de subtítulo em contexto escuro/galaxy
    nebula:   '#7799bb',   // Labels de planeta não-ativo
    comet:    '#aaccff',   // Label de planeta ativo, destaques no dark
    crater:   '#445566',   // Texto hint/caption em fundo escuro
    orbit:    '#3355aa',   // Labels muted em fundo navy (sidebar galaxy)
  }
}
```

### Uso por contexto

| Contexto                        | Cor               | Token           |
| ------------------------------- | ----------------- | --------------- |
| Fundo do relatório              | Branco            | `gi-white`      |
| Seções alternadas               | Cinza claro       | `gi-light`      |
| Sidebar / nav                   | Azul marinho      | `gi-navy`       |
| Item de nav ativo               | Azul elétrico     | `gi-blue`       |
| Títulos de seção                | Azul marinho      | `gi-navy`       |
| Corpo de texto                  | Cinza texto       | `gi-text`       |
| Labels e subtítulos             | Carvão            | `gi-charcoal`   |
| Bordas                          | Cinza borda       | `gi-border`     |
| Badge "dor crítica"             | Vermelho          | `gi-red`        |
| Badge "em andamento"            | Âmbar             | `gi-amber`      |
| Badge "concluído"               | Verde             | `gi-green`      |
| Badge "bloqueado / não toca"    | Cinza carvão      | `gi-charcoal`   |
| CTA principal                   | Azul elétrico     | `gi-blue`       |
| CTA secundário                  | Borda azul marinho| `gi-navy` (outline) |

---

## 3. Tipografia

**Família:** Lato (Google Fonts)
**Pesos usados:** 400 (regular), 700 (bold)

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

body {
  font-family: 'Lato', sans-serif;
}
```

### Escala tipográfica

| Uso                        | Tamanho | Peso | Classe Tailwind                         |
| -------------------------- | ------- | ---- | --------------------------------------- |
| Hero title                 | 48px    | 700  | `text-5xl font-bold`                    |
| Título de seção            | 32px    | 700  | `text-4xl font-bold text-gi-navy`       |
| Subtítulo de seção         | 20px    | 400  | `text-xl text-gi-text`                  |
| Título de card             | 16px    | 700  | `text-base font-bold text-gi-dark`      |
| Corpo de texto             | 14px    | 400  | `text-sm text-gi-text`                  |
| Label / badge              | 12px    | 700  | `text-xs font-bold uppercase tracking-wide` |
| Microtexto / caption       | 11px    | 400  | `text-[11px] text-gi-charcoal`          |

---

## 4. Espaçamento

Usar a escala padrão do Tailwind. Referências principais:

| Uso                        | Valor   | Classe Tailwind |
| -------------------------- | ------- | --------------- |
| Padding de seção (vertical)| 80px    | `py-20`         |
| Padding de seção (lateral) | 48px    | `px-12`         |
| Gap entre cards            | 24px    | `gap-6`         |
| Padding interno de card    | 24px    | `p-6`           |
| Gap entre elementos inline | 12px    | `gap-3`         |
| Border radius de card      | 12px    | `rounded-xl`    |
| Border radius de badge     | 6px     | `rounded-md`    |
| Border radius de botão     | 8px     | `rounded-lg`    |

---

## 5. Componentes Atômicos

### 5.1 Badge

Badges indicam status, persona ou jornada. Sempre uppercase, sempre com letra pequena.

```typescript
// src/components/ui/Badge.tsx
type BadgeVariant = 'critica' | 'alta' | 'media' | 'andamento' | 'concluido' | 'bloqueado' | 'admissao' | 'ciclo' | 'offboarding'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  critica:     'bg-red-100 text-gi-red border border-red-200',
  alta:        'bg-orange-100 text-gi-orange border border-orange-200',
  media:       'bg-amber-100 text-gi-amber border border-amber-200',
  andamento:   'bg-blue-100 text-gi-blue border border-blue-200',
  concluido:   'bg-green-100 text-gi-green border border-green-200',
  bloqueado:   'bg-gray-100 text-gi-charcoal border border-gi-border',
  admissao:    'bg-gi-navy text-white',
  ciclo:       'bg-gi-blue text-white',
  offboarding: 'bg-gi-steel text-white',
}
```

### 5.2 Card

Card padrão do relatório. Sem sombra — borda fina, fundo branco, radius xl.

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}
```

Variantes:
- **Default:** `bg-white border border-gi-border rounded-xl p-6`
- **Hoverable:** adiciona `hover:border-gi-blue hover:shadow-sm transition-all cursor-pointer`
- **Highlighted:** `border-gi-blue border-2`
- **Muted:** `bg-gi-light border-transparent`

### 5.3 Button

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

// primary:   bg-gi-blue text-white hover:bg-gi-navy
// secondary: border border-gi-navy text-gi-navy hover:bg-gi-light
// ghost:     text-gi-blue hover:underline
```

### 5.4 Tag de Persona

Tags coloridas que identificam para qual persona uma iniciativa ou dor se aplica.

```typescript
const PERSONA_STYLES = {
  'worker':        'bg-purple-100 text-purple-800',
  'colaborador-gi':'bg-blue-100 text-gi-navy',
  'cliente':       'bg-teal-100 text-teal-800',
}

const PERSONA_LABELS = {
  'worker':        'Worker',
  'colaborador-gi':'Colaborador GI',
  'cliente':       'Cliente',
}
```

### 5.5 Tooltip de Dor

Aparece ao hover em elementos dentro das telas do portal mockado. Mostra qual dor o elemento resolve.

```typescript
interface DorTooltipProps {
  dorId: string          // ex: 'D03'
  iniciativaId: string   // ex: 'I01'
  children: React.ReactNode
}
```

Posicionamento: sempre acima do elemento, nunca corta a tela. Implementar com `@floating-ui/react` ou com posicionamento manual simples.

---

## 6. Layout do Relatório

> **⚠️ Layout atualizado — Galaxy Layout (2026-06-23)**
> O layout original (sidebar fixa + scroll) foi substituído por uma experiência de galáxia interativa. A descrição abaixo reflete o estado atual do projeto.

### 6.1 Estados de UI

O relatório opera em **3 estados distintos**, controlados por `uiState: 'splash' | 'galaxy' | 'module'` em `App.tsx`.

| Estado | Quando aparece | Visual |
|--------|---------------|--------|
| `splash` | Abertura do relatório | Fundo espacial, logo GI, título, anel pulsante |
| `galaxy` | Após splash / botão "← Galáxia" | Mapa com 7 planetas, sol GI, linhas orbitais |
| `module` | Após click num planeta | Header fixo + sidebar mini-mapa + conteúdo |

### 6.2 Estado Splash

- Fundo: `.bg-splash-sky` (gradiente radial navy→space→black + estrelas CSS)
- Logo GI Group centralizada, título "Portal do Worker", subtítulo da edição
- Anel pulsante (Framer Motion `scale` loop, 2s)
- Auto-avança para galaxy após 2.5s ou no click

### 6.3 Estado Galaxy (mapa de navegação)

```
┌──────────────────────────────────────────────────────┐
│ GalaxyHeader: logo · "Escolha um módulo" · [Modo]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│          ☆         ○ 03 Dores                        │
│  ● 01           ☆                    ○ 04 Arq.       │
│  Contexto                                            │
│     ◉ 02                   GI (sol)                  │
│     Diagnóstico                         ○ 07         │
│                                                      │
│          ○ 06 Portal    ○ 05 Iniciativas             │
│                                                      │
└──────────────────────────────────────────────────────┘
       ↑ clique em qualquer planeta para pousar
```

- Fundo: `.bg-galaxy-sky` (gradiente radial + estrelas CSS estáticas)
- Sol GI ao centro (56px, gradiente dourado/laranja, glow)
- 7 planetas com posições absolutas em container `700×480px`
- Linhas tracejadas SVG conectando sol a cada planeta
- Órbitas decorativas (`rotateX(70deg)`, dashed)
- Hover em planeta: `scale(1.1)`, 200ms (Framer Motion `whileHover`)

### 6.4 Planetas — Especificações Visuais

| # | Módulo | Tamanho | Cor base (from→to) | Anel |
|---|--------|---------|-------------------|------|
| 01 | Contexto | 44px | `#6699cc` → `#001144` | — |
| 02 | Diagnóstico | 64px | `#334488` → `#000830` | sim |
| 03 | Dores | 38px | `#884455` → `#220011` | — |
| 04 | Arquitetura | 72px | `#4488ff` → `#0a2288` | — |
| 05 | Iniciativas | 58px | `#448899` → `#001122` | sim |
| 06 | Portal do Worker | 78px | `#66aaff` → `#003399` | — |
| 07 | Próximos Passos | 34px | `#556677` → `#111222` | — |

Configuração completa em `src/data/planets.ts`.

### 6.5 Estado Module (conteúdo + mini-mapa)

```
┌─────────────────────────────────────────────────────┐
│  HEADER: logo · 04 · Arquitetura · [Modo] [←Galáxia]│
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  MINI-MAP  │       CONTEÚDO DO MÓDULO              │
│  orbital   │       (componente da seção)            │
│  SVG       │                                        │
│  (200px)   │                                        │
│            │                                        │
│  [Modo]    │                                        │
└────────────┴────────────────────────────────────────┘
```

**Header (56px):** logo GI + `04 · Arquitetura` + botão "Apresentação" + botão "← Galáxia" (`bg-gi-blue`)

**MiniMap (200px, `bg-gi-navy`):** SVG do mapa orbital em escala reduzida. Todos os planetas visíveis com labels de texto. Planeta ativo com glow e anel de destaque extra.

**Modo Apresentação:** MiniMap some; conteúdo ocupa largura total; barra flutuante no rodapé com `← Anterior | N / 7 | Próximo →`.

### 6.6 Backgrounds espaciais (index.css)

```css
/* Uso: className="bg-galaxy-sky" */
.bg-galaxy-sky  /* estrelas + gradiente para estado galaxy */

/* Uso: className="bg-splash-sky" */
.bg-splash-sky  /* estrelas + gradiente para estado splash */
```

Ambos definidos em `src/index.css` como `@layer utilities` — não usar inline style para esses fundos.

---

## 7. Seções do Relatório

Cada seção ocupa pelo menos 100vh e tem seu próprio esquema visual.

| Seção | ID        | Fundo      | Tom visual              |
| ----- | --------- | ---------- | ----------------------- |
| S1    | hero      | `gi-navy`  | Hero escuro, branco     |
| S2    | diagnostico| `gi-white`| Cards de sistemas       |
| S3    | dores     | `gi-light` | Cards por persona       |
| S4    | arquitetura| `gi-white`| Diagrama as-is vs to-be |
| S5    | iniciativas| `gi-light`| Cards de iniciativas    |
| S6    | portal    | `gi-white` | Shell do portal mockado |
| S7    | provocacoes| `gi-navy` | Dark, CTA final         |

---

## 8. Portal do Worker — Design Interno

O portal mockado usa uma identidade visual limpa e moderna, derivada da GI Group mas adaptada para um produto digital de uso do worker. A referência de execução é **dupla**: a paleta e o tom vêm do site institucional (gigroupholding.com — navy `#00145A`, azul `#1D57FB`, Lato, espaçamento generoso, baixo ruído visual); a linguagem de componentes de produto (cards, badges, sidebar, topbar) vem do protótipo de referência em `src/ref/` ("Portal GI Conecta"), que é **clean e baseado em sombra suave**, nunca em bordas/contornos coloridos para indicar estado.

### 8.1 Princípio de arquitetura de informação — jornada, não funcionalidades

O erro mais comum a evitar: organizar o portal como uma lista de funcionalidades soltas (uma tela por feature). A tela de Início **deve** abrir com uma visão da jornada macro do worker — Admissão (referência) → Ciclo Ativo → Offboarding — como um componente de progresso/timeline clicável, e só então mostrar métricas e atalhos. Cada tela secundária (Documentos, Solicitações, Treinamentos, Rescisão, Desenvolvimento) é uma sub-jornada dentro do Ciclo Ativo ou Offboarding, não um destino isolado.

### 8.2 Paleta interna do portal

| Uso | Token / valor |
|---|---|
| Background do app | `bg-gi-light` (`#EFEFEF`) ou `#F8F9FA` — nunca branco puro, para destacar os cards |
| Sidebar do portal | `bg-gi-navy` (`#00145A`) |
| Topbar interna | branco, `border-b border-gi-border`, sem sombra forte |
| Cards | branco, `border border-gi-border`, `rounded-xl`, **`shadow-sm`** (nunca `shadow-lg`/`shadow-xl`/`shadow-2xl` — o site real usa sombra difusa e suave, não projetada) |
| Destaque de progresso | `gi-blue` |
| Status "concluído" | `gi-green` |
| Status "pendente/atenção" | `gi-amber` |
| Status "bloqueado/neutro" | `gi-border` / `gi-charcoal` |

### 8.3 Hierarquia tipográfica do portal

Diferente do relatório (que é uma apresentação), o portal simula um produto real — por isso a hierarquia precisa ser mais rica que "tudo `text-sm`/`text-xs`":

| Elemento | Classe |
|---|---|
| Título de tela | `text-xl font-bold text-gi-navy` |
| Subtítulo de tela | `text-sm text-gi-text mt-1` |
| Label de métrica/seção (uppercase) | `text-[10px] font-bold text-gi-charcoal uppercase tracking-widest` |
| Valor de métrica em destaque | `text-3xl font-bold text-gi-navy` |
| Corpo de card | `text-sm text-gi-text` |
| Metadado/legenda | `text-[11px] text-gi-charcoal` |

### 8.4 Componentes de produto do portal

**Stat card (métrica em destaque):** fundo branco, `rounded-xl border border-gi-border shadow-sm p-4`, com **acento de borda superior** (`border-t-2 border-t-{cor-semântica}`) quando a métrica tiver conotação (atenção, sucesso, etc.) — nunca preencher o card inteiro com cor. Label pequena uppercase + valor grande + legenda pequena (ver 8.3).

**Status pill:** badge em formato pílula com um ponto colorido à esquerda do texto (`<span className="w-1.5 h-1.5 rounded-full" />` + texto), nunca um bloco sólido grande de cor saturada. Reservado para status de fluxo (documento, solicitação, etapa).

**Sidebar — estado ativo:** apenas troca de fundo (`bg-white/10 text-white`), **proibido** usar borda lateral, outline ou qualquer acento decorativo extra no item ativo — o protótipo de referência não usa isso, e adicionar quebra a limpeza do padrão.

**Topbar interna do portal:** ícone pequeno + título da tela + separador (`|`) + metadado à direita (ex.: "Dados ilustrativos"), espelhando o padrão do protótipo de referência (`ClipboardList` + título + data, no canto direito ações/indicadores).

**Banner de alerta contextual:** quando houver algo que demande atenção imediata (ex.: documento pendente, prazo curto), usar banner `bg-red-50 border border-red-200 rounded-xl px-4 py-3` com ícone — não apenas um badge.

### 8.5 Fonte do portal

Mesma família Lato, mas em tamanhos menores (11–14px no corpo) para simular uma interface real de produto — exceto títulos de tela e valores de métrica, que usam escala maior (ver 8.3) para criar hierarquia real.

---

## 9. Animações e Transições

Usar **Framer Motion** para:
- Entrada de seções no scroll (`fadeInUp` suave, 400ms)
- Abertura de modais e tooltips (`scale` de 0.95 para 1, 200ms)
- Troca de tela no portal mockado (`fadeIn`, 150ms)
- Transição entre modo apresentação e exploração

**Nunca usar animações longas (>500ms) ou que bloqueiem a leitura.**

```typescript
// Padrão de animação de entrada de seção
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}
```

---

## 10. Responsividade

O relatório é projetado para **desktop em tela cheia** (1280px+). É uma apresentação executiva, não um produto responsivo.

- Largura mínima suportada: 1024px
- Não é necessário suporte a mobile
- Sidebar colapsa abaixo de 1024px (ícones apenas, sem texto)
