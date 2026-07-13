# Plano de Implementação — Portal GI Conecta (Admissão)

## Estado atual

O protótipo já cobre a base do **Painel do Analista**:
- Sidebar com logo GI Conecta (import Figma)
- Tabela de candidatos com filtros, badges de status e alerta >48h (RF-16, RF-17, RF-21, RF-22)
- Drawer com linha do tempo por candidato (RF-18)
- Botões de ação no drawer (ainda sem formulário real — RF-19, RF-20 parciais)
- Notas do analista (somente leitura — RF-23 parcial)

---

## O que falta construir

### Fase 1 — Completar Painel do Analista

**RF-19 — Modal "Agendar Exame (SOC)"**
- Abre ao clicar em "Agendar Exame" no drawer quando status = DOCS_COMPLETOS
- Campos: data do exame, horário, clínica, número da guia
- Ao confirmar: muda estado do candidato para EXAME_AGENDADO, append na timeline com source=Manual+usuário, mostra toast "Notificação enviada via Blip"
- Botão no drawer fica desabilitado após agendamento

**RF-20 — Modal "Bloquear / Abandonar"**
- Abre ao clicar em "Bloquear" no drawer (qualquer estado ativo)
- Selector: Bloqueado | Abandonado
- Campo de motivo (obrigatório)
- Ao confirmar: muda estado, append na timeline, fecha drawer

**RF-23 — Notas editáveis**
- No drawer, campo de observações clicável (click-to-edit inline)
- Botão Salvar / Cancelar
- Persiste no estado local do candidato

**RF-24 — Exportar CSV**
- Botão "Exportar CSV" no header já existe, mas é stub
- Implementar geração e download real do arquivo usando a lista filtrada atual
- Colunas: Nome, Cliente, Status, Tipo, Na etapa (horas), Link enviado em

**RF-15 — Alerta "AJUDA"**
- Adicionar mock de candidato que enviou "AJUDA" via Blip
- Badge de alerta vermelho no header (Bell já existe, apenas ativar o badge)
- Linha destacada na tabela com ícone de chat

---

### Fase 2 — Painel da Operação / Cliente (RF-25 a RF-29)

**RF-25 — Visão agregada por lote/cliente**
- Nova view acessível pelo sidebar (segundo item de navegação)
- Dois cards de cliente: Shopee e SMS
- Para cada cliente: barra de progresso empilhada (stacked bar) por etapa, usando recharts
- Contagem total de candidatos por etapa

**RF-26 — Drill-down por candidato**
- Abaixo do gráfico: tabela simples com nome, etapa atual e data prevista de conclusão
- Data prevista calculada com base no tempo médio histórico por etapa (constante mock)

**RF-27 — Indicador de SLA**
- Badge colorido por linha: verde (<70% do tempo médio da etapa), amarelo (70–100%), vermelho (>100%)
- Legenda explicando os critérios

**RF-28 — Link compartilhável com token**
- URL simulada: `?view=operacao&token=<hash>`
- Ao acessar com o token na URL: renderiza diretamente o Painel Operação sem sidebar de analista
- Botão "Copiar link" que copia a URL com o token para o clipboard

**RF-29 — Exportar relatório em PDF**
- Botão "Exportar PDF" que aciona `window.print()` com CSS de impressão adequado
- Oculta sidebar e filtros na versão impressa (via media query)

---

### Fase 3 — Navegação e polish ✅ CONCLUÍDA

**Roteamento entre paineis** ✅ (Fase 2)
- AppSidebar com 2 itens de navegação, activeView state, highlight do item ativo

**Interatividade das mutações de estado** ✅ (Fase 1)
- useState + updateCandidate — tabela e badges refletem mudanças imediatamente

**Toasts de feedback** ✅ (Fase 1)
- sonner em todas as ações: agendar exame, bloquear, CSV, Blip, notas

**Polish adicional implementado:**
- Transição animada (motion) ao trocar entre Painel Analista e Painel Operação
- ESC fecha modais e drawer em cascata
- "Marcar como atendido" no drawer para candidatos com AJUDA
- Badge de alertas (críticos) no item "Painel Operação" do sidebar
- Indicador "Tempo real" (ping animado) no header do Painel Operação
- Cabeçalho de impressão (RF-29) com nome do relatório, cliente, data e horário

---

## Ordem de execução sugerida

1. RF-19 (modal agendar exame) + mutação de estado global
2. RF-20 (modal bloquear/abandonar) + mutação
3. RF-23 (notas editáveis)
4. RF-24 (CSV real) + RF-15 (alerta AJUDA)
5. Fase 2 completa (Painel Operação RF-25 a RF-29)
6. Fase 3 (navegação sidebar + toasts)
