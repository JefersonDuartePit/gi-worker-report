# Spec — Portal de Admissão com Rastreio em Tempo Real

> **Escopo:** camada de visibilidade e comunicação sobre o processo admissional existente.  
> **Premissa-chave:** nenhuma escrita em sistema global (GINFOR, GED/Fusion, ZIV). Toda integração é leitura ou disparo via sistemas já locais (IEM, SOC, Blip).

---

## 1. Contexto e problema

O processo admissional atual envolve IEM (envio de link e upload de docs), SOC (agendamento de exame), D4Sign (assinatura de contrato) e GINFOR (geração da matrícula). Cada sistema opera em silo:

- O candidato não sabe em que etapa está após enviar os documentos.
- O analista atualiza o PDC manualmente em planilha até 4× ao dia.
- O cliente (operação) recebe cronograma estático por e-mail.
- Reenvios de link e cobranças de documentação são feitos manualmente via WhatsApp pessoal.

**Meta do protótipo:** construir uma camada que lê os eventos desses sistemas e os expõe como status unificado para candidato, analista e operação — sem aprovação global, sem escrever nos sistemas core.

---

## 2. Atores

| Ator | Canal principal | O que precisa |
|---|---|---|
| **Candidato** | Blip (WhatsApp) | Saber em que etapa está; receber cobranças e confirmações |
| **Analista CARE** | Web (painel interno) | Ver status de todos os candidatos em tempo real; agir em pendências |
| **Operação / cliente** | Web (painel externo ou link compartilhado) | Ver cronograma vivo de admissões do lote |

---

## 3. Fluxo principal

```
[1] Link enviado ao candidato via IEM
        ↓
[2] Candidato faz upload de documentos no IEM
        ↓
[3] Sistema valida documentos automaticamente
    → OK: avança para etapa 4
    → Pendência: notifica candidato via Blip com item específico pendente
        ↓
[4] Analista recebe alerta de documentação completa
    → Agenda exame no SOC
        ↓
[5] Candidato recebe confirmação de agendamento via Blip (data, local, guia)
        ↓
[6] SOC retorna resultado do ASO
    → Apto: dispara assinatura de contrato via D4Sign
    → Inapto / pendência: alerta ao analista com motivo
        ↓
[7] Candidato assina contrato via D4Sign
        ↓
[8] GINFOR gera matrícula
        ↓
[9] Operação recebe aviso de admissão concluída
    → Status do candidato no painel muda para "Admitido"
```

---

## 4. Requisitos funcionais

### 4.1 Motor de status (backend)

- **RF-01** Receber webhook ou consultar por polling o IEM para detectar: link enviado, upload iniciado, upload completo, documento rejeitado.
- **RF-02** Validar documentos automaticamente ao upload:
  - Comprovante de residência: data de emissão ≤ 90 dias.
  - CNH: data de validade ≥ hoje.
  - Qualidade de imagem: resolução mínima e legibilidade (OCR básico para verificar se o documento não está em branco / cortado).
  - Tipo de arquivo: aceitar PDF e imagem (JPEG, PNG).
- **RF-03** Mapear o estado de cada candidato em uma máquina de estados com as etapas abaixo.
- **RF-04** Persistir log de transição de estado com timestamp e origem (sistema que gerou o evento).
- **RF-05** Expor API REST de leitura para o painel do analista e o painel da operação.
- **RF-06** Receber retorno de status do SOC (exame agendado, realizado, ASO emitido).
- **RF-07** Receber evento de assinatura completa do D4Sign via webhook.
- **RF-08** Receber evento de matrícula gerada no GINFOR (polling ou webhook, conforme disponibilidade).

### 4.2 Máquina de estados do candidato

```
LINK_ENVIADO
  → UPLOAD_INICIADO         (primeiro arquivo enviado no IEM)
  → DOCS_PENDENTES          (validação falhou em ≥1 documento)
  → DOCS_COMPLETOS          (todos os documentos válidos recebidos)
  → EXAME_AGENDADO          (analista registrou agendamento no SOC)
  → EXAME_REALIZADO         (SOC retornou presença)
  → ASO_EMITIDO             (SOC emitiu ASO apto)
  → CONTRATO_ENVIADO        (D4Sign enviou para assinatura)
  → CONTRATO_ASSINADO       (D4Sign confirmou assinatura)
  → MATRICULA_GERADA        (GINFOR gerou matrícula)
  → ADMITIDO                (estado terminal — concluído)
  → BLOQUEADO               (inapto no ASO, documento inválido sem correção, ou no-show)
  → ABANDONADO              (sem atividade por N dias configurável)
```

