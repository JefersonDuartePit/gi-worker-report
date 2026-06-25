# spec-3-research-done.md — S2 Diagnóstico Sistêmico

**Spec:** 3 — S2 Diagnóstico Sistêmico
**Fase:** Research concluído
**Data:** 2026-06-25
**Aprovado por:** Jeff

---

## 1. Objetivo da Spec

Implementar a seção S2 do relatório: mapa interativo dos sistemas atuais da GI Group
organizados em 4 quadrantes (Usa / Integra / Substitui / Não toca), com tooltips de
detalhamento ao hover e filtro por quadrante.

---

## 2. Estado atual dos artefatos

| Artefato | Status |
|----------|--------|
| `src/components/sections/S2Diagnostico/index.tsx` | Stub placeholder — só título |
| `src/data/sistemas.ts` | Populado com 12 sistemas, mas sem `problema` e `decisaoProposta` |
| `src/types/index.ts` → `interface Sistema` | Definida, sem os 2 novos campos |
| `src/components/ui/Badge.tsx` | Funcional — variante `bloqueado` disponível |
| `src/components/ui/Card.tsx` | Funcional — variante `hoverable` disponível |
| `src/components/ui/Button.tsx` | Funcional |
| `src/components/ui/Tooltip.tsx` | Stub com interface para Spec 7 — não tocar |
| `src/lib/utils.ts` → `cn()` | Disponível |
| Framer Motion, Lucide React | Instalados |

---

## 3. Decisões de Research (aprovadas)

### 3.1 Interface `Sistema` — enriquecer com 2 novos campos

Adicionar `problema: string` e `decisaoProposta: string` à interface `Sistema`
em `src/types/index.ts`. Popular todos os 12 sistemas no `sistemas.ts` com textos
extraídos do CONTEXT.md.

**Motivo:** o tooltip exige 3 campos de texto (função, problema, decisão). Os campos
atuais (`funcao`, `restricao`) não cobrem os 3 de forma completa e uniforme.

### 3.2 Tooltip de sistema — inline em `SistemaCard.tsx`

Não usar nem modificar `src/components/ui/Tooltip.tsx` (reservado para Spec 7 com
interface própria: `dorId` + `iniciativaId`).

Implementar tooltip de detalhamento **inline** no `SistemaCard.tsx` com posicionamento
manual CSS (`absolute`, `group-hover:visible`), sem `@floating-ui/react`.

**Motivo:** interface do Tooltip.tsx é voltada para dores/iniciativas do portal mockado.
Reusá-la aqui exigiria quebrar o contrato da Spec 7. Tooltip inline é mais simples e
sem nova dependência.

---

## 4. Mapeamento dos 12 sistemas — dados do tooltip

Conteúdo a ser escrito em `src/data/sistemas.ts` para os novos campos:

| ID | Sistema | problema | decisaoProposta |
|----|---------|---------|----------------|
| S01 | IEM | Integração unidirecional com a plataforma de folha — dados não retornam automaticamente após admissão | Integrar via iPaaS quando OutSystems assumir o portal de admissão |
| S02 | Plataforma de Folha | ERP legado sem API robusta; redigitação manual de dados do IEM; substituição prevista para 2027 | Substituir por plataforma moderna — não amarrar arquitetura neste sistema |
| S03 | Spinner / Fusion | Controlado pela matriz italiana — qualquer alteração exige aprovação global | Manter intocável; construir integração intermediária quando aprovado pelo Global |
| S04 | Portal do Candidato Global | Controlado pelo Global — Brasil não tem autonomia sobre o processo de candidatura | Manter intocável; focar no ciclo ativo e offboarding onde há autonomia local |
| S05 | Blip / WhatsApp | Canais pessoais dos analistas bloqueados por volume (>100 msgs/dia); sem histórico consolidado | Substituir pelo Portal do Worker com central de atendimento unificada (I07) |
| S06 | TomTicket | Usado para tudo — inclusive processos que deveriam ser workflows automatizados | Substituir pela central de atendimento unificada com SLA único (I07) |
| S07 | GLPI | Helpdesk de TI separado do TomTicket — mesma fragmentação, canais duplicados | Consolidar no helpdesk único; GLPI mantido apenas para suporte técnico interno |
| S08 | VIP | Mais um canal de comunicação sem integração — aumenta a dispersão da informação | Substituir pelo Portal do Worker como canal único de comunicação |
| S09 | D4Sign / Assinatura Eletrônica | Baixa de documentos feita um a um, manualmente — sem envio em lote | Integrar para assinatura padronizada em lote (I05 — admissão; I14 — rescisão) |
| S10 | SOC / Medicina do Trabalho | Sistema completamente isolado — sem integração com folha ou fluxo de admissão | Integrar para automação de agendamento e controle de ASO (I16) |
| S11 | Ponto Mais | Integração com plataforma de folha incompleta — fechamento de ponto ainda manual | Integrar para tratamento e fechamento automatizado de frequência (I09) |
| S12 | OutSystems | Plataforma em construção — portal de admissão em implantação, ainda sem entrar em produção | Usar como pilar do portal de admissão digital; não retrabalhar — referência de contexto |

