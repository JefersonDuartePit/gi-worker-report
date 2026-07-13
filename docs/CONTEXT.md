# CONTEXT.md — GI Group · Portal do Worker

**Versão:** 1.1
**Atualizado em:** 13 de julho de 2026
**Projeto:** Relatório Interativo — Centralização CARE & SMS / Jornada do Worker

---

## 1. Quem é a GI Group

A **GI Group Holding** é uma multinacional italiana de soluções de RH presente em mais de 30 países. No Brasil, opera sob a marca **GI Group** e atua principalmente com alocação de trabalhadores temporários (chamados internamente de **workers**) em grandes clientes como Shopee, Amazon, e outros.

A estrutura operacional brasileira é dividida em duas grandes áreas que hoje executam atividades duplicadas:

- **CARE** — área central responsável pela gestão administrativa do worker (admissão, documentação, folha, desligamento).
- **SMS** — área de operações responsável pelo acompanhamento do worker no cliente (presença, suporte no dia a dia, relacionamento).

O projeto em andamento, conduzido pela **Perform IT**, visa eliminar essas duplicidades e centralizar a jornada em um modelo operacional único.

---

## 2. O Problema Central

A GI Group opera com alta fragmentação sistêmica e de comunicação ao longo da jornada do worker. Os principais sintomas:

### 2.1 Fragmentação de sistemas

| Sistema      | Função atual                             | Problema                                              |
| ------------ | ---------------------------------------- | ----------------------------------------------------- |
| IM          | ATS / admissão digital                   | Integração unidirecional com GINFOR, sem retorno      |
| GINFOR       | ERP de folha e cadastro de colaboradores | Sem API robusta, sem escalabilidade, migração prevista|
| Spinner      | ATS global (candidatos) — RP global       | Controlado pelo Global — intocável sem aprovação      |
| Fusion       | GED jurídico                             | Duplicidade manual com o IM (upload duplo) — não é intocável |
| Blip/WhatsApp| Comunicação com workers                  | Canais pessoais bloqueados por volume (>100 msg/dia)  |
| TomTicket    | Helpdesk de solicitações                 | Usado para tudo, inclusive processos que deveriam ser workflow |
| GLPI         | Helpdesk de TI                           | Separado do TomTicket, mesmo problema de fragmentação |
| VIP          | Canal de comunicação alternativo         | Mais um canal sem integração                          |
| D4Sign + DocSign | Assinatura eletrônica                | Duas ferramentas paralelas para o mesmo fim, sem envio em lote |
| SOC          | Medicina do trabalho / ASO               | Completamente isolado, sem integração                 |
| Ponto Mais   | Controle de ponto                        | Integração com GINFOR incompleta                      |
| Zeev         | Workflow do SST para agendamento de exames | Consolidação manual entre IM, Zeev, e-mail e Teams — sem visão única |

> Zeev e DocSign identificados no "Toolkit de Mapeamento do Processo de Admissão" (documento interno da GI, junho 2026), fora do mapeamento original do Workshop CARE & SMS Dia 5. D4Sign e DocSign foram unificados numa única linha após confirmação do Dimitri (service designer) na call de Alinhamento Pré-Apresentação de 13/07/2026, por terem função análoga.

### 2.2 Restrições sistêmicas definidas pela Carol (TI)

Sistemas **intocáveis** sem aprovação do Global:
- Portal do candidato global
- CRM comercial global
- RP global (Spinner)

> Fonte: transcrição da reunião de Alinhamento TI (16/06/2026). Carol cita nominalmente apenas "portal do candidato global, CRM comercial global e RP global" como os três sistemas intocáveis — Fusion não foi mencionado nessa lista e foi removido do agrupamento com o Spinner.

Sistemas com **previsão de substituição**:
- GINFOR — plataforma de folha será substituída no próximo ano
- Admissão no IM será migrada para workflow em **OutSystems**

Restrição de **IA**: uso de inteligência artificial requer aprovação de segurança da informação e alinhamento com a matriz italiana.

**Direção estratégica confirmada pela Carol:**
- Redução sistêmica — eliminar canais e ferramentas dispersos
- Visão de holding — solução não pode ser desenhada para uma única BU
- Autonomia local — Brasil precisa de mais controle sobre seus dados sem depender do Global para cada operação

---

## 3. Personas