### 4.3 Comunicação com o candidato (Blip)

- **RF-09** Enviar mensagem via Blip em cada transição de estado relevante (ver tabela de notificações abaixo).
- **RF-10** Reenviar lembrete de documentação pendente automaticamente após 24h sem resposta (máximo 3 tentativas).
- **RF-11** Identificar o documento específico pendente na mensagem — nunca pedir reenvio geral do link.
- **RF-12** Incluir guia do SOC como arquivo PDF na mensagem de confirmação de agendamento de exame.
- **RF-13** Suportar idioma espanhol para candidatos estrangeiros (flag por candidato, configurável no IEM ou na plataforma).
- **RF-14** Registrar leitura de mensagem (read receipt) e tentativas de entrega no log de estado.
- **RF-15** Permitir que o candidato responda "AJUDA" para ser encaminhado a atendimento humano (analista recebe alerta no painel).

#### Tabela de notificações automáticas

| Gatilho | Mensagem ao candidato |
|---|---|
| Link enviado | Boas-vindas + instruções de envio + prazo |
| Documento rejeitado | Nome do documento específico + motivo + link para reenvio |
| 24h sem upload após link enviado | Lembrete com link |
| Docs completos | Confirmação de recebimento + próximo passo (aguardar agendamento de exame) |
| Exame agendado | Data, horário, endereço da clínica, guia em PDF, o que levar |
| ASO emitido (apto) | Aviso de contrato chegando para assinatura |
| Contrato enviado | Link D4Sign + prazo de assinatura |
| Contrato assinado | Confirmação + data estimada de início |
| Matrícula gerada / Admitido | Parabéns + primeiras informações (horário, local, contato do gestor) |

### 4.4 Painel do analista (web)

- **RF-16** Listar todos os candidatos do analista com estado atual, nome do cliente, data do link enviado e tempo na etapa atual.
- **RF-17** Filtrar por: estado, cliente, analista responsável, data de link enviado, urgência (candidatos em DOCS_PENDENTES há mais de Xh).
- **RF-18** Ver linha do tempo do candidato: cada transição de estado com timestamp e sistema de origem.
- **RF-19** Ação manual disponível: registrar agendamento de exame no SOC (data, clínica, número de guia) diretamente no painel — dispara notificação ao candidato e atualiza estado para EXAME_AGENDADO.
- **RF-20** Ação manual disponível: marcar candidato como BLOQUEADO ou ABANDONADO com motivo.
- **RF-21** Alerta visual para candidatos parados há mais de 48h na mesma etapa.
- **RF-22** Indicador de tipo de admissão por candidato: simples / com portal de cliente / com treinamento do cliente.
- **RF-23** Campo de observações livres por candidato (visível apenas para analistas).
- **RF-24** Exportar lista filtrada em CSV para comunicação com cliente.

### 4.5 Painel da operação / cliente (web)

- **RF-25** Visão agregada por lote/cliente: quantos candidatos em cada etapa.
- **RF-26** Drill-down por candidato (nome, etapa atual, data prevista de conclusão).
- **RF-27** Indicador de SLA: verde (dentro do prazo), amarelo (risco), vermelho (atrasado).
- **RF-28** Acesso por link compartilhável com token (sem necessidade de conta para o cliente).
- **RF-29** Exportar relatório de lote em PDF.

---

## 5. Integrações necessárias

| Sistema | Tipo de integração | O que é lido / recebido | Requer aprovação global? |
|---|---|---|---|
| **IEM** | Webhook ou polling | Eventos de upload, status de documentos | Não |
| **SOC** | Polling de API ou input manual no painel | Status de agendamento, presença, ASO | Não |
| **D4Sign** | Webhook (já disponível) | Evento de assinatura completa | Não |
| **GINFOR** | Polling de API ou webhook | Evento de matrícula gerada | Não (leitura) |
| **Blip** | API de envio de mensagens | Envio e recebimento de mensagens | Não — em implantação local |

