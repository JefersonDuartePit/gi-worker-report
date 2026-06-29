# spec-5-research-done.md — S4 Arquitetura As-is / To-be

**Spec:** 5 — S4 Arquitetura As-is / To-be
**Fase:** Research concluído
**Data:** 2026-06-26
**Branch:** `spec/05-s4-arquitetura-as-is-to-be`
**Executado por:** Agente Research (Claude)

---

## 1. O que a Spec pede

Fonte: `SPECS.md §Spec 5`

### Conteúdo obrigatório

| Item | Descrição |
|------|-----------|
| Toggle As-is / To-be | Troca entre os dois estados com animação |
| Diagrama As-is | Worker no centro, 6+ canais desconexos, colaborador GI como intermediário manual de tudo |
| Diagrama To-be | Portal do Worker como hub único, camada de API genérica, automações, cliente com visibilidade |
| Tabela comparativa | O que muda em cada etapa da jornada |

### Critérios de aceite

- [ ] Toggle As-is/To-be funcional com animação de transição
- [ ] Diagrama As-is mostra fragmentação (muitas setas, sistemas isolados)
- [ ] Diagrama To-be mostra centralização (portal como hub)
- [ ] Tabela comparativa clara e legível
- [ ] Identidade visual GI aplicada nos diagramas

---

## 2. Decisões de Design do Sistema

Fonte: `DESIGN-SYSTEM.md §7`

- **Fundo da seção:** `gi-white` (branco)
- **Tom visual:** "Diagrama as-is vs to-be"
- **Seção ocupa:** mínimo 100vh
- **Animações:** Framer Motion, máximo 400ms entrada, 200ms micro-interações
- **Cores do diagrama:** usar tokens GI — `gi-navy`, `gi-blue`, `gi-red`, `gi-amber`, `gi-steel`, `gi-green`
- **Tipografia:** Lato, tokens do design system — nunca hex hard-coded

---

## 3. Dados Existentes Relevantes

### 3.1 `src/data/sistemas.ts` — SISTEMAS (12 sistemas)

Já existe e está completo. Os 12 sistemas são:

| ID | Nome | Status |
|----|------|--------|
| S01 | IEM | `usa` |
| S02 | Plataforma de Folha | `substitui` |
| S03 | Spinner / Fusion | `nao-toca` |
| S04 | Portal do Candidato Global | `nao-toca` |
| S05 | Blip / WhatsApp | `substitui` |
| S06 | TomTicket | `substitui` |
| S07 | GLPI | `substitui` |
| S08 | VIP | `substitui` |
| S09 | D4Sign / Assinatura Eletrônica | `integra` |
| S10 | SOC / Medicina do Trabalho | `integra` |
| S11 | Ponto Mais | `integra` |
| S12 | OutSystems | `usa` |

**Decisão:** Os diagramas não reutilizam diretamente o array `SISTEMAS` — a lógica de posicionamento e agrupamento de nós no diagrama exige um modelo próprio. `SISTEMAS` permanece como fonte de verdade da Spec 3 (S2 Diagnóstico).

### 3.2 `src/types/index.ts` — tipos existentes

Tipos relevantes já presentes:
- `StatusSistema = 'usa' | 'integra' | 'substitui' | 'nao-toca'`
- `Jornada = 'admissao' | 'ciclo-ativo' | 'offboarding'`
- `UiState`, `PresentationContextValue`, `SistemaCard` etc.

Não existe nenhum tipo para diagramas de arquitetura — precisam ser criados.

---

## 4. Dados a Criar

A spec não tem dados estáticos mapeados em nenhum documento existente. A seção S4 exige um arquivo novo: `src/data/arquitetura.ts`.

### 4.1 Conteúdo do diagrama As-is

Com base em `CONTEXT.md §2.1` e `SPECS.md §Spec 5`:

**Nós do As-is:**
- Worker (hub central, vítima da fragmentação)
- Colaborador GI (intermediário manual — aparece como ponte forçada)
- 6+ canais de comunicação desconexos: Blip/WhatsApp, TomTicket, GLPI, VIP, e-mail, WhatsApp pessoal
- Sistemas isolados: IEM, Plataforma de Folha, D4Sign, SOC, Ponto Mais
- Sistemas intocáveis: Spinner/Fusion, Portal do Candidato Global

**Mensagem visual:** "tudo passa pelo Colaborador GI manualmente — sem integração, sem fluxo automático"

### 4.2 Conteúdo do diagrama To-be

Com base em `SPECS.md §Spec 5` e `CONTEXT.md §6`:

**Nós do To-be:**
- Portal do Worker (hub central — único canal do worker)
- Camada de API genérica (integração agnóstica de plataforma)
- Sistemas integrados via API: Plataforma de Folha (genérica), Workforce Management, ATS
- Automações: admissão, afastamentos, desligamento
- Cliente com dashboard de visibilidade direta
- Colaborador GI com visão unificada (sem intermediação manual)

**Mensagem visual:** "Portal do Worker como canal único — Worker e Cliente têm autonomia, Colaborador GI tem visão consolidada"

### 4.3 Tabela comparativa

3 linhas (uma por macrojornada) × 2 colunas (As-is / To-be):

| Jornada | As-is | To-be |
|---------|-------|-------|
| Admissão | Documentos por WhatsApp pessoal, status invisível, redigitação entre sistemas | Fluxo digital centralizado, rastreio em tempo real, integração automática IEM → Folha |
| Ciclo Ativo | Atendimento fragmentado em 4+ canais, sem histórico, controle por planilha | Central unificada com SLA, autoatendimento no Portal, alertas automáticos |
| Offboarding | Processo 100% manual via planilha + TomTicket, worker fica 10 dias sem informação | Fluxo digital automatizado, worker acompanha status, documentos disponíveis via portal |

