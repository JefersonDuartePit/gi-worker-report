# PROJECT-STATE.md — GI Group · Portal do Worker

**Atualizado em:** 23 de junho de 2026
**Status do projeto:** Spec 1 concluída · Galaxy Layout redesign em implementação
**Specs concluídas:** Spec 1 — Setup e Shell
**Spec em andamento:** Galaxy Layout (plano pronto, subagentes em execução)
**Próxima spec após galaxy:** Spec 2 — S1 Hero

---

## 1. Histórico do Projeto

### Origem

O projeto nasceu de um design sprint de 5 dias conduzido pela **Perform IT** com os times de CARE e SMS da **GI Group Holding Brasil**, entre maio e junho de 2026. O sprint mapeou a jornada completa do worker temporário — admissão, ciclo ativo e offboarding — identificando dores, oportunidades e iniciativas priorizadas.

### Reuniões-chave

**Workshop CARE/SMS (5 dias — maio/junho 2026)**
- Mapeamento de jornada ponta a ponta com times de CARE e SMS
- Identificação de 24 iniciativas de melhoria
- Priorização por impacto no negócio, experiência do worker e esforço de implantação
- Votação resultou em 17 iniciativas estruturadas para o relatório

**Alinhamento com Djansen (pré-workshop)**
- Definição da estrutura de cocriação
- Calibração das macrojornadas: admissão, ciclo ativo, offboarding
- Escolha do formato Plano B: backlog de iniciativas em vez de priorização por jornada completa

**Reunião de TI — Carol (16/06/2026)**
- Alinhamento do escopo da Perform IT com a gerente de sistemas da GI
- **Decisão:** foco principal no portal do worker (ciclo ativo + offboarding)
- **Decisão:** admissão usada como referência de contexto — não retrabalhar
- **Decisão:** plataforma de folha (GINFOR) será substituída no próximo ano — usar nomes genéricos
- **Decisão:** squad de desenvolvimento da Carol é o braço executivo de implantação
- **Restrição confirmada:** portal do candidato global, CRM global e RP global são intocáveis
- **Restrição confirmada:** IA requer aprovação global de segurança da informação
- **Abertura:** pode voar na visão ideal, mas também entregar um to-be realista para H2 2026

### Decisão de formato

O entregável principal da Perform IT foi definido como um **relatório interativo em React** — um site estático que apresenta:
- Diagnóstico sistêmico (as-is)
- Arquitetura proposta (to-be)
- As 17 iniciativas
- Telas navegáveis do portal do worker (alta fidelidade)
- Provocações técnicas e próximos passos

O relatório será apresentado primeiro ao service designer interno da Perform IT para validação, depois ao Jansen e Carol da GI Group.

---

## 2. Estado Atual das Specs

| Spec | Nome                          | Status              | Artefatos                                          |
| ---- | ----------------------------- | ------------------- | -------------------------------------------------- |
| 1    | Setup e Shell                 | ✅ Concluída         | `spec-1-implement-done.md`                         |
| 2    | S1 — Hero                     | ✅ Concluída         | `spec-2-implement-done.md`                         |
| 3    | S2 — Diagnóstico Sistêmico    | ✅ Concluída         | `spec-3-implement-done.md`                         |
| 4    | S3 — Dores por Persona        | ⬜ Pendente          | —                                                  |
| 5    | S4 — Arquitetura As-is/To-be  | ⬜ Pendente          | —                                                  |
| 6    | S5 — Iniciativas              | ⬜ Pendente          | —                                                  |
| 7    | S6 — Portal do Worker         | 🔀 Em paralelo       | `spec-7-research-done.md`, `spec-7-plan-done.md`   |
| 8    | S7 — Provocações e Próximos Passos | ⬜ Pendente   | —                                                  |

---

## 2.1 Desenvolvimento Paralelo Ativo

| Branch                      | Spec | Responsável | Arquivos exclusivos (não tocar nas demais branches)                          |
| --------------------------- | ---- | ----------- | ---------------------------------------------------------------------------- |
| `spec/07-portal-do-worker`  | 7    | Designer    | `src/components/portal/`, `src/components/sections/S6Portal/`, `src/hooks/usePortalNav.ts` |

