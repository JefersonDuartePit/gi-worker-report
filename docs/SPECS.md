# SPECS.md — GI Group · Portal do Worker

**Versão:** 1.0
**Total de specs:** 8

---

## Spec 1 — Setup e Shell

**Objetivo:** inicializar o projeto e implementar o layout base (shell, sidebar, header, scroll).

### Entregáveis

- Projeto Vite + React + TypeScript inicializado
- `tailwind.config.ts` com todos os tokens do design system GI Group
- `src/index.css` com diretivas Tailwind e import da fonte Lato
- `src/types/index.ts` com todas as interfaces do projeto
- `src/data/` com todos os arquivos de dados estáticos populados
- `src/components/layout/Sidebar.tsx` — navegação lateral fixa com identidade GI
- `src/components/layout/Header.tsx` — topbar com toggle modo apresentação/exploração
- `src/components/layout/Section.tsx` — wrapper de seção com scroll anchor
- `src/components/ui/Badge.tsx`, `Card.tsx`, `Button.tsx`, `Tag.tsx`
- `src/hooks/useActiveSection.ts` — IntersectionObserver para seção ativa
- `src/hooks/usePresentation.ts` — controle de modo apresentação/exploração
- `src/App.tsx` — root com layout principal, Context de apresentação e lista de seções
- `src/main.tsx` — entrypoint
- Seções placeholder (conteúdo vazio) para S1 a S7

### Critérios de aceite

- [ ] Sidebar fixa, fundo `gi-navy`, logo GI Group no topo
- [ ] Navegação entre seções via click na sidebar (scroll suave)
- [ ] Seção ativa destacada na sidebar em tempo real (IntersectionObserver)
- [ ] Toggle modo apresentação/exploração funcional na topbar
- [ ] No modo apresentação: apenas botões anterior/próximo visíveis
- [ ] No modo exploração: sidebar completa disponível
- [ ] Fonte Lato carregando corretamente via Google Fonts
- [ ] Tokens de cor aplicados via Tailwind (sem hex hard-coded)
- [ ] TypeScript sem erros em todos os arquivos

---

## Spec 2 — S1 Hero

**Objetivo:** implementar a seção de abertura do relatório.

### Conteúdo

- Logo GI Group + logo Perform IT (parceria)
- Título principal: "Centralização CARE & SMS — Jornada do Worker"
- Subtítulo: "Diagnóstico sistêmico e propostas de transformação digital"
- Data e versão do relatório
- 3 métricas de impacto do design sprint (ex: 5 dias de workshop, 11 iniciativas priorizadas, 3 macrojornadas mapeadas)
- CTA: "Iniciar a leitura" (scroll para S2)
- Fundo: `gi-navy`, texto branco

### Critérios de aceite

- [ ] Ocupa 100vh
- [ ] Fundo `gi-navy`, texto branco
- [ ] Animação de entrada (Framer Motion, fadeInUp)
- [ ] Métricas com contador animado ao entrar na viewport
- [ ] CTA funcional com scroll suave para S2
- [ ] Responsivo até 1024px

---

## Spec 3 — S2 Diagnóstico Sistêmico

**Objetivo:** apresentar o mapa dos sistemas atuais da GI Group nos 4 quadrantes.

### Conteúdo

**Quatro quadrantes interativos:**

| Quadrante     | Descrição                                              | Cor visual    |
| ------------- | ------------------------------------------------------ | ------------- |
| Usa           | Sistemas em uso, funcionando, sem mudança prevista     | `gi-blue`     |
| Integra       | Sistemas que serão conectados via API                  | `gi-steel`    |
| Substitui     | Sistemas candidatos a substituição ou descontinuação   | `gi-amber`    |
| Não toca      | Sistemas globais — intocáveis sem aprovação da matriz  | `gi-red`      |

**Sistemas mapeados:**
- IEM (Usa/Integra)
- GINFOR/Plataforma de Folha (Substitui — mudança prevista)
- Spinner/Fusion (Não toca)
- Portal do Candidato Global (Não toca)
- Blip/WhatsApp (Substitui — centralizar no portal)
- TomTicket (Substitui)
- GLPI (Substitui)
- VIP (Substitui)
- D4Sign/Assinatura eletrônica (Integra)
- SOC/Medicina do trabalho (Integra)
- Ponto Mais (Integra)
- OutSystems (Usa — plataforma de admissão em construção)

