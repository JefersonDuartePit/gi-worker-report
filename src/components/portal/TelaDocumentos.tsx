import { Download } from 'lucide-react'
import DorTooltip from './DorTooltip'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface DocumentoIlustrativo {
  nome: string
  categoria: string
  data: string
  status: 'assinado' | 'disponivel' | 'pendente'
}

const DOCUMENTOS: DocumentoIlustrativo[] = [
  { nome: 'Contrato de trabalho', categoria: 'Admissão', data: '04/06/2026', status: 'assinado' },
  { nome: 'ASO admissional', categoria: 'Admissão', data: '05/06/2026', status: 'assinado' },
  { nome: 'Holerite — junho/2026', categoria: 'Folha', data: '28/06/2026', status: 'disponivel' },
  { nome: 'Holerite — maio/2026', categoria: 'Folha', data: '28/05/2026', status: 'disponivel' },
  { nome: 'Informe de rendimentos 2025', categoria: 'Folha', data: '—', status: 'pendente' },
  { nome: 'Comprovante de vale-transporte', categoria: 'Benefícios', data: '01/06/2026', status: 'disponivel' },
]

const STATUS_BADGE: Record<DocumentoIlustrativo['status'], { variant: 'concluido' | 'andamento' | 'media'; label: string }> = {
  assinado: { variant: 'concluido', label: 'Assinado' },
  disponivel: { variant: 'andamento', label: 'Disponível' },
  pendente: { variant: 'media', label: 'Pendente' },
}

function TelaDocumentos() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Meus Documentos</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acesse e baixe seus documentos</p>
      </div>

      <DorTooltip dorId="D11" iniciativaId="I05">
        <div className="space-y-2">
          {DOCUMENTOS.map(doc => (
            <Card key={doc.nome} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gi-dark">{doc.nome}</span>
                  <Badge variant={STATUS_BADGE[doc.status].variant}>{STATUS_BADGE[doc.status].label}</Badge>
                </div>
                <div className="text-[11px] text-gi-charcoal mt-1">{doc.categoria} · {doc.data}</div>
              </div>
              <Button variant="ghost" disabled={doc.status === 'pendente'}>
                <Download className="w-3.5 h-3.5" />
                Baixar
              </Button>
            </Card>
          ))}
        </div>
      </DorTooltip>
    </div>
  )
}

export default TelaDocumentos
