// =============================================================
// TELA: SOLICITAÇÕES
// Resolve: D05 — Sem canal único de comunicação com o worker
// Iniciativa: I07 — Central de atendimento unificada CARE + SMS
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Lista de solicitações abertas com status e número de ticket
// ✦ Botão "Nova solicitação" com modal de abertura
// ✦ Tipos de solicitação: atualização cadastral, atestado, benefícios, outros
//
// Dica de modal:
//   const [modalOpen, setModalOpen] = useState(false)
//   {modalOpen && <div className="fixed inset-0 ...">...</div>}
// =============================================================

import { useState } from 'react'
import DorTooltip from './DorTooltip'

function TelaSolicitacoes() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <DorTooltip dorId="D05" iniciativaId="I07">
          <h2 className="text-base font-bold text-gi-dark">Solicitações</h2>
        </DorTooltip>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1.5 bg-gi-blue text-white text-xs font-bold rounded-lg hover:bg-gi-navy transition-colors"
        >
          + Nova solicitação
        </button>
      </div>

      {/* → Construa aqui: lista de solicitações abertas com status e número de ticket */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="font-bold text-gi-dark mb-4">Nova solicitação</h3>
            {/* → Construa o formulário de nova solicitação aqui */}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full py-2 text-sm text-gi-charcoal border border-gi-border rounded-lg hover:bg-gi-light transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TelaSolicitacoes