**Comportamento interativo:**
- Hover em cada sistema abre tooltip com: função atual, problema associado, decisão proposta
- Filtro por quadrante (clique no label do quadrante destaca só os sistemas daquela categoria)

### Critérios de aceite

- [ ] Quatro quadrantes visualmente distintos
- [ ] Todos os 12 sistemas mapeados com dados corretos
- [ ] Tooltip funcional ao hover com função + problema + decisão
- [ ] Filtro por quadrante funcional
- [ ] Animação de entrada por quadrante (stagger)
- [ ] Badge de restrição para sistemas "Não toca"

---

## Spec 4 — S3 Dores por Persona

**Objetivo:** apresentar as dores identificadas no sprint organizadas por persona.

### Conteúdo

**Filtros de persona:**
- Todos
- Worker
- Colaborador GI
- Cliente

**Dores mapeadas (mínimo 9):**

| ID  | Dor                                               | Persona          | Jornada       | Severidade |
| --- | ------------------------------------------------- | ---------------- | ------------- | ---------- |
| D01 | Sem visibilidade do status admissional            | Worker           | Admissão      | Crítica    |
| D02 | Contrato para assinar sem tempo hábil             | Worker           | Admissão      | Alta       |
| D03 | Redigitação de dados entre IEM e GINFOR           | Colaborador GI   | Admissão      | Crítica    |
| D04 | WhatsApp pessoal bloqueado por volume             | Colaborador GI   | Admissão      | Crítica    |
| D05 | Sem canal único de comunicação com o worker       | Worker + Col. GI | Ciclo Ativo   | Crítica    |
| D06 | Sem acompanhamento de onboarding 30/60/90 dias    | Worker + Cliente | Ciclo Ativo   | Alta       |
| D07 | Não sabe quem é seu contato GI durante o contrato | Worker          | Ciclo Ativo   | Alta       |
| D08 | Controle de afastamentos via planilha manual      | Colaborador GI   | Ciclo Ativo   | Alta       |
| D09 | 10 dias sem informação no desligamento            | Worker           | Offboarding   | Crítica    |
| D10 | Baixa de documentos D4Sign feita uma a uma        | Colaborador GI   | Offboarding   | Alta       |
| D11 | Sem canal de comunicação pós-desligamento         | Worker           | Offboarding   | Alta       |

**Comportamento interativo:**
- Cards clicáveis — ao clicar, expande para mostrar qual iniciativa resolve a dor
- Filtro por persona atualiza os cards em tempo real
- Contador de dores por persona no filtro

### Critérios de aceite

- [ ] Todas as 11 dores mapeadas com dados corretos
- [ ] Filtro por persona funcional
- [ ] Card expandível mostra iniciativa que resolve a dor
- [ ] Badges de severidade visualmente distintos
- [ ] Badges de jornada no card
- [ ] Animação de entrada dos cards (stagger)

---

## Spec 5 — S4 Arquitetura As-is / To-be

**Objetivo:** apresentar um diagrama visual comparativo da arquitetura atual (fragmentada) versus a proposta (centralizada).

### Conteúdo

**Toggle As-is / To-be**

**As-is (estado atual):**
- Worker no centro
- 6+ canais de comunicação desconexos (VIP, TomTicket, GLPI, Blip, WhatsApp pessoal, e-mail)
- Sem integração entre sistemas
- Colaborador GI como intermediário manual de tudo

**To-be (proposta):**
- Portal do Worker como canal único
- Integrações via camada de API genérica (plataforma de folha, workforce management, ATS)
- Automações para admissão, afastamentos e desligamento
- Cliente com visibilidade direta via dashboard

**Duas sub-seções:**
- Diagrama visual (SVG ou componente React)
- Tabela comparativa: o que muda em cada etapa

### Critérios de aceite

- [ ] Toggle As-is/To-be funcional com animação de transição
- [ ] Diagrama As-is mostra fragmentação (muitas setas, sistemas isolados)
- [ ] Diagrama To-be mostra centralização (portal como hub)
- [ ] Tabela comparativa clara e legível
- [ ] Identidade visual GI aplicada nos diagramas

