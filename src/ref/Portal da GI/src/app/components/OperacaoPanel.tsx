import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import {
  Link2, FileDown, ChevronDown, ChevronUp, CheckCircle2,
  AlertTriangle, XCircle, Building2, Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { Candidate, Status } from "../types";
import {
  STATUS_CONFIG, SLA_HOURS, STAGE_ORDER, TERMINAL_STATUSES,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = new Date("2026-06-16T10:30:00");

function hoursInStage(stageEnteredAt: string): number {
  const entered = new Date(stageEnteredAt + "T08:00:00");
  return Math.floor((NOW.getTime() - entered.getTime()) / 3_600_000);
}

type SLAResult = "green" | "yellow" | "red" | "terminal";

function getSLA(c: Candidate): SLAResult {
  if (TERMINAL_STATUSES.includes(c.status)) return "terminal";
  const expected = SLA_HOURS[c.status];
  if (!expected) return "terminal";
  const ratio = hoursInStage(c.stageEnteredAt) / expected;
  if (ratio < 0.7) return "green";
  if (ratio <= 1.0) return "yellow";
  return "red";
}

function getExpectedCompletion(c: Candidate): string {
  if (c.status === "ADMITIDO") return "—";
  if (["BLOQUEADO", "ABANDONADO"].includes(c.status)) return "—";
  const idx = STAGE_ORDER.indexOf(c.status as Status);
  if (idx === -1) return "—";
  const remainingHours = STAGE_ORDER.slice(idx)
    .reduce((sum, s) => sum + (SLA_HOURS[s] ?? 0), 0);
  const date = new Date(NOW.getTime() + remainingHours * 3_600_000);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

// Stages that appear in the chart (exclude terminals for readability)
const CHART_STAGES: Status[] = [
  "LINK_ENVIADO", "UPLOAD_INICIADO", "DOCS_PENDENTES", "DOCS_COMPLETOS",
  "EXAME_AGENDADO", "EXAME_REALIZADO", "ASO_EMITIDO",
  "CONTRATO_ENVIADO", "CONTRATO_ASSINADO", "MATRICULA_GERADA",
  "ADMITIDO", "BLOQUEADO", "ABANDONADO",
];

// ─── Small atoms ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SLABadge({ sla }: { sla: SLAResult }) {
  if (sla === "terminal") return null;
  const map = {
    green:  { cls: "text-green-700 bg-green-50 border-green-200",  icon: <CheckCircle2 className="w-3 h-3" />, label: "No prazo"  },
    yellow: { cls: "text-amber-700 bg-amber-50 border-amber-200",  icon: <AlertTriangle className="w-3 h-3" />, label: "Em risco" },
    red:    { cls: "text-red-700 bg-red-50 border-red-200",        icon: <XCircle className="w-3 h-3" />,       label: "Atrasado" },
  }[sla];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map.cls}`}>
      {map.icon}
      {map.label}
    </span>
  );
}

// ─── Pipeline chart (RF-25) ───────────────────────────────────────────────────

function PipelineChart({ candidates }: { candidates: Candidate[] }) {
  const clients = ["Shopee", "SMS"];

  const chartData = clients.map(client => {
    const row: Record<string, number | string> = { name: client };
    CHART_STAGES.forEach(s => {
      const n = candidates.filter(c => c.client === client && c.status === s).length;
      if (n > 0) row[s] = n;
    });
    return row;
  });

  const presentStages = CHART_STAGES.filter(s =>
    candidates.some(c => c.status === s)
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-[#0f172b] mb-1">Visão de Pipeline por Cliente</h2>
      <p className="text-xs text-slate-400 mb-5">Distribuição de candidatos por etapa — clique numa barra para filtrar</p>

      <ResponsiveContainer width="100%" height={130}>
        <BarChart layout="vertical" data={chartData} barSize={28} margin={{ left: 0, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={56}
            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(15,23,43,0.04)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs min-w-[160px]">
                  <p className="font-semibold text-[#0f172b] mb-2">{label}</p>
                  {payload.map(p => (
                    <div key={p.dataKey as string} className="flex items-center justify-between gap-3 py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill as string }} />
                        <span className="text-slate-600">{STATUS_CONFIG[p.dataKey as Status]?.label}</span>
                      </div>
                      <span className="font-bold text-[#0f172b]">{p.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {presentStages.map((stage, i) => (
            <Bar key={stage} dataKey={stage} stackId="pipeline" fill={STATUS_CONFIG[stage].hex} radius={i === presentStages.length - 1 ? [0, 4, 4, 0] : 0}>
              <LabelList
                dataKey={stage}
                position="inside"
                style={{ fontSize: 10, fontWeight: 700, fill: "white" }}
                formatter={(v: number) => (v > 0 ? v : "")}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-slate-100">
        {presentStages.map(s => (
          <div key={s} className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: STATUS_CONFIG[s].hex }} />
            {STATUS_CONFIG[s].label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Aggregate stat cards ──────────────────────────────────────────────────────

function AggCard({ label, value, sub, color = "slate" }: {
  label: string; value: number; sub: string;
  color?: "slate" | "amber" | "red" | "green";
}) {
  const valColor = { slate: "text-[#0f172b]", amber: "text-amber-600", red: "text-red-600", green: "text-green-600" }[color];
  const top = { slate: "", amber: "border-t-2 border-t-amber-400", red: "border-t-2 border-t-red-400", green: "border-t-2 border-t-green-400" }[color];
  return (
    <div className={`bg-white rounded-xl p-4 border border-slate-200 shadow-sm ${top}`}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-bold leading-none ${valColor}`}>{value}</p>
      <p className="text-[11px] text-slate-400 mt-1.5">{sub}</p>
    </div>
  );
}

