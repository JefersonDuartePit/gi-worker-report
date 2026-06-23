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
    navy:    '#00145A',   // Azul marinho — cor primária, headers, nav ativa
    blue:    '#1D57FB',   // Azul elétrico — CTAs, links, destaques
    // Neutros
    text:    '#666666',   // Texto corrido
    dark:    '#1E1E1E',   // Texto forte, títulos escuros
    charcoal:'#4B4C4D',  // Subtítulos, labels
    // Backgrounds
    white:   '#FFFFFF',
    light:   '#EFEFEF',   // Background de seções alternadas
    muted:   '#E6E9EA',   // Superfícies secundárias
    border:  '#DBDBDB',   // Bordas padrão
    // Semânticas
    red:     '#C10731',   // Erros, alertas críticos (usar com moderação)
    green:   '#49B100',   // Sucesso, status positivo
    amber:   '#FFC300',   // Atenção, pendente
    orange:  '#EB6608',   // Destaques quentes
    steel:   '#4E7EB1',   // Azul acinzentado — elementos secundários
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

### 6.1 Shell principal

```
┌─────────────────────────────────────────────────────┐
│  HEADER (topbar fixa — logo GI + toggle de modo)    │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │         CONTEÚDO DA SEÇÃO               │
│  (240px) │         (scroll vertical)               │
│  fixa    │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 6.2 Sidebar

- Largura: 240px, fixa
- Fundo: `gi-navy`
- Texto: branco
- Item ativo: destaque em `gi-blue` com borda esquerda de 3px
- Logo GI Group no topo

```
Logo GI Group
──────────────
○  Contexto
●  Diagnóstico       ← ativo
○  Dores
○  Arquitetura
○  Iniciativas
○  Portal do Worker
○  Próximos passos
──────────────
[Modo: Apresentação ↔ Exploração]
```

### 6.3 Header (topbar)

- Altura: 56px, fundo branco, borda inferior `gi-border`
- Esquerda: breadcrumb da seção ativa
- Direita: toggle modo apresentação/exploração + botão "Voltar ao início"

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

O portal mockado usa uma identidade visual limpa e moderna, derivada da GI Group mas adaptada para um produto digital de uso do worker.

### Paleta interna do portal

- Background app: `#F8F9FA` (quase branco)
- Sidebar do portal: `#00145A` (navy)
- Topbar: branco com sombra sutil
- Cards: branco com borda `#E0E4E8`
- Destaque de progresso: `#1D57FB`
- Status "concluído": `#49B100`
- Status "pendente": `#FFC300`
- Status "bloqueado": `#DBDBDB`

### Fonte do portal

Mesma família Lato, mas em tamanhos menores (12-14px) para simular uma interface real de produto.

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