**Para agentes trabalhando nas Specs 2–6 e 8:** os arquivos listados acima são propriedade exclusiva da branch `spec/07-portal-do-worker`. Não criar, modificar nem referenciar esses caminhos. A seção S6Portal existe como placeholder — deixar intacta.

**Integração:** quando a branch `spec/07-portal-do-worker` for mergeada na main, não haverá conflitos com as Specs 2–6 e 8. O merge será limpo por design.

---

## 3. Estrutura Atual do Projeto

Estrutura implantada pela Spec 1 (branch `spec/01-setup-shell`):

```
gi-worker-report/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── sections/
│   │   └── portal/
│   ├── data/
│   ├── hooks/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .agent/
│   └── specs/
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Decisões Técnicas Registradas

| Decisão                                    | Justificativa                                              | Registrada em    |
| ------------------------------------------ | ---------------------------------------------------------- | ---------------- |
| React + Vite + TypeScript                  | Stack moderna, build estático, sem backend necessário      | ARCHITECTURE.md  |
| Tailwind CSS                               | Tokens do design system GI Group via config, sem CSS extra | DESIGN-SYSTEM.md |
| Framer Motion para animações               | Controle de animações com API declarativa                  | DESIGN-SYSTEM.md |
| Recharts para gráficos                     | Biblioteca React nativa, sem dependência externa           | ARCHITECTURE.md  |
| Dados estáticos em `src/data/`             | Relatório não tem backend — dados em memória               | ARCHITECTURE.md  |
| Portal mockado como componentes React      | Alta fidelidade sem custo de backend                       | ARCHITECTURE.md  |
| Nomes genéricos para sistemas (sem GINFOR) | Plataforma de folha será substituída — não amarrar         | CONTEXT.md       |
| Identidade visual baseada em tokens GI     | Cores e tipografia extraídas do site oficial               | DESIGN-SYSTEM.md |
| 17 iniciativas — fonte: Workshop Dia 5     | IDs 01–17 conforme documento tratado de 18/06/2026         | CONTEXT.md       |

---

## 5. Dependências Externas

| Dependência     | Versão  | Uso                                    |
| --------------- | ------- | -------------------------------------- |
| react           | 18.x    | Framework principal                    |
| react-dom       | 18.x    | Renderização DOM                       |
| typescript      | 5.x     | Linguagem                              |
| vite            | 5.x     | Build tool                             |
| tailwindcss     | 3.x     | Estilização                            |
| framer-motion   | 11.x    | Animações                              |
| recharts        | 2.x     | Gráficos                               |
| lucide-react    | latest  | Ícones                                 |
| clsx            | latest  | Classes condicionais                   |

---

## 6. Histórico de Atualizações

### Atualização — Galaxy Layout Redesign — 2026-06-23

**Status:** plano completo, implementação em andamento via subagentes

**Contexto:** O layout sidebar+scroll da Spec 1 foi substituído por uma experiência de galáxia lúdica e gamificada. Cada módulo do relatório é um planeta navegável. Esta é uma decisão de produto confirmada pelo humano (Jeff) antes de qualquer conteúdo ser implementado nas Specs 2–8.

**Impacto para Specs 2–8:**
- Cada seção (`S1Hero`, `S2Diagnostico`, etc.) continua existindo como componente próprio — sem mudança na interface interna
- O componente de seção é renderizado diretamente (`<activeSection.Component />`) — sem wrapper de scroll
- O fundo de cada seção segue o design system (ver DESIGN-SYSTEM.md §7)
- As seções S1–S7 são planetas independentes — cada uma deve funcionar em tela cheia (`min-h-screen`) com seu próprio esquema visual
- **Não usar** `Sidebar`, `Section`, `useActiveSection` — todos removidos

**Artefatos gerados:**
- `docs/superpowers/specs/2026-06-23-galaxy-layout-design.md` — design spec aprovado
- `docs/superpowers/plans/2026-06-23-galaxy-layout.md` — plano de implementação (8 tasks)
- `.superpowers/brainstorm/` — mockups do companion visual (não commitar)

**Próximo passo após conclusão:** Spec 2 — S1 Hero

---

### Atualização — Spec 3 — S2 Diagnóstico Sistêmico — 2026-06-25

**Status:** concluída ✅

**Artefatos gerados:**
- `src/types/index.ts` (modificado — campos `problema` e `decisaoProposta` adicionados a `Sistema`)
- `src/data/sistemas.ts` (modificado — 12 sistemas enriquecidos com os novos campos)
- `src/components/sections/S2Diagnostico/SistemaCard.tsx`
- `src/components/sections/S2Diagnostico/MapaSistemas.tsx`
- `src/components/sections/S2Diagnostico/index.tsx`
- `.agent/specs/spec-3-implement-done.md`

**Desvios do plano:**
- `MapaSistemas.tsx`: substituída a classe `opacity-30` por `animate={{ opacity: isDimmed ? 0.3 : 1 }}` na `motion.div` dos quadrantes, para contornar conflito entre Framer Motion inline style e Tailwind CSS. Resultado visual idêntico ao especificado.
- `src/data/planets.ts` e `src/App.tsx`: corrigida a ordem dos planetas para seguir a numeração das specs em sentido horário (S1→S2→…→S7). Editados fora do escopo do plan-done.md por instrução explícita do humano.

**Próxima spec:** Spec 4 — S3 Dores por Persona

---

### Atualização — Spec 2 — S1 Hero — 2026-06-25

**Status:** concluída ✅

**Artefatos gerados:**
- `src/components/sections/S1Hero/index.tsx`
- `src/vite-env.d.ts` (boilerplate Vite ausente desde Spec 1 — adicionado com autorização explícita)
- `.agent/specs/spec-2-implement-done.md`

**Desvios do plano:**
- `src/vite-env.d.ts` criado além dos arquivos permitidos — necessário para resolver imports de assets estáticos (.png, .svg); autorizado pelo humano durante a implementação.

**Próxima spec:** Spec 3 — S2 Diagnóstico Sistêmico

---

### Atualização — Spec 1 — Setup e Shell — 2026-06-23

**Status:** concluída ✅

**Artefatos gerados:**
- `package.json`, `vite.config.ts`, `tsconfig.json`, `postcss.config.js`, `index.html`
- `tailwind.config.ts`, `src/index.css`
- `src/types/index.ts`, `src/lib/utils.ts`
- `src/data/sistemas.ts`, `src/data/dores.ts`, `src/data/iniciativas.ts`, `src/data/provocacoes.ts`
- `src/hooks/useActiveSection.ts`, `src/hooks/usePresentation.ts`, `src/hooks/usePortalNav.ts`
- `src/components/layout/Section.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Header.tsx`
- `src/components/ui/Badge.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Tag.tsx`, `src/components/ui/Tooltip.tsx`, `src/components/ui/ProgressBar.tsx`
- `src/components/sections/S1Hero/index.tsx` … `S7Provocacoes/index.tsx`
- `src/App.tsx`, `src/main.tsx`, `src/assets/logo-gi-group.png`
- `.agent/specs/spec-1-implement-done.md`

**Desvios do plano:** nenhum

**Verificações:**
- `npx tsc --noEmit` → sem erros
- `npm run build` → dist/ gerado (171 KB JS, 12 KB CSS)
- `npm run dev` → servidor em http://localhost:5173/

**Próxima spec:** Spec 2 — S1 Hero

---

## 7. Instruções para Atualização

Este documento é atualizado **apenas pelo humano** ao final de cada spec implementada.

Formato de atualização:

```markdown
## Atualização — Spec [N] — [Nome] — [data]

**Status:** concluída ✅

**Artefatos gerados:**
- `src/components/sections/S[N]*/index.tsx`
- `src/data/[arquivo].ts`
- `.agent/specs/spec-[N]-implement-done.md`

**Desvios do plano:**
- [descrever ou "nenhum"]

**Próxima spec:** Spec [N+1] — [Nome]
```
