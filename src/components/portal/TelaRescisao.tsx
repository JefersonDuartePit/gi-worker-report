// =============================================================
// TELA: RESCISÃO
// Resolve: D09 — 10 dias sem informação no desligamento
// Iniciativas: I13 (fluxo de desligamento), I14 (assinatura TRCT)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Status temporal: "Dia 3 de 10" com barra de progresso
// ✦ Timeline das etapas do processo de desligamento
// ✦ Previsão de disponibilização dos documentos rescisórios
// ✦ Botão de contato com o time GI (visual — não funcional)
//
// Como usar DorTooltip:
//   <DorTooltip dorId="D09" iniciativaId="I13">
//     <seu-elemento />
//   </DorTooltip>
// =============================================================

import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'

function TelaRescisao() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D09" iniciativaId="I13">
        <div className="bg-white rounded-xl border border-gi-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Processo de rescisão</span>
            <span className="text-xs text-gi-charcoal">Dia 3 de 10</span>
          </div>
          <ProgressBar value={30} />
          <p className="text-xs text-gi-charcoal mt-2">Próxima etapa: Cálculo do TRCT</p>
        </div>
      </DorTooltip>

      {/* → Construa aqui: timeline das etapas e previsão de documentos */}
    </div>
  )
}

export default TelaRescisao