---

## Spec 6 — S5 Iniciativas

**Objetivo:** apresentar as 17 iniciativas do workshop de forma navegável e interativa.

### Conteúdo

**Filtros:**
- Por jornada: Admissão / Ciclo Ativo / Offboarding
- Por persona: Worker / Colaborador GI / Cliente

**Card de iniciativa (campos):**
- ID numérico (01–17) conforme numeração original do workshop
- Título completo fiel ao documento do workshop
- Descrição curta da proposta técnica
- Badges de jornada e persona beneficiada
- Indicadores visuais de impacto e esforço (barras)
- Sistema que substitui ou resolve
- Link para tela do portal relacionada (quando aplicável)

**Iniciativas por jornada:**

*Admissão (01–06):*
- 01 — Portal digital de admissão com rastreio em tempo real
- 02 — Automação do envio e reenvio de link de documentação
- 03 — Integração IM → GInfor sem redigitação (triple data entry)
- 04 — Dashboard em tempo real de admissões para a Operação
- 05 — Digitalização e assinatura eletrônica padronizada de contrato (Sign Único)
- 06 — Automação de comunicado de admissões concluídas à Operação

*Ciclo Ativo (07–12):*
- 07 — Central de atendimento unificada CARE + SMS com SLA único
- 08 — Automação de alertas de vencimento de contratos, férias e ASOs
- 09 — Gestão de ponto integrada (parametrização + tratamento + alertas)
- 10 — Portal do Worker (autoatendimento: holerite, benefícios, férias)
- 11 — Governança embutida: bloqueio de ações fora de SLA trabalhista
- 12 — Gestão de afastamentos com acionamento automatizado

*Offboarding (13–17):*
- 13 — Fluxo digital de desligamento com acionamento automático CARE pelo SMS
- 14 — Assinatura eletrônica padronizada de TRCT e rescisão
- 15 — GED para arquivamento pós-rescisão
- 16 — Automação de agendamento e controle de exame demissional
- 17 — Portal do ex-colaborador para autoatendimento pós-desligamento

**Comportamento:**
- Clique no card expande detalhes completos da iniciativa
- Iniciativas 01, 05, 07, 10, 13 e 17 têm tela relacionada no portal — botão "Ver tela" abre o portal na tela correspondente
- Matriz de priorização impacto × esforço opcional como visão complementar

### Critérios de aceite

- [ ] 17 iniciativas mapeadas com títulos fiéis ao documento do workshop
- [ ] Filtros por jornada e persona funcionais
- [ ] Card expandível com descrição técnica completa
- [ ] Botão "Ver tela" funcional para iniciativas com tela no portal
- [ ] Badges de impacto e esforço visualmente distintos
- [ ] IDs numéricos (01–17) visíveis em cada card

---

## Spec 7 — S6 Portal do Worker

**Objetivo:** apresentar as telas do portal do worker em alta fidelidade, navegáveis, com tooltips de dor.

### Estrutura do portal mockado

**Shell do portal:**
- Sidebar esquerda (`gi-navy`): logo GI Worker, itens de navegação
- Topbar: nome do worker (Ana Silva · Operadora · Shopee SP), avatar
- Área de conteúdo: troca conforme navegação

**Telas implementadas:**

**1. Início (Home)**
- Status da admissão com barra de progresso
- Etapas (concluídas, pendentes, aguardando)
- Métricas resumidas (solicitações abertas, treinamentos concluídos)
- Atalhos rápidos

*Dor resolvida: D01 — sem visibilidade do status admissional*

**2. Documentos**
- Lista de documentos disponíveis (contrato, holerites, ASO, informe IR)
- Status de cada documento (assinado, disponível, pendente)
- Botão de download

*Dor resolvida: D11 — sem canal de acesso a documentos pós-contrato*

**3. Solicitações**
- Lista de solicitações abertas com status e número de ticket
- Botão "Nova solicitação" com modal de abertura
- Tipos: atualização cadastral, envio de atestado, dúvida sobre benefícios, outros

*Dor resolvida: D05 — sem canal único de comunicação*

**4. Treinamentos**
- Trilha de onboarding com progresso
- Lista de módulos: concluídos, em andamento, bloqueados, aguardando data
- Acompanhamento 30/60/90 dias