---

## 5. Abordagem Técnica

### 5.1 Tipo de diagrama

A spec permite "SVG ou componente React". Decisão: **componente React com posicionamento absoluto + overlay SVG nativo para setas**.

Justificativa:
- Não introduz biblioteca nova
- Tailwind cobre o estilo dos nós
- SVG nativo (sem biblioteca externa) é suficiente para setas retas/curvas simples
- Mantém o padrão do projeto: React + Tailwind + Framer Motion

### 5.2 Toggle de vista

`useState<VistaArquitetura>('as-is')` — local ao `index.tsx` da seção. Não precisa de hook customizado.

Animação de troca: `AnimatePresence mode="wait"` + `motion.div` com `fadeIn` (150ms) — rápido, sem bloquear leitura.

### 5.3 Estrutura de nós

Cada nó do diagrama tem: `id`, `label`, `tipo`, `descricao`, `x`, `y` (posição percentual no container).

As conexões (arestas) são modeladas como array de pares `[fromId, toId]`.

O diagrama usa um container `relative` de altura fixa (ex: `h-[480px]`) com nós em `absolute`. O SVG de setas é um `<svg>` com `position: absolute; top:0; left:0; width:100%; height:100%` sobre os nós.

---

## 6. Novos Tipos a Adicionar em `src/types/index.ts`

```typescript
export type VistaArquitetura = 'as-is' | 'to-be'

export type TipoNoArq = 'hub-worker' | 'hub-portal' | 'canal' | 'sistema' | 'automacao' | 'cliente' | 'intermediario'

export interface NoArq {
  id: string
  label: string
  tipo: TipoNoArq
  descricao: string
  x: number  // posição em % do container (0–100)
  y: number
}

export interface ArestaArq {
  from: string
  to: string
  estilo?: 'solida' | 'tracejada'
}

export interface DiagramaArq {
  nos: NoArq[]
  arestas: ArestaArq[]
}

export interface ComparativoArq {
  jornada: Jornada
  asIs: string
  toBe: string
}
```

---

## 7. Novos Arquivos a Criar

| Arquivo | Ação | Conteúdo |
|---------|------|----------|
| `src/data/arquitetura.ts` | Criar | `DIAGRAMA_AS_IS`, `DIAGRAMA_TO_BE`, `COMPARATIVO_ARQ` |
| `src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx` | Criar | Renderiza nós + setas SVG para uma vista (As-is ou To-be) |
| `src/components/sections/S4Arquitetura/TabelaComparativa.tsx` | Criar | Tabela 3 linhas × 2 colunas com tokens GI |
| `src/components/sections/S4Arquitetura/index.tsx` | Modificar | Substituir stub — toggle + diagrama + tabela |

---

## 8. Arquivos Existentes Não Tocados

| Arquivo | Motivo |
|---------|--------|
| `src/data/sistemas.ts` | Pertence à Spec 3 — não tocar |
| `src/data/dores.ts` | Pertence à Spec 4 — não tocar |
| `src/data/iniciativas.ts` | Pertence à Spec 6 — não tocar |
| `src/types/index.ts` | Somente **adicionar** novos tipos — não modificar existentes |
| Todos os arquivos de S1, S2, S3, S6, S7 | Fora do escopo |
| Arquivos da branch `spec/07-portal-do-worker` | Proibido tocar: `src/components/portal/`, `src/components/sections/S6Portal/`, `src/hooks/usePortalNav.ts` |

---

## 9. Riscos e Observações

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Posicionamento de setas SVG sobre nós absolutos pode ficar impreciso em telas menores | Baixa | Projeto suporta apenas 1024px+; usar % relativo ao container |
| Diagrama com muitos nós pode ficar denso no As-is (12 sistemas) | Média | Agrupar sistemas por categoria visual; usar nós menores para sistemas periféricos |
| Coordenadas de nós são hardcodadas em `arquitetura.ts` — ajuste fino no Plan | Baixa | Aceito como trade-off; coordenadas são parte do dado estático da seção |

---

## 10. Pendências — Nenhuma

Todos os requisitos da spec estão cobertos pelos documentos lidos. Nenhuma decisão de produto ou técnica ficou sem resposta. A fase Plan pode ser iniciada com base neste documento.

---

## 11. Resumo para o Humano

A Spec 5 implementa a seção **S4 — Arquitetura As-is / To-be** com:

1. **Toggle animado** entre dois estados visuais (As-is / To-be) via `useState` + `AnimatePresence`
2. **Dois diagramas** — componentes React com nós absolutos e setas SVG nativas:
   - As-is: Worker no centro, 6+ canais desconexos, Colaborador GI como gargalo
   - To-be: Portal do Worker como hub único, camada de API, cliente com visibilidade
3. **Tabela comparativa** — 3 jornadas × 2 colunas, dados de `CONTEXT.md` e `SPECS.md`

**Novos tipos:** 5 (em `src/types/index.ts`)
**Novo arquivo de dados:** 1 (`src/data/arquitetura.ts`)
**Novos componentes:** 2 (`DiagramaArquitetura.tsx`, `TabelaComparativa.tsx`)
**Componente modificado:** 1 (`S4Arquitetura/index.tsx` — stub substituído)

**Sem riscos bloqueantes.** Pronto para iniciar a fase Plan.
