// =============================================================
// TELA: INÍCIO
// Resolve: D01 — Sem visibilidade do status admissional
//          D07 — Worker não sabe quem é seu contato GI
// Iniciativas: I01 (portal de admissão), I10 (portal do worker)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Status da admissão com barra de progresso
// ✦ Etapas (concluídas ✓, em andamento ◉, aguardando ○)
// ✦ Métricas: solicitações abertas, treinamentos concluídos
// ✦ Atalhos rápidos para outras telas
//
// Como usar DorTooltip:
//   <DorTooltip dorId="D01" iniciativaId="I01">
//     <seu-elemento />
//   </DorTooltip>
// =============================================================

import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'

function TelaInicio() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Olá, Ana Silva 👋</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe sua jornada na GI Group</p>
      </div>

      <DorTooltip dorId="D01" iniciativaId="I01">
        <div className="bg-white rounded-xl border border-gi-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Status da admissão</span>
            <span className="text-xs text-gi-blue font-bold">60%</span>
          </div>
          <ProgressBar value={60} />
          <p className="text-xs text-gi-charcoal mt-2">Documentação pendente · Passo 3 de 5</p>
        </div>
      </DorTooltip>

      {/* → Continue construindo: cards de métricas, atalhos rápidos, etapas da admissão */}
    </div>
  )
}

export default TelaInicio
