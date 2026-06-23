// =============================================================
// TELA: TREINAMENTOS
// Resolve: D06 — Sem acompanhamento de onboarding 30/60/90 dias
// Iniciativa: I10 — Portal do Worker (autoatendimento)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Trilha de onboarding com progresso visual
// ✦ Módulos: concluídos ✓, em andamento ◉, bloqueados 🔒, aguardando data 📅
// ✦ Marcadores temporais: 30 dias / 60 dias / 90 dias
//
// Como usar DorTooltip:
//   <DorTooltip dorId="D06" iniciativaId="I10">
//     <seu-elemento />
//   </DorTooltip>
// =============================================================

import DorTooltip from './DorTooltip'

function TelaTreinamentos() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D06" iniciativaId="I10">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Treinamentos</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Sua trilha de integração na GI Group</p>
        </div>
      </DorTooltip>

      {/* → Construa aqui: trilha de módulos com marcos de 30/60/90 dias */}
    </div>
  )
}

export default TelaTreinamentos
