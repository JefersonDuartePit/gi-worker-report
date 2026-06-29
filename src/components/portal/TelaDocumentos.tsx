import DorTooltip from './DorTooltip'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface DocumentoIlustrativo {
  nome: string
  status: 'assinado' | 'disponivel' | 'pendente'
}

const DOCUMENTOS: DocumentoIlustrativo[] = [
  { nome: 'Contrato de trabalho', status: 'assinado' },
  { nome: 'Holerite — mês atual', status: 'disponivel' },
  { nome: 'ASO admissional', status: 'assinado' },
  { nome: 'Informe de rendimentos', status: 'pendente' },
]

const STATUS_BADGE: Record<DocumentoIlustrativo['status'], { variant: 'concluido' | 'andamento' | 'media'; label: string }> = {
  assinado: { variant: 'concluido', label: 'Assinado' },
  disponivel: { variant: 'andamento', label: 'Disponível' },
  pendente: { variant: 'media', label: 'Pendente' },
}

function TelaDocumentos() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D11" iniciativaId="I05">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Meus Documentos</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Acesse e baixe seus documentos</p>
        </div>
      </DorTooltip>

      <div className="space-y-2">
        {DOCUMENTOS.map(doc => (
          <Card key={doc.nome} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gi-dark">{doc.nome}</span>
              <Badge variant={STATUS_BADGE[doc.status].variant}>{STATUS_BADGE[doc.status].label}</Badge>
            </div>
            <Button variant="ghost">Baixar</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TelaDocumentos
