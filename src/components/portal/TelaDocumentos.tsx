import { Download, Clock } from 'lucide-react'
import DorTooltip from './DorTooltip'
import StatusPill from './StatusPill'

interface DocumentoIlustrativo {
  nome: string
  categoria: string
  data: string
  status: 'assinado' | 'disponivel' | 'pendente'
}

const DOCUMENTOS: DocumentoIlustrativo[] = [
  { nome: 'ASO admissional', categoria: 'Admissão', data: '05/06/2026', status: 'assinado' },
  { nome: 'Holerite — junho/2026', categoria: 'Folha', data: '28/06/2026', status: 'disponivel' },
  { nome: 'Holerite — maio/2026', categoria: 'Folha', data: '28/05/2026', status: 'disponivel' },
  { nome: 'Informe de rendimentos 2025', categoria: 'Folha', data: '—', status: 'pendente' },
  { nome: 'Comprovante de vale-transporte', categoria: 'Benefícios', data: '01/06/2026', status: 'disponivel' },
]

const STATUS_PILL: Record<DocumentoIlustrativo['status'], { variant: 'concluido' | 'andamento' | 'media'; label: string }> = {
  assinado: { variant: 'concluido', label: 'Assinado' },
  disponivel: { variant: 'andamento', label: 'Disponível' },
  pendente: { variant: 'media', label: 'Pendente' },
}

function TelaDocumentos() {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gi-navy">Meus Documentos</h2>
        <p className="text-sm text-gi-text mt-1">Acesse e baixe seus documentos</p>
      </div>

      {/* Contrato pendente de assinatura — D02 */}
      <DorTooltip dorId="D02" iniciativaId="I05">
        <div className="bg-white rounded-xl border-2 border-gi-blue shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gi-dark">Contrato de trabalho</span>
                <StatusPill variant="andamento">Aguardando assinatura</StatusPill>
              </div>
              <div className="text-[11px] text-gi-charcoal mt-1">Admissão · disponível há 3 dias</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gi-charcoal">
                <Clock className="w-3 h-3 text-gi-amber shrink-0" />
                Prazo para assinatura: 04/07/2026
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-gi-navy border border-gi-blue bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors shrink-0">
              <Download className="w-3.5 h-3.5" />
              Ler e assinar
            </button>
          </div>
        </div>
      </DorTooltip>

      {/* Demais documentos — D11 */}
      <DorTooltip dorId="D11" iniciativaId="I17">
        <div className="bg-white rounded-xl border border-gi-border shadow-sm divide-y divide-gi-border">
          {DOCUMENTOS.map(doc => (
            <div key={doc.nome} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gi-dark">{doc.nome}</span>
                  <StatusPill variant={STATUS_PILL[doc.status].variant}>{STATUS_PILL[doc.status].label}</StatusPill>
                </div>
                <div className="text-[11px] text-gi-charcoal mt-1">{doc.categoria} · {doc.data}</div>
              </div>
              <button
                disabled={doc.status === 'pendente'}
                className="flex items-center gap-1.5 text-xs font-medium text-gi-charcoal border border-gi-border bg-white px-3 py-1.5 rounded-lg hover:bg-gi-light transition-colors disabled:opacity-40 disabled:hover:bg-white"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar
              </button>
            </div>
          ))}
        </div>
      </DorTooltip>
    </div>
  )
}

export default TelaDocumentos
