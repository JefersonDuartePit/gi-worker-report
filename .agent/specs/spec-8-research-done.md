# spec-8-research-done.md — S7 Provocações e Próximos Passos

**Spec:** 8 — S7 Provocações e Próximos Passos  
**Fase:** Research  
**Data:** 2026-06-29  
**Branch:** `spec/08-s7-provocacoes-proximos-passos`

---

## 1. O que a Spec pede (SPECS.md §8)

Quatro blocos em sequência, todos sobre fundo `gi-navy`:

| # | Bloco | Descrição |
|---|-------|-----------|
| 1 | **Provocações técnicas** | 5–7 perguntas com destinatário (Carol / Jansen / ambos) e contexto expandível |
| 2 | **Plano faseado recomendado** | 3 fases (H2 2026 / H1 2027 / H2 2027) com IDs das iniciativas de cada fase |
| 3 | **Próximos passos imediatos** | 4 itens em formato de checklist visual |
| 4 | **CTA final** | Mensagem de encerramento Perform IT + GI Group, fundo `gi-navy`, texto branco |

**Critérios de aceite registrados:**
- [ ] Fundo `gi-navy`, identidade visual de encerramento
- [ ] 5–7 provocações com destinatário e contexto
- [ ] Plano faseado visual com 3 fases e iniciativas de cada uma
- [ ] Próximos passos em formato de checklist visual
- [ ] CTA de encerramento com identidade Perform IT + GI Group

---

## 2. O que já existe (não precisa criar)

### 2.1 Dados — `src/data/provocacoes.ts`
Arquivo **já populado** com 6 provocações (P01–P06), tipadas como `Provocacao`. Está dentro da faixa de "5–7" especificada. **Nenhuma alteração necessária no conteúdo existente.**

```
P01 → carol    — O novo ERP substitui integralmente?
P02 → carol    — Dono técnico da integração IEM → folha?
P03 → carol    — Capacity do squad de TI em paralelo?
P04 → jansen   — Quais BUs precisam alinhar antes?
P05 → ambos    — Cliente terá acesso ao portal?
P06 → ambos    — Ex-worker pós-desligamento sem vínculo trabalhista?
```

### 2.2 Tipo — `src/types/index.ts`
Interface `Provocacao` já definida:
```typescript
export interface Provocacao {
  id: string
  pergunta: string
  contexto: string
  destinatario: 'carol' | 'jansen' | 'ambos'
}
```

### 2.3 Dados — `src/data/iniciativas.ts`
`INICIATIVAS` com todos os 17 itens (I01–I17). Serão referenciados pelo plano faseado.

### 2.4 Stub — `src/components/sections/S7Provocacoes/index.tsx`
Existe apenas como placeholder (título + fundo). Será **substituído completamente**.

---

## 3. O que precisa ser criado

### 3.1 Novos tipos em `src/types/index.ts`

```typescript
export interface FasePlano {
  numero: 1 | 2 | 3
  titulo: string        // ex: "Centralização imediata"
  periodo: string       // ex: "H2 2026"
  iniciativaIds: string[]
}
```

### 3.2 Novos dados em `src/data/provocacoes.ts`

Adicionar dois exports no final do arquivo existente:

**`FASES: FasePlano[]`** — 3 fases com IDs das iniciativas (conforme SPECS.md):
```
Fase 1 (H2 2026): ['I01','I02','I07','I10','I13','I17']
Fase 2 (H1 2027): ['I03','I05','I06','I08','I12','I14']
Fase 3 (H2 2027): ['I04','I09','I11','I15','I16']
```

**`PROXIMOS_PASSOS: string[]`** — 4 itens (conforme SPECS.md):
```
1. Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis
2. Acesso à pasta gravada do processo de admissão (prometida pela Carol)
3. Alinhamento de holding com BUs sobre controle centralizado do worker
4. Definição do escopo do portal do worker dentro do IT Master Plan H2 2026
```

### 3.3 Novos componentes em `src/components/sections/S7Provocacoes/`

| Arquivo | Responsabilidade |
|---------|-----------------|
| `index.tsx` | Stub substituído — orquestra os 4 blocos; importa subcomponentes |
| `ProvocacaoCard.tsx` | Card individual de provocação: pergunta, badge destinatário, contexto expansível |
| `PlanoFaseado.tsx` | Visual das 3 fases com listagem das iniciativas de cada fase |

Os blocos "Próximos Passos" e "CTA Final" são simples o suficiente para ficarem no `index.tsx` sem subcomponente próprio.

---

## 4. Decisões de Design