### Worker
Trabalhador temporário alocado em clientes da GI Group. Perfil majoritariamente de baixa familiaridade digital. Acessa informações via WhatsApp. Sofre com falta de visibilidade do próprio processo admissional e com a ausência de canal único para dúvidas durante o contrato.

**Dores principais:**
- Não sabe em que etapa da admissão está
- Recebe contrato para assinar sem tempo hábil para leitura
- Fica 10 dias sem informação no processo de desligamento
- Não sabe quem é seu contato na GI durante o contrato ativo
- Acessa holerites e documentos por canais diferentes e desconexos
- Não tem acesso a um registro centralizado dos próprios feedbacks e advertências formais (dor D12 — pedida pela Carol na reunião de Alinhamento TI de 16/06/2026: "registrar feedbacks, acompanhamentos e eventuais advertências formais dentro da jornada do worker"; formalizada como D12 durante a Spec 7)

### Colaborador GI (CARE/SMS)
Analista interno responsável por operar os processos de admissão, acompanhamento e desligamento do worker. Altamente sobrecarregado por retrabalho manual, redigitação de dados entre sistemas e comunicação por WhatsApp pessoal.

**Dores principais:**
- Redigita dados do Spinner/IM no GINFOR manualmente
- Dispara links de documentação por WhatsApp pessoal (bloqueado por volume)
- Controla desligamentos e limitadores de benefício por planilha
- Não tem visibilidade unificada do status de cada worker
- Atende dúvidas repetitivas que poderiam ser autoatendimento

### Cliente (ex: Shopee, Amazon)
Empresa contratante de workers temporários. Precisa de visibilidade sobre o status de admissão, presença e produtividade do worker sem depender de ligações ou e-mails manuais para o CARE.

**Dores principais:**
- Não tem visibilidade do status admissional dos workers contratados
- Depende do CARE para obter informações que deveriam ser automáticas
- Processos de integração com o sistema do cliente (ex: ZIV da Shopee) travados por aprovação global

---

## 4. Jornada Mapeada — Três Macroetapas

### 4.1 Admissão
Do candidato aprovado à primeira jornada de trabalho. Inclui envio de documentação, ASO admissional, assinatura de contrato e integração ao cliente.

**Status:** processo avançado internamente — solução tecnológica definida (migração para OutSystems). A Perform IT usa como referência de contexto, sem retrabalho.

### 4.2 Ciclo Ativo
Do primeiro dia de trabalho ao encerramento do contrato. Inclui comunicação contínua, suporte a dúvidas, treinamentos, acompanhamento 30/60/90 dias, gestão de afastamentos e alterações cadastrais.

**Status:** sem iniciativa técnica em andamento. Maior lacuna sistêmica identificada. Prioridade de detalhamento pela Perform IT.

### 4.3 Offboarding / Desligamento
Do aviso de desligamento à disponibilização dos documentos rescisórios. Inclui cálculo de TRCT, ASO demissional, baixa de benefícios e canal de pós-desligamento.

**Status:** processo atual 100% manual via planilha e TomTicket. Perform IT tem liberdade total para propor.

---

## 5. As 17 Iniciativas do Workshop (CARE & SMS — Dia 5)

Fonte: documento de tratamento do Workshop CARE & SMS, Dia 5 (18/06/2026).
Organizadas por jornada. IDs numéricos conforme numeração original do workshop.

> Nota: a dor **D12** (sem registro centralizado de feedback e desenvolvimento do worker) foi pedida pela Carol na reunião de Alinhamento TI (16/06/2026) como um dos pontos funcionais do portal ("gestão de desenvolvimento: registrar feedbacks, acompanhamentos e eventuais advertências formais"), mas só foi formalizada como dor D12 durante a Spec 7 (S6 Portal do Worker). É resolvida pela Iniciativa I10 (Portal do Worker). Não faz parte das 17 iniciativas votadas no workshop — é um refinamento de escopo da mesma iniciativa, com origem anterior ao workshop. Ver `PROJECT-STATE.md` §6 (changelog Spec 7) e `SPECS.md` (Spec 4 e Spec 7).

### Admissão