*Dor resolvida: D06 — sem acompanhamento de onboarding*

**5. Rescisão (Offboarding)**
- Status da rescisão: "dia X de 10"
- Timeline com etapas do processo de desligamento
- Previsão de disponibilização dos documentos
- Botão de contato com o time GI

*Dor resolvida: D09 — 10 dias sem informação no desligamento*

**Tooltips de dor:**
- Cada elemento relevante tem um tooltip (hover) que mostra:
  - Qual dor aquele elemento resolve (ex: "Resolve D01 — sem visibilidade do status")
  - Qual iniciativa corresponde (ex: "Iniciativa I01")

### Critérios de aceite

- [ ] Shell do portal com sidebar e topbar fiéis ao design do esboço
- [ ] 5 telas implementadas com dados ilustrativos realistas
- [ ] Navegação entre telas funcional via sidebar do portal
- [ ] Tooltips de dor funcionais ao hover nos elementos-chave
- [ ] Modal de nova solicitação funcional
- [ ] Alta fidelidade visual — parece um produto real
- [ ] Dados ilustrativos claramente marcados (marca d'água sutil ou aviso "dados ilustrativos")

---

## Spec 8 — S7 Provocações e Próximos Passos

**Objetivo:** apresentar as perguntas em aberto e o plano de ação recomendado.

### Conteúdo

**Bloco 1 — Provocações técnicas (5–7 perguntas)**

Exemplos:
- "O novo ERP substitui o GINFOR integralmente ou é complementar? Isso define o que faz sentido construir agora."
- "A integração IEM → GINFOR hoje — quem é o dono técnico? É possível estender sem aprovação global?"
- "O squad de desenvolvimento da TI tem capacidade para o portal do worker em paralelo com a admissão em OutSystems?"
- "Quais BUs precisam alinhar antes de centralizar o controle do worker como holding?"

**Bloco 2 — Plano faseado recomendado**

```
Fase 1 (H2 2026) — Centralização imediata
├── 01 — Portal digital de admissão com rastreio em tempo real
├── 02 — Automação de envio e reenvio de link de documentação
├── 07 — Central de atendimento unificada CARE + SMS com SLA único
├── 10 — Portal do Worker (autoatendimento: holerite, benefícios, férias)
├── 13 — Fluxo digital de desligamento com acionamento automático
└── 17 — Portal do ex-colaborador para autoatendimento pós-desligamento

Fase 2 (H1 2027) — Integração e automação
├── 03 — Integração IM → GInfor sem redigitação (triple data entry)
├── 05 — Assinatura eletrônica padronizada de contrato (Sign Único)
├── 06 — Automação de comunicado de admissões concluídas à Operação
├── 08 — Alertas automáticos de vencimento de contratos, férias e ASOs
├── 12 — Gestão de afastamentos com acionamento automatizado
└── 14 — Assinatura eletrônica padronizada de TRCT e rescisão

Fase 3 (H2 2027) — Governança e controle
├── 04 — Dashboard em tempo real de admissões para a Operação
├── 09 — Gestão de ponto integrada (parametrização + tratamento + alertas)
├── 11 — Governança embutida: bloqueio de ações fora de SLA trabalhista
├── 15 — GED para arquivamento automatizado pós-rescisão
└── 16 — Automação de agendamento e controle de exame demissional
```

**Bloco 3 — Próximos passos imediatos**

1. Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis
2. Acesso à pasta gravada do processo de admissão (prometida pela Carol)
3. Alinhamento de holding com BUs sobre controle centralizado do worker
4. Definição do escopo do portal do worker dentro do IT Master Plan H2 2026

**Bloco 4 — CTA final**

Fundo `gi-navy`, texto branco. Mensagem de encerramento da Perform IT e convite para próxima etapa.

### Critérios de aceite

- [ ] Fundo `gi-navy`, identidade visual de encerramento
- [ ] 5–7 provocações com destinatário (Carol, Jansen ou ambos) e contexto
- [ ] Plano faseado visual com as 3 fases e iniciativas de cada uma
- [ ] Próximos passos em formato de checklist visual
- [ ] CTA de encerramento com identidade Perform IT + GI Group