### 4.1 Paleta — seção escura (`gi-navy`)
Toda a S7 usa fundo `gi-navy` (#00145A). Tokens disponíveis para conteúdo sobre fundo escuro:

| Uso | Token | Valor |
|-----|-------|-------|
| Título principal | `text-white` | #FFFFFF |
| Subtítulo / label | `text-gi-stardust` | #8899cc |
| Texto corrido | `text-gi-comet` | #aaccff |
| Caption / hint | `text-gi-crater` | #445566 |
| Borda de card | `border-gi-orbit` | #3355aa |
| Destaque (badge CTA) | `bg-gi-blue` | #1D57FB |

### 4.2 Badge de destinatário

| Valor | Label | Estilo sugerido |
|-------|-------|-----------------|
| `carol` | `Para: Carol · TI` | badge azul claro sobre dark |
| `jansen` | `Para: Jansen · CEO` | badge âmbar sobre dark |
| `ambos` | `Para: Carol + Jansen` | badge verde sobre dark |

### 4.3 Plano Faseado — apresentação visual

Cada fase como um card/coluna com:
- Número da fase + período (ex: "Fase 1 · H2 2026")
- Título (ex: "Centralização imediata")
- Lista das iniciativas: ID + título curto (lookup em `INICIATIVAS`)

Layout preferencial: 3 colunas side-by-side no desktop.

### 4.4 Checklist de Próximos Passos

Items com ícone de checkbox vazio (Lucide `Square` ou `Circle`), cor `gi-comet`, texto branco.

### 4.5 CTA Final

Bloco final com:
- Logotipo GI Group + Perform IT
- Frase de encerramento (ex: "Próximo passo: agendar workshop técnico com o squad de TI")
- Botão "Voltar ao início" (ghost, branco) que navega de volta ao planeta Hero via `usePresentation().goTo(0)`

---

## 5. Dependências e Riscos

### Dependências confirmadas
- `PROVOCACOES` de `src/data/provocacoes.ts` ✅ (não alterar conteúdo existente)
- `INICIATIVAS` de `src/data/iniciativas.ts` ✅ (somente leitura para montar fases)
- `Provocacao` de `src/types/index.ts` ✅ (não alterar tipo existente)
- Tokens de cor do `tailwind.config.ts` ✅ (`gi-navy`, `gi-stardust`, `gi-comet`, etc.)
- Componentes UI: `Badge`, `Card`, `Button` ✅ (disponíveis em `src/components/ui/`)
- Hook `usePresentation` ✅ (disponível via `PresentationContext`)
- Lucide React ✅ (disponível — ícones de checklist e destinatário)
- Framer Motion ✅ (disponível — animações de entrada)

### Riscos identificados

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| `FasePlano` com `numero: 1 \| 2 \| 3` pode ser restritivo se fases mudarem | Baixa | Aceitável — spec define exatamente 3 fases |
| Lookup de INICIATIVAS por ID no PlanoFaseado cria acoplamento de dados | Baixa | É intencional — mantém single source of truth |
| Logos (GI Group + Perform IT) no CTA — `logo-gi-group.png` existe em `src/assets/`; logo Perform IT não localizada | Média | Na ausência de logo Perform IT, usar nome textual "Perform IT" no CTA |
| Spec 7 (Portal) ainda não mergeada — S7 não depende de arquivos do portal | Nenhum | Sem conflito por design |

---

## 6. Arquivos Permitidos para o Plan/Implement

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificar — adicionar `FasePlano` |
| `src/data/provocacoes.ts` | Modificar — adicionar `FASES` e `PROXIMOS_PASSOS` |
| `src/components/sections/S7Provocacoes/index.tsx` | Substituir stub |
| `src/components/sections/S7Provocacoes/ProvocacaoCard.tsx` | Criar |
| `src/components/sections/S7Provocacoes/PlanoFaseado.tsx` | Criar |

**Fora da lista acima: nenhum arquivo deve ser tocado.**

---

## 7. Verificação do CLAUDE.md — Regras Inegociáveis

- [x] Nenhuma mistura de fases — este artefato não contém plano nem implementação
- [x] Nenhum tipo `any` previsto
- [x] Dados estáticos ficam em `src/data/` — confirmado
- [x] Nenhum componente de UI criado do zero — Badge, Card, Button do design system serão reutilizados
- [x] Nenhuma inferência de requisito — tudo mapeado de SPECS.md e dados existentes
- [x] Spec 7 (Portal) em branch paralela — nenhum arquivo do portal referenciado

---

## 8. Resumo para aprovação

**O que já existe e não muda:** `provocacoes.ts` com 6 provocações, tipo `Provocacao`, dados de `iniciativas.ts`.

**O que será criado:**
1. Tipo `FasePlano` em `types/index.ts`
2. Constantes `FASES` e `PROXIMOS_PASSOS` em `data/provocacoes.ts`
3. Componente `ProvocacaoCard.tsx` (card com pergunta + badge destinatário + contexto expansível)
4. Componente `PlanoFaseado.tsx` (3 colunas, uma por fase, com lista de iniciativas)
5. `S7Provocacoes/index.tsx` com os 4 blocos: provocações → plano → próximos passos → CTA final

**Visual:** fundo `gi-navy` do início ao fim. Tipografia sobre escuro (stardust/comet). Animações Framer Motion de entrada.

**Nenhuma ambiguidade identificada.** Pronto para avançar ao Plan.