---

## 5. Arquivos a criar/modificar

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificar — adicionar `problema: string` e `decisaoProposta: string` à interface `Sistema` |
| `src/data/sistemas.ts` | Modificar — enriquecer os 12 sistemas com os 2 novos campos |
| `src/components/sections/S2Diagnostico/index.tsx` | Modificar — implementar seção completa |
| `src/components/sections/S2Diagnostico/SistemaCard.tsx` | Criar — card com tooltip inline |
| `src/components/sections/S2Diagnostico/MapaSistemas.tsx` | Criar — grid de 4 quadrantes com filtro |

**Não tocar:**
- `src/components/ui/Tooltip.tsx` — reservado para Spec 7
- `src/components/portal/` — exclusivo da branch `spec/07-portal-do-worker`
- Qualquer arquivo fora desta lista

---

## 6. Referências do design system aplicáveis

### Fundo e layout
- Fundo: `bg-white` (DESIGN-SYSTEM.md §7 — S2 usa `gi-white`)
- Padding de seção: `py-20 px-12`
- Seção ocupa `min-h-screen`

### Quadrantes — cores por status
| Status | Cor de destaque | Token |
|--------|----------------|-------|
| `usa` | Azul elétrico | `gi-blue` |
| `integra` | Azul acinzentado | `gi-steel` |
| `substitui` | Âmbar | `gi-amber` |
| `nao-toca` | Vermelho | `gi-red` |

### Componentes UI reutilizáveis
- `Card` variante `hoverable` → card de sistema
- `Badge` variante `bloqueado` → badge de restrição em sistemas "Não toca"
- `Button` variante `ghost` ou `secondary` → botões de filtro por quadrante
- `cn()` de `src/lib/utils.ts` → classes condicionais

### Animações
- Entrada dos quadrantes: `staggerChildren` com Framer Motion, delay 0.1s entre quadrantes
- Entrada dos cards dentro de cada quadrante: `staggerChildren` com delay 0.05s
- Max 400ms por animação (CODING-GUIDELINES.md §7)

### Tooltip inline
- Trigger: `group` no card pai + `group-hover:opacity-100` no tooltip
- Posição: acima do card, centralizado
- Visual: fundo `gi-dark` (#1E1E1E), texto branco, `rounded-lg`, `p-3`, `text-xs`
- Conteúdo: 3 linhas — **Função**, **Problema**, **Decisão**
- Nunca cortar a tela: usar `bottom-full mb-2` e overflow check via Tailwind

---

## 7. Estrutura de componentes

```
src/components/sections/S2Diagnostico/
├── index.tsx          # Componente principal: título da seção + MapaSistemas
├── SistemaCard.tsx    # Card individual com tooltip inline
└── MapaSistemas.tsx   # Grid de 4 quadrantes + lógica de filtro ativo
```

### Responsabilidades

**`MapaSistemas.tsx`**
- Importa `SISTEMAS` de `src/data/sistemas.ts`
- Estado local: `activeFilter: StatusSistema | 'todos'` (useState)
- Renderiza 4 colunas/quadrantes com label clicável
- Filtra `SISTEMAS` por `status` conforme `activeFilter`
- Passa sistemas para `SistemaCard`
- Animação stagger nos quadrantes e cards via Framer Motion

**`SistemaCard.tsx`**
- Recebe `sistema: Sistema` como prop
- Renderiza `Card` hoverable
- Tooltip inline (posicionamento CSS simples)
- Badge de restrição quando `sistema.status === 'nao-toca'`
- Nome do sistema em destaque + `funcao` em texto secundário

**`index.tsx`** (S2Diagnostico)
- Título da seção: "Diagnóstico Sistêmico"
- Subtítulo: "Mapeamento dos sistemas atuais da GI Group"
- Renderiza `<MapaSistemas />`
- Animação de entrada da seção (`fadeInUp`, 400ms)

---

## 8. Riscos residuais

| Risco | Status |
|-------|--------|
| Interface `Sistema` incompleta | Resolvido — enriquecer com 2 novos campos |
| `Tooltip.tsx` com interface incompatível | Resolvido — tooltip inline em `SistemaCard.tsx` |
| `@floating-ui/react` não instalado | Resolvido — posicionamento manual CSS |
| Tooltip cortar a tela em cards no topo | Mitigar com `bottom-full mb-2` (tooltip acima do card) |

---

## 9. Critérios de aceite (da SPECS.md)

- [ ] Quatro quadrantes visualmente distintos com cores corretas por status
- [ ] Todos os 12 sistemas mapeados com dados corretos
- [ ] Tooltip funcional ao hover com função + problema + decisão
- [ ] Filtro por quadrante funcional (clique no label)
- [ ] Animação de entrada por quadrante (stagger)
- [ ] Badge de restrição visível nos sistemas "Não toca"
- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Fundo `bg-white`, seção `min-h-screen`
