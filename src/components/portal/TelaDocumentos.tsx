// =============================================================
// TELA: DOCUMENTOS
// Resolve: D11 — Sem canal de acesso a documentos pós-contrato
// Iniciativas: I05 (assinatura eletrônica Sign Único), I10 (portal do worker)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Lista de documentos disponíveis (contrato, holerites, ASO, informe IR)
// ✦ Status de cada documento: assinado ✓, disponível ↓, pendente ○
// ✦ Botão de download (visual — não funcional)
//
// Como usar DorTooltip:
//   <DorTooltip dorId="D11" iniciativaId="I05">
//     <seu-elemento />
//   </DorTooltip>
// =============================================================

import DorTooltip from './DorTooltip'

function TelaDocumentos() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D11" iniciativaId="I05">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Meus Documentos</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Acesse e baixe seus documentos</p>
        </div>
      </DorTooltip>

      {/* → Construa aqui: lista de documentos com status (assinado/disponível/pendente) e botões de download */}
    </div>
  )
}

export default TelaDocumentos