> **Fallback para SOC e GINFOR:** se o webhook/API não estiver disponível na fase inicial, o analista registra manualmente a transição no painel (ação manual). O sistema notifica o candidato e avança o estado igualmente.

---

## 6. Requisitos não-funcionais

| # | Requisito | Critério de aceite |
|---|---|---|
| NF-01 | Latência de notificação | Mensagem ao candidato enviada em até 60s após evento detectado |
| NF-02 | Disponibilidade | 99,5% em horário comercial (07h–22h) |
| NF-03 | Auditoria | Toda transição de estado rastreada com: timestamp, sistema de origem, usuário (se ação manual) |
| NF-04 | Segurança | Dados de candidatos em trânsito com TLS 1.2+; acesso ao painel com autenticação (SSO GI Group ou usuário/senha) |
| NF-05 | LGPD | Dados de candidatos retidos conforme política da GI Group; consentimento de comunicação via Blip explícito no link de admissão |
| NF-06 | Volume | Suportar 100 admissões/dia (Shopee 50 + SMS 50) com pico de 2× sem degradação |
| NF-07 | Mobile-first (candidato) | Interface Blip deve funcionar integralmente em mobile; painel do analista responsivo |

---

## 7. Fora do escopo (v1)

- Escrita em GINFOR (alterações cadastrais, geração de matrícula).
- Envio automático de kits admissionais via D4Sign (parametrização de contratos).
- Integração com ZIV (Shopee) ou Spinner (outras marcas) — dependem de aprovação global.
- Portal self-service do worker (pós-admissão) — escopo futuro.
- Controle de EPI, uniformes e crachás.
- Gestão de afastamentos e folha.
- Admissões CLT com fluxo de rescisão (outro escopo).

---

## 8. Premissas e dependências

- IEM expõe eventos de upload via webhook ou API consultável — **validar com TI antes do desenvolvimento**.
- Blip já está sendo configurado localmente; a conta deve ter permissão de envio ativo (não apenas bot receptivo).
- D4Sign já tem webhook configurado no ambiente da GI Group — confirmar se está ativo para temporários.
- A plataforma não substitui o IEM nem o SOC — é uma camada sobre eles; candidatos continuam acessando o IEM para upload.
- SOC pode exigir input manual pelo analista na v1 caso a API não esteja disponível.

---

## 9. Critérios de sucesso do protótipo

| Métrica | Linha atual (estimada) | Meta v1 |
|---|---|---|
| Tempo médio de atualização do PDC | Manual, 4× ao dia | Tempo real (< 1 min de atraso) |
| % de candidatos notificados automaticamente sobre pendência | ~0% (manual via WhatsApp) | > 80% |
| Tempo médio de detecção de documentação pendente pelo analista | Horas (próxima atualização do PDC) | < 30 minutos |
| % de lotes onde cliente recebe status atualizado | Dependente de e-mail manual | 100% via painel |
| Retrabalho de cobrança manual de documentação | Alto (WhatsApp pessoal) | Reduzido em > 60% |

---

## 10. Questões em aberto

| # | Questão | Quem decide |
|---|---|---|
| Q-01 | IEM tem API/webhook disponível? Qual autenticação? | TI GI Group |
| Q-02 | Blip tem integração com WhatsApp Business API ativa? Limite de disparos por dia? | Time Blip / TI |
| Q-03 | D4Sign webhook está ativo no ambiente de temporários? | TI / Djansen |
| Q-04 | GINFOR tem endpoint de leitura de matrícula gerada? | TI GI Group |
| Q-05 | Quais clientes (além de Shopee) precisam de painel externo na v1? | Operação |
| Q-06 | Qual é o prazo máximo aceitável para o candidato corrigir documentação antes de ser marcado como ABANDONADO? | CARE / Operação |
| Q-07 | O consentimento de comunicação por Blip/WhatsApp já está coberto no termo de admissão atual? | Jurídico |
| Q-08 | SOC tem API de consulta de status de exame? Ou a integração deve ser manual na v1? | TI / SOC |

---

*Spec v0.1 — Jun/2026 — Perform IT*
