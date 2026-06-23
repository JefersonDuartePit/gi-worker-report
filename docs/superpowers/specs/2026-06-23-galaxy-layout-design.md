# Design Spec — Layout Galáxia
**Data:** 2026-06-23  
**Projeto:** GI Group · Portal do Worker  
**Autor:** Jefferson (Perform IT) via brainstorming session  
**Status:** Aprovado — pronto para plano de implementação

---

## Contexto

O layout atual (Spec 1) usa sidebar fixa `gi-navy` + header topbar + scroll vertical — funcional, mas sem personalidade. A proposta substitui a navegação por uma metáfora de galáxia: cada módulo do relatório é um planeta. O objetivo é criar uma experiência lúdica e memorável para Carol (TI GI Group) e Jansen (CEO), sem perder a seriedade executiva do conteúdo.

---

## Decisões de Design

### Estados de UI

O relatório opera em **3 estados distintos**, controlados por `uiState: 'splash' | 'galaxy' | 'module'` em `App.tsx`.

| Estado | Gatilho de entrada | Visual |
|--------|-------------------|--------|
| `splash` | Abertura do relatório | Fundo espacial escuro, logo GI Group, animação pulsante |
| `galaxy` | Auto-avança após splash / botão "← Galáxia" | Mapa completo com 7 planetas, sol GI, linhas orbitais |
| `module` | Click em qualquer planeta | Header fixo + sidebar mini-mapa + conteúdo da seção |

### Transições

- **Splash → Galáxia:** fade dissolve, 600ms (Framer Motion `opacity`)
- **Galáxia → Módulo:** planeta clicado faz `scale` 1→1.15→0 enquanto conteúdo entra com `opacity` 0→1, ~400ms total
- **Módulo → Galáxia:** botão "← Galáxia" — conteúdo sai, galáxia reaparece com fade, ~300ms
- Nenhuma transição bloqueia leitura ou ultrapassa 600ms

---

## Estado 1 — Splash Screen

**Componente:** `SplashScreen.tsx`

- Fundo: `radial-gradient(#000820 → #000000)` com estrelas CSS estáticas
- Logo GI Group centralizada
- Separador vertical fino
- Título: "Portal do Worker"
- Subtítulo: "Diagnóstico & Transformação Digital · 2026"
- Animação pulsante (anel duplo, Framer Motion `scale` loop)
- Auto-avança para `galaxy` após 2.5s, ou no primeiro click/toque

---

## Estado 2 — Mapa da Galáxia

**Componente:** `GalaxyMap.tsx`

### Background
Gradiente radial `#000820` → `#000000`, estrelas CSS estáticas (15–20 pontos brancos semi-transparentes via `radial-gradient` em `background-image`).

### GalaxyHeader
**Componente:** `GalaxyHeader.tsx` — 56px, `background: linear-gradient(to bottom, #000820aa, transparent)`
- Esquerda: logo GI Group + label "Portal do Worker"
- Centro: instrução "Escolha um módulo para começar"
- Direita: botão "Apresentação" (alterna modo)

### Sol central
- 56px, `radial-gradient(#ffd700, #cc4400)`, glow laranja
- Label "GI" centralizado
- Posicionado no centro geométrico do mapa

### Linhas orbitais decorativas
- 2–3 elipses `border: 1px dashed #1D57FB18` com `rotateX(70deg)` — perspectiva orbital
- SVG com linhas `stroke-dasharray` conectando sol a cada planeta

### Planetas

| # | Módulo | Tamanho (px) | Cor base | Anel orbital |
|---|--------|-------------|----------|-------------|
| 01 | Contexto | 44 | `#2255aa` → `#001144` | — |
| 02 | Diagnóstico | 64 | `#334488` → `#000830` | sim |
| 03 | Dores | 38 | `#884455` → `#220011` | — |
| 04 | Arquitetura | 72 | `#4488ff` → `#0a2288` | — |
| 05 | Iniciativas | 58 | `#448899` → `#001122` | sim |
| 06 | Portal do Worker | 78 | `#66aaff` → `#003399` | — |
| 07 | Próximos Passos | 34 | `#556677` → `#111222` | — |