| ID  | Iniciativa                                                                 | Beneficia              | Substitui / Resolve                              |
| --- | -------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------ |
| 01  | Portal digital de admissão com rastreio em tempo real de status do candidato | Worker + Colaborador GI | Controle manual de status — reduz abandono do funil |
| 02  | Automação do envio e reenvio de link de documentação ao candidato          | Worker + Colaborador GI | "Caça" manual por analistas — WhatsApp pessoal bloqueado |
| 03  | Integração IM → GInfor: migração automática sem redigitação (triple data entry) | Colaborador GI     | Redigitação entre sistemas — camada iPaaS        |
| 04  | Dashboard em tempo real de admissões em andamento para a Operação (SMS)   | Colaborador GI + Cliente| Trocas de e-mail manuais para status de candidatos |
| 05  | Digitalização e assinatura eletrônica padronizada de contrato (Sign Único) | Worker + Colaborador GI | Kit Admissional fragmentado — envio e acompanhamento em lote |
| 06  | Automação de relatório/comunicado de admissões concluídas à Operação       | Colaborador GI         | Latência de planilhas entre CARE e Operação      |

### Ciclo Ativo (Manutenção)

| ID  | Iniciativa                                                                 | Beneficia              | Substitui / Resolve                              |
| --- | -------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------ |
| 07  | Central de atendimento unificada (CARE + SMS) com histórico consolidado e SLA único | Worker + Colaborador GI + Cliente | WhatsApp pessoal + TomTicket + Blip fragmentados |
| 08  | Automação de alertas de vencimento de contratos, férias e renovação de ASOs | Colaborador GI        | Controle analógico em planilhas paralelas        |
| 09  | Digitalização e gestão de ponto integrada (parametrização + tratamento + alertas) | Colaborador GI   | Planilhas Excel com PROC-V manuais para fechamento |
| 10  | Portal do Worker (autoatendimento: dúvidas, holerite, benefícios, férias)  | Worker + Colaborador GI | Volume de chamados repetitivos — acesso permanente pós-desligamento |
| 11  | Governança embutida no sistema: bloqueio de ações fora de SLA ou regra trabalhista | Colaborador GI  | Dependência da memória do analista para compliance |
| 12  | Processo estruturado de gestão de afastamentos com acionamento automatizado | Worker + Colaborador GI | Fluxo manual entre SST, Jurídico e Folha         |

### Desligamento (Offboarding)

| ID  | Iniciativa                                                                 | Beneficia              | Substitui / Resolve                              |
| --- | -------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------ |
| 13  | Fluxo digital de desligamento com acionamento automático do CARE pelo SMS  | Colaborador GI         | Quarteirização manual: SMS → planilha → TomTicket → CARE → CSC |
| 14  | Assinatura eletrônica padronizada de TRCT e documentos de rescisão         | Worker + Colaborador GI | D4Sign + DocSign fragmentados — sem envio em massa padronizado |
| 15  | GED (gestão eletrônica de documentos) para arquivamento pós-rescisão       | Colaborador GI         | "Arqueologia" em e-mails, pastas locais e WhatsApp |
| 16  | Automação de agendamento e controle de exame demissional                   | Worker + Colaborador GI | Agendamento ASO demissional um a um via WhatsApp bloqueado |
| 17  | Portal do ex-colaborador para autoatendimento pós-desligamento             | Worker                 | WhatsApp pessoal de analistas para TRCT, FGTS, seguro-desemprego |

---

## 6. Decisões Técnicas Confirmadas

### O que pode ser construído
- Portal do worker (front-end + backend) — visão de holding
- Camada de integração agnóstica de plataforma (referências genéricas: "plataforma de folha", "workforce management", "ATS")
- Fluxos de comunicação centralizados substituindo Blip/WhatsApp/TomTicket/GLPI
- Automações de offboarding e afastamento

### O que não pode ser tocado sem aprovação Global
- Portal do candidato global
- CRM comercial global
- RP global (Spinner)

### O que tem previsão de mudança (não amarrar arquitetura)
- GINFOR — será substituído (plataforma de folha nova prevista para 2027)
- Admissão no IM — migrando para OutSystems
- Integração com Global — solução intermediária em construção

### Restrições adicionais
- IA requer aprovação de segurança da informação
- Solução deve ser desenhada como holding, não por BU
- Squad de desenvolvimento da Carol (TI GI Group) é o braço executivo de implantação

---

## 7. Entregáveis da Perform IT

Conforme acordado com Jansen e Carol na reunião de 16/06/2026:

1. **Fluxo to-be realista** — processo centralizado viável no curto prazo (H2 2026), sem d