// ─── Candidate table with drill-down (RF-26, RF-27) ───────────────────────────

function ClientSection({ client, candidates }: { client: string; candidates: Candidate[] }) {
  const [expanded, setExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SLAResult | "">("");

  const slaMap = useMemo(() => {
    const map: Record<string, SLAResult> = {};
    candidates.forEach(c => { map[c.id] = getSLA(c); });
    return map;
  }, [candidates]);

  const rows = activeFilter
    ? candidates.filter(c => slaMap[c.id] === activeFilter)
    : candidates;

  const counts = {
    green:  candidates.filter(c => slaMap[c.id] === "green").length,
    yellow: candidates.filter(c => slaMap[c.id] === "yellow").length,
    red:    candidates.filter(c => slaMap[c.id] === "red").length,
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Client header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-[#0f172b] text-sm">{client}</span>
          <span className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full font-medium">
            {candidates.length} candidato{candidates.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* SLA quick-filter pills */}
          {counts.red > 0 && (
            <button
              onClick={() => setActiveFilter(activeFilter === "red" ? "" : "red")}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                activeFilter === "red"
                  ? "bg-red-100 border-red-300 text-red-700"
                  : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              }`}
            >
              <XCircle className="w-3 h-3" /> {counts.red} atrasado{counts.red > 1 ? "s" : ""}
            </button>
          )}
          {counts.yellow > 0 && (
            <button
              onClick={() => setActiveFilter(activeFilter === "yellow" ? "" : "yellow")}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                activeFilter === "yellow"
                  ? "bg-amber-100 border-amber-300 text-amber-700"
                  : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
              }`}
            >
              <AlertTriangle className="w-3 h-3" /> {counts.yellow} em risco
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {expanded && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Candidato</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status atual</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Na etapa</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">SLA</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Previsão conclusão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(c => {
              const sla = slaMap[c.id];
              const hours = hoursInStage(c.stageEnteredAt);
              const completion = getExpectedCompletion(c);
              return (
                <tr key={c.id} className={`${sla === "red" ? "bg-red-50/40" : sla === "yellow" ? "bg-amber-50/30" : ""}`}>
                  <td className="px-5 py-3 text-sm font-medium text-[#0f172b]">{c.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`}
                    </div>
                  </td>
                  <td className="px-4 py-3"><SLABadge sla={sla} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500 tabular-nums">{completion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {expanded && rows.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-400">
          Nenhum candidato com este filtro de SLA.
        </div>
      )}
    </div>
  );
}

// ─── Print styles (RF-29) ─────────────────────────────────────────────────────

const PRINT_CSS = `
@media print {
  body { font-size: 12px; background: white !important; }
  .no-print { display: none !important; }
  .print-full { width: 100% !important; max-width: 100% !important; }
  .print-header { display: block !important; }
  @page { margin: 2cm; }
}
@media screen {
  .print-header { display: none; }
}
`;

function PrintHeader({ clientFilter }: { clientFilter: string }) {
  const now = new Date("2026-06-16T10:30:00");
  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="print-header mb-6 pb-5 border-b-2 border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">GI Conecta — Relatório de Admissão</p>
          <p className="text-sm text-gray-500 mt-1">
            {clientFilter === "Todos" ? "Todos os clientes" : `Cliente: ${clientFilter}`} · Lote ativo
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p className="capitalize">{dateStr}</p>
          <p>Gerado às {timeStr}</p>
          <p className="mt-1 font-semibold text-gray-700">Confidencial — uso interno</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface OperacaoPanelProps {
  candidates: Candidate[];
  /** When true, renders in standalone (no sidebar) mode for shared link access */
  standalone?: boolean;
}

export function OperacaoPanel({ candidates, standalone = false }: OperacaoPanelProps) {
  const [clientFilter, setClientFilter] = useState<string>("Todos");

  const clients = ["Shopee", "SMS"];

  const visibleCandidates = clientFilter === "Todos"
    ? candidates
    : candidates.filter(c => c.client === clientFilter);

  const stats = useMemo(() => ({
    total: visibleCandidates.length,
    emAndamento: visibleCandidates.filter(c => !TERMINAL_STATUSES.includes(c.status)).length,
    admitidos: visibleCandidates.filter(c => c.status === "ADMITIDO").length,
    issues: visibleCandidates.filter(c => ["BLOQUEADO", "ABANDONADO", "DOCS_PENDENTES"].includes(c.status)).length,
  }), [visibleCandidates]);

  function handleCopyLink() {
    const base = window.location.href.split("?")[0];
    const url = `${base}?view=operacao&token=gi2026-ops`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copiado! Compartilhe com o cliente.");
    });
  }

  function handleExportPDF() {
    window.print();
  }

  const TOKEN = new URLSearchParams(window.location.search).get("token") ?? "";

  return (
    <>
      <style>{PRINT_CSS}</style>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f5f9]">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <h1 className="text-[15px] font-semibold text-[#0f172b]">
              {standalone ? "GI Conecta — Painel Operação" : "Painel Operação / Cliente"}
            </h1>
            {standalone && TOKEN && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                acesso via link compartilhado
              </span>
            )}
            <span className="text-slate-300">|</span>
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-600 font-medium">Tempo real</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              Copiar link de acesso
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1d293d] px-3 py-1.5 rounded-lg hover:bg-[#0f172b] transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar PDF
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto print-full">
          <div className="p-6 space-y-5 print-full">

            {/* Print-only header (RF-29) */}
            <PrintHeader clientFilter={clientFilter} />

            {/* Client filter tabs */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit no-print shadow-sm">
              {["Todos", ...clients].map(c => (
                <button
                  key={c}
                  onClick={() => setClientFilter(c)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    clientFilter === c
                      ? "bg-[#1d293d] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Aggregate stats (RF-25) */}
            <div className="grid grid-cols-4 gap-4">
              <AggCard label="Total"       value={stats.total}      sub="no lote selecionado"    color="slate"  />
              <AggCard label="Em Andamento" value={stats.emAndamento} sub="em etapas ativas"       color="amber"  />
              <AggCard label="Admitidos"   value={stats.admitidos}   sub="processo concluído"     color="green"  />
              <AggCard label="Pendências"  value={stats.issues}      sub="docs/bloqueados/abandono" color="red" />
            </div>

            {/* Pipeline chart (RF-25) */}
            <PipelineChart candidates={visibleCandidates} />

            {/* SLA legend */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 no-print">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Critérios de SLA (RF-27)</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { sla: "green" as const,  label: "No prazo",  desc: "< 70% do tempo esperado na etapa" },
                  { sla: "yellow" as const, label: "Em risco",  desc: "70–100% do tempo esperado na etapa" },
                  { sla: "red" as const,    label: "Atrasado",  desc: "> 100% — SLA da etapa excedido" },
                ].map(({ sla, label, desc }) => (
                  <div key={sla} className="flex items-start gap-2.5">
                    <SLABadge sla={sla} />
                    <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-client drill-down (RF-26, RF-27) */}
            {(clientFilter === "Todos" ? clients : [clientFilter]).map(client => {
              const clientCandidates = visibleCandidates.filter(c => c.client === client);
              if (clientCandidates.length === 0) return null;
              return (
                <ClientSection key={client} client={client} candidates={clientCandidates} />
              );
            })}

          </div>
        </div>
      </div>
    </>
  );
}