Cada planeta é renderizado pelo componente `Planet.tsx` com props: `id`, `label`, `size`, `colorFrom`, `colorTo`, `hasRing`, `position` (x/y percentual), `isActive`.

**Interação:**
- `hover`: `scale(1.1)` + glow intensificado, 200ms
- `click`: dispara transição para estado `module`, salva planeta ativo em contexto

**Hint:** texto estático no rodapé — "↑ clique em qualquer planeta para pousar"

---

## Estado 3 — Módulo (conteúdo + mini-mapa)

### Header fixo
**Componente:** `Header.tsx` (existente, sem alteração funcional)  
56px, fundo branco, `border-bottom: gi-border`
- Esquerda: logo GI Group + separador + breadcrumb (`<NomeMódulo> · módulo 0N`)
- Direita: botão "Apresentação" + botão "← Galáxia" (`bg-gi-blue`)

### Sidebar mini-mapa
**Componente:** `MiniMap.tsx`  
200px, `bg-gi-navy`, fixa abaixo do header

```
┌─────────────────────┐
│ GALÁXIA  (label)    │
├─────────────────────┤
│                     │
│   SVG orbital       │
│   planetas +        │
│   labels externos   │
│   planeta ativo:    │
│   glow + anel extra │
│                     │
├─────────────────────┤
│  [Apresentação]     │
└─────────────────────┘
```

O SVG do mini-mapa replica proporções e posições relativas do mapa completo. Labels de texto visíveis ao lado/abaixo de cada planeta. Planeta ativo com `stroke` extra + glow intensificado.

### Área de conteúdo
`ml-[200px] mt-[56px]`, scroll vertical livre. As 7 `<Section>` existentes são preservadas — apenas a seção ativa é visível (as demais ficam `display:none` ou equivalente via `uiState`).

### Modo Apresentação
Quando `mode === 'presentation'`:
- Sidebar some
- Conteúdo ocupa largura total
- Barra flutuante no rodapé: `← Anterior` | `04 / 07` | `Próximo →`

---

## Novos Componentes

| Componente | Localização | Responsabilidade |
|-----------|-------------|-----------------|
| `SplashScreen.tsx` | `src/components/layout/` | Tela de abertura + auto-avançar |
| `GalaxyMap.tsx` | `src/components/layout/` | Mapa completo com planetas |
| `GalaxyHeader.tsx` | `src/components/layout/` | Header do estado galáxia |
| `MiniMap.tsx` | `src/components/layout/` | SVG mini-mapa na sidebar |
| `Planet.tsx` | `src/components/ui/` | Esfera reutilizável com props visuais |

---

## Alterações em Componentes Existentes

| Componente | O que muda |
|-----------|-----------|
| `App.tsx` | Adiciona `uiState: 'splash' | 'galaxy' | 'module'` + `activeSectionId` state + lógica de transição |
| `Header.tsx` | Adiciona botão "← Galáxia" + breadcrumb com número do módulo |
| `Sidebar.tsx` | **Removido** — substituído por `MiniMap.tsx` |
| `useActiveSection.ts` | **Removido** — seção ativa passa a ser determinada pelo planeta clicado, não por Intersection Observer |

---

## O Que Não Muda

- Paleta de cores GI Group (DESIGN-SYSTEM.md)
- Tipografia Lato
- Componentes `Card`, `Badge`, `Button`, `Tag`
- `PresentationContext` e `usePresentation`
- Conteúdo das 7 seções (S1–S7)

---

## Restrições

- Sem animações > 600ms
- Sem dependências novas além de Framer Motion (já presente)
- Largura mínima suportada: 1024px (sem responsividade mobile — relatório executivo)
- Planetas posicionados com `position: absolute` em container de tamanho fixo (`700×480px`) — não responsivos
