# PROJECT-STATE.md — GI Group · Portal do Worker

**Atualizado em:** 18 de junho de 2026
**Status do projeto:** Documentação inicial — pronto para iniciar Spec 1
**Specs concluídas:** nenhuma
**Spec em andamento:** nenhuma
**Próxima spec:** Spec 1 — Setup e Shell

---

## 1. Histórico do Projeto

### Origem

O projeto nasceu de um design sprint de 5 dias conduzido pela **Perform IT** com os times de CARE e SMS da **GI Group Holding Brasil**, entre maio e junho de 2026. O sprint mapeou a jornada completa do worker temporário — admissão, ciclo ativo e offboarding — identificando dores, oportunidades e iniciativas priorizadas.

### Reuniões-chave

**Workshop CARE/SMS (5 dias — maio/junho 2026)**
- Mapeamento de jornada ponta a ponta com times de CARE e SMS
- Identificação de 24 iniciativas de melhoria
- Priorização por impacto no negócio, experiência do worker e esforço de implantação
- Votação resultou em 11 iniciativas prioritárias para o relatório

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
- As 11 iniciativas priorizadas
- Telas navegáveis do portal do worker (alta fidelidade)
- Provocações técnicas e próximos passos

O relatório será apresentado primeiro ao service designer interno da Perform IT para validação, depois ao Jansen e Carol da GI Group.

---

## 2. Estado Atual das Specs

| Spec | Nome                          | Status      | Artefatos                              |
| ---- | ----------------------------- | ----------- | -------------------------------------- |
| 1    | Setup e Shell                 | ⬜ Pendente  | —                                      |
| 2    | S1 — Hero                     | ⬜ Pendente  | —                                      |
| 3    | S2 — Diagnóstico Sistêmico    | ⬜ Pendente  | —                                      |
| 4    | S3 — Dores por Persona        | ⬜ Pendente  | —                                      |
| 5    | S4 — Arquitetura As-is/To-be  | ⬜ Pendente  | —                                      |
| 6    | S5 — Iniciativas              | ⬜ Pendente  | —                                      |
| 7    | S6 — Portal do Worker         | ⬜ Pendente  | —                                      |
| 8    | S7 — Provocações e Próximos Passos | ⬜ Pendente | —                                 |

---

## 3. Estrutura Atual do Projeto

O projeto ainda não foi inicializado. A estrutura esperada após a Spec 1 é:

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

## 6. Instruções para Atualização

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
