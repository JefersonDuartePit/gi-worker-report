import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import {
  Search, Download, Clock, AlertTriangle, X,
  Building2, Bell, Calendar, MessageSquare,
  ChevronRight, XCircle, Users, ClipboardList,
  Save, Pencil, HelpCircle, Ban, Archive,
} from "lucide-react";
import { AppSidebar } from "./components/AppSidebar";
import { OperacaoPanel } from "./components/OperacaoPanel";
import type {
  Status, AdmissionType, EventSource, TimelineEvent, Candidate, NavView,
} from "./types";
import {
  STATUS_CONFIG, ADMISSION_LABELS, TERMINAL_STATUSES,
} from "./types";

const SOURCE_EMOJI: Record<EventSource, string> = {
  IEM: "📄", SOC: "🏥", D4Sign: "✍️", GINFOR: "🎓",
  Manual: "👤", Blip: "💬", Sistema: "⚙️",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = new Date("2026-06-16T10:30:00");

function hoursInStage(stageEnteredAt: string): number {
  const entered = new Date(stageEnteredAt + "T08:00:00");
  return Math.floor((NOW.getTime() - entered.getTime()) / 3_600_000);
}

function formatDuration(h: number): string {
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  const r = h % 24;
  return r > 0 ? `${d}d ${r}h` : `${d}d`;
}

function isAlert(c: Candidate): boolean {
  if (TERMINAL_STATUSES.includes(c.status)) return false;
  return hoursInStage(c.stageEnteredAt) > 48;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function nowTimestamp(): string {
  return "16/06 " + NOW.toTimeString().slice(0, 5);
}

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-teal-500", "bg-amber-500", "bg-rose-500",
  "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500",
];
function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function generateCSV(candidates: Candidate[]): string {
  const header = ["Nome", "Cliente", "Status", "Tipo de Admissão", "Na Etapa (h)", "Link Enviado Em", "Alerta >48h"];
  const rows = candidates.map(c => [
    c.name,
    c.client,
    STATUS_CONFIG[c.status].label,
    ADMISSION_LABELS[c.admissionType].label,
    String(hoursInStage(c.stageEnteredAt)),
    c.linkSentAt,
    isAlert(c) ? "Sim" : "Não",
  ]);
  return [header, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "1", name: "Carlos Silva", client: "Shopee", status: "DOCS_PENDENTES",
    linkSentAt: "2026-06-10", stageEnteredAt: "2026-06-11", admissionType: "simples",
    pendingDocs: ["CNH (vencida)", "Comprovante de Residência (emitido em 15/02 — >90 dias)"],
    notes: "Candidato informou que está renovando a CNH. Aguardar até 18/06.",
    timeline: [
      { id: "t1", timestamp: "10/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "11/06 10:30", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "11/06 14:15", status: "DOCS_PENDENTES", source: "Sistema", note: "CNH vencida. Comprovante emitido em 15/02 (>90 dias). Notificação enviada via Blip." },
      { id: "t4", timestamp: "12/06 14:15", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete automático 24h enviado." },
      { id: "t5", timestamp: "13/06 14:15", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete automático 48h enviado." },
    ],
  },
  {
    id: "2", name: "Marina Santos", client: "Shopee", status: "EXAME_AGENDADO",
    linkSentAt: "2026-06-08", stageEnteredAt: "2026-06-13", admissionType: "com_portal",
    timeline: [
      { id: "t1", timestamp: "08/06 11:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "09/06 09:15", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "10/06 16:40", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "13/06 10:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina", note: "Clínica Saúde Total — 18/06 às 14:00 — Guia 88421." },
    ],
  },
  {
    id: "3", name: "Roberto Alves", client: "SMS", status: "ADMITIDO",
    linkSentAt: "2026-06-01", stageEnteredAt: "2026-06-14", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "01/06 08:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "02/06 11:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "03/06 09:30", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "05/06 10:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "07/06 15:00", status: "EXAME_REALIZADO", source: "SOC" },
      { id: "t6", timestamp: "09/06 08:00", status: "ASO_EMITIDO", source: "SOC" },
      { id: "t7", timestamp: "10/06 09:00", status: "CONTRATO_ENVIADO", source: "D4Sign" },
      { id: "t8", timestamp: "11/06 14:00", status: "CONTRATO_ASSINADO", source: "D4Sign" },
      { id: "t9", timestamp: "13/06 16:00", status: "MATRICULA_GERADA", source: "GINFOR" },
      { id: "t10", timestamp: "14/06 10:00", status: "ADMITIDO", source: "Sistema" },
    ],
  },
  {
    id: "4", name: "Juliana Costa", client: "Shopee", status: "CONTRATO_ENVIADO",
    linkSentAt: "2026-06-05", stageEnteredAt: "2026-06-13", admissionType: "com_treinamento",
    timeline: [
      { id: "t1", timestamp: "05/06 10:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "06/06 08:30", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "07/06 11:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "09/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "11/06 14:00", status: "EXAME_REALIZADO", source: "SOC" },
      { id: "t6", timestamp: "12/06 08:00", status: "ASO_EMITIDO", source: "SOC" },
      { id: "t7", timestamp: "13/06 10:00", status: "CONTRATO_ENVIADO", source: "D4Sign", note: "Link D4Sign enviado via Blip. Prazo: 48h." },
    ],
  },
  {
    id: "5", name: "Pedro Mendes", client: "SMS", status: "LINK_ENVIADO",
    linkSentAt: "2026-06-15", stageEnteredAt: "2026-06-15", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "15/06 14:00", status: "LINK_ENVIADO", source: "IEM", note: "Mensagem de boas-vindas e instruções enviadas via Blip." },
    ],
  },
  {
    id: "6", name: "Fernanda Lima", client: "Shopee", status: "DOCS_PENDENTES",
    linkSentAt: "2026-06-09", stageEnteredAt: "2026-06-10", admissionType: "simples",
    pendingDocs: ["Foto 3x4 (resolução abaixo do mínimo — OCR falhou)"],
    notes: "Candidata respondeu no WhatsApp que vai reenviar. Reenvio ainda não detectado no IEM.",
    helpRequested: true,
    timeline: [
      { id: "t1", timestamp: "09/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "09/06 15:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "10/06 08:00", status: "DOCS_PENDENTES", source: "Sistema", note: "Foto 3x4 abaixo da resolução mínima." },
      { id: "t4", timestamp: "11/06 08:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete automático 24h." },
      { id: "t5", timestamp: "12/06 08:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete automático 48h." },
      { id: "t6", timestamp: "13/06 08:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 72h (última tentativa)." },
      { id: "t7", timestamp: "14/06 10:22", status: "DOCS_PENDENTES", source: "Blip", note: 'Candidata respondeu "AJUDA" — solicitou atendimento humano.' },
    ],
  },
  {
    id: "7", name: "Lucas Oliveira", client: "Shopee", status: "UPLOAD_INICIADO",
    linkSentAt: "2026-06-14", stageEnteredAt: "2026-06-15", admissionType: "com_portal",
    timeline: [
      { id: "t1", timestamp: "14/06 16:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "15/06 10:00", status: "UPLOAD_INICIADO", source: "IEM" },
    ],
  },
  {
    id: "8", name: "Beatriz Nunes", client: "SMS", status: "ASO_EMITIDO",
    linkSentAt: "2026-06-03", stageEnteredAt: "2026-06-13", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "03/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "04/06 08:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "05/06 14:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "07/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "10/06 11:00", status: "EXAME_REALIZADO", source: "SOC" },
      { id: "t6", timestamp: "13/06 08:30", status: "ASO_EMITIDO", source: "SOC", note: "ASO apto emitido. Contrato sendo preparado no D4Sign." },
    ],
  },
  {
    id: "9", name: "Diego Ferreira", client: "Shopee", status: "BLOQUEADO",
    linkSentAt: "2026-06-07", stageEnteredAt: "2026-06-12", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "07/06 10:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "08/06 09:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "09/06 14:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "11/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "12/06 14:00", status: "BLOQUEADO", source: "Manual", user: "Ana Carolina", note: "ASO inapto — hipertensão não controlada. Cliente notificado." },
    ],
  },
  {
    id: "10", name: "Amanda Rocha", client: "SMS", status: "MATRICULA_GERADA",
    linkSentAt: "2026-06-01", stageEnteredAt: "2026-06-15", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "01/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "02/06 10:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "03/06 11:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "05/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "08/06 14:00", status: "EXAME_REALIZADO", source: "SOC" },
      { id: "t6", timestamp: "10/06 08:00", status: "ASO_EMITIDO", source: "SOC" },
      { id: "t7", timestamp: "11/06 09:00", status: "CONTRATO_ENVIADO", source: "D4Sign" },
      { id: "t8", timestamp: "13/06 10:00", status: "CONTRATO_ASSINADO", source: "D4Sign" },
      { id: "t9", timestamp: "15/06 14:00", status: "MATRICULA_GERADA", source: "GINFOR" },
    ],
  },
  {
    id: "11", name: "Felipe Castro", client: "Shopee", status: "DOCS_COMPLETOS",
    linkSentAt: "2026-06-11", stageEnteredAt: "2026-06-13", admissionType: "com_treinamento",
    timeline: [
      { id: "t1", timestamp: "11/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "12/06 08:30", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "13/06 11:00", status: "DOCS_COMPLETOS", source: "Sistema", note: "Todos os documentos válidos. Aguardando agendamento de exame." },
    ],
  },
  {
    id: "12", name: "Larissa Pereira", client: "SMS", status: "EXAME_REALIZADO",
    linkSentAt: "2026-06-06", stageEnteredAt: "2026-06-14", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "06/06 10:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "07/06 09:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "08/06 14:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "10/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "14/06 11:00", status: "EXAME_REALIZADO", source: "SOC", note: "Presença confirmada. Aguardando emissão do ASO." },
    ],
  },
  {
    id: "13", name: "Gabriel Souza", client: "Shopee", status: "CONTRATO_ASSINADO",
    linkSentAt: "2026-06-04", stageEnteredAt: "2026-06-14", admissionType: "com_portal",
    timeline: [
      { id: "t1", timestamp: "04/06 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "05/06 08:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "06/06 10:00", status: "DOCS_COMPLETOS", source: "Sistema" },
      { id: "t4", timestamp: "08/06 09:00", status: "EXAME_AGENDADO", source: "Manual", user: "Ana Carolina" },
      { id: "t5", timestamp: "11/06 14:00", status: "EXAME_REALIZADO", source: "SOC" },
      { id: "t6", timestamp: "12/06 08:00", status: "ASO_EMITIDO", source: "SOC" },
      { id: "t7", timestamp: "13/06 10:00", status: "CONTRATO_ENVIADO", source: "D4Sign" },
      { id: "t8", timestamp: "14/06 14:00", status: "CONTRATO_ASSINADO", source: "D4Sign" },
    ],
  },
  {
    id: "14", name: "Priya Kumar", client: "Shopee", status: "DOCS_PENDENTES",
    linkSentAt: "2026-06-10", stageEnteredAt: "2026-06-11", admissionType: "simples",
    pendingDocs: ["RG (ilegível — OCR não reconheceu texto)"],
    notes: "Candidata estrangeira — notificações em espanhol (flag ativa). Sem resposta nas últimas 48h.",
    timeline: [
      { id: "t1", timestamp: "10/06 14:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "11/06 09:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "11/06 11:00", status: "DOCS_PENDENTES", source: "Sistema", note: "RG ilegível. Notificação enviada via Blip em espanhol." },
      { id: "t4", timestamp: "12/06 11:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 24h enviado (ES)." },
      { id: "t5", timestamp: "13/06 11:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 48h enviado (ES)." },
      { id: "t6", timestamp: "14/06 11:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 72h (ES). Última tentativa automática." },
    ],
  },
  {
    id: "15", name: "Tatiane Melo", client: "SMS", status: "ABANDONADO",
    linkSentAt: "2026-05-30", stageEnteredAt: "2026-06-05", admissionType: "simples",
    timeline: [
      { id: "t1", timestamp: "30/05 09:00", status: "LINK_ENVIADO", source: "IEM" },
      { id: "t2", timestamp: "01/06 10:00", status: "UPLOAD_INICIADO", source: "IEM" },
      { id: "t3", timestamp: "02/06 14:00", status: "DOCS_PENDENTES", source: "Sistema", note: "Comprovante de residência emitido há >90 dias." },
      { id: "t4", timestamp: "03/06 14:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 24h." },
      { id: "t5", timestamp: "04/06 14:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 48h." },
      { id: "t6", timestamp: "05/06 14:00", status: "DOCS_PENDENTES", source: "Blip", note: "Lembrete 72h (última tentativa)." },
      { id: "t7", timestamp: "05/06 15:00", status: "ABANDONADO", source: "Manual", user: "Ana Carolina", note: "Sem resposta após 3 tentativas. Candidata não retornou contato." },
    ],
  },
];

// ─── Small shared components ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function AdmBadge({ type }: { type: AdmissionType }) {
  const cfg = ADMISSION_LABELS[type];
  return (
    <span title={cfg.label} className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${cfg.cls}`}>
      {cfg.abbr}
    </span>
  );
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none`}>
      {getInitials(name)}
    </div>
  );
}

function StatCard({ label, value, sub, variant = "default" }: {
  label: string; value: number | string; sub?: string;
  variant?: "default" | "amber" | "red" | "green" | "indigo";
}) {
  const valueColor = { default: "text-[#0f172b]", amber: "text-amber-600", red: "text-red-600", green: "text-green-600", indigo: "text-indigo-600" }[variant];
  const accent = { default: "", amber: "border-t-2 border-t-amber-400", red: "border-t-2 border-t-red-400", green: "border-t-2 border-t-green-400", indigo: "border-t-2 border-t-indigo-400" }[variant];
  return (
    <div className={`bg-white rounded-xl p-4 border border-slate-200 shadow-sm ${accent}`}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-bold leading-none ${valueColor}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-1.5">{sub}</p>}
    </div>
  );
}

// ─── Modal: Agendar Exame (RF-19) ─────────────────────────────────────────────

interface ExamModalProps {
  candidate: Candidate;
  onConfirm: (data: { date: string; time: string; clinic: string; guide: string }) => void;
  onClose: () => void;
}

function ExamModal({ candidate, onConfirm, onClose }: ExamModalProps) {
  const [date, setDate] = useState("2026-06-18");
  const [time, setTime] = useState("14:00");
  const [clinic, setClinic] = useState("");
  const [guide, setGuide] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    if (!clinic.trim() || !guide.trim()) {
      setError("Clínica e número da guia são obrigatórios.");
      return;
    }
    onConfirm({ date, time, clinic: clinic.trim(), guide: guide.trim() });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0f172b]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-[#0f172b] text-[15px]">Agendar Exame — SOC</h3>
            <p className="text-xs text-slate-400 mt-0.5">{candidate.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Data do exame</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Horário</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Clínica / Endereço</label>
            <input type="text" value={clinic} onChange={e => setClinic(e.target.value)}
              placeholder="Ex: Clínica Saúde Total — Rua XV, 300"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Número da guia SOC</label>
            <input type="text" value={guide} onChange={e => setGuide(e.target.value)}
              placeholder="Ex: 88421"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
            Ao confirmar, o candidato receberá automaticamente data, horário, endereço e guia via Blip (WhatsApp).
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-slate-200 bg-slate-50">
          <button onClick={onClose}
            className="flex-1 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg py-2 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleConfirm}
            className="flex-1 text-sm font-semibold text-white bg-indigo-600 rounded-lg py-2 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Confirmar agendamento
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Bloquear / Abandonar (RF-20) ──────────────────────────────────────

interface BlockModalProps {
  candidate: Candidate;
  onConfirm: (targetStatus: "BLOQUEADO" | "ABANDONADO", reason: string) => void;
  onClose: () => void;
}

function BlockModal({ candidate, onConfirm, onClose }: BlockModalProps) {
  const [targetStatus, setTargetStatus] = useState<"BLOQUEADO" | "ABANDONADO">("BLOQUEADO");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    if (!reason.trim()) {
      setError("O motivo é obrigatório para auditoria.");
      return;
    }
    onConfirm(targetStatus, reason.trim());
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0f172b]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-[#0f172b] text-[15px]">Encerrar processo</h3>
            <p className="text-xs text-slate-400 mt-0.5">{candidate.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Tipo de encerramento</label>
            <div className="grid grid-cols-2 gap-2">
              {(["BLOQUEADO", "ABANDONADO"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setTargetStatus(s)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${
                    targetStatus === s
                      ? s === "BLOQUEADO"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s === "BLOQUEADO" ? <Ban className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {targetStatus === "BLOQUEADO"
                ? "Use para: ASO inapto, documento inválido sem correção, no-show confirmado."
                : "Use para: candidato sem atividade após N dias, desistência confirmada."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Motivo <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Descreva o motivo para fins de auditoria…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-slate-200 bg-slate-50">
          <button onClick={onClose}
            className="flex-1 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg py-2 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleConfirm}
            className="flex-1 text-sm font-semibold text-white bg-red-600 rounded-lg py-2 hover:bg-red-700 transition-colors">
            Confirmar encerramento
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Drawer ───────────────────────────────────────────────────────────

interface DrawerProps {
  candidate: Candidate;
  onClose: () => void;
  onOpenExamModal: () => void;
  onOpenBlockModal: () => void;
  onSaveNotes: (notes: string) => void;
  onMarkAttended: () => void;
}

function TimelineDrawer({ candidate, onClose, onOpenExamModal, onOpenBlockModal, onSaveNotes, onMarkAttended }: DrawerProps) {
  const hours = hoursInStage(candidate.stageEnteredAt);
  const alert = isAlert(candidate);
  const reversed = [...candidate.timeline].reverse();

  const [editingNotes, setEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(candidate.notes ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraftNotes(candidate.notes ?? "");
    setEditingNotes(false);
  }, [candidate.id, candidate.notes]);

  useEffect(() => {
    if (editingNotes) textareaRef.current?.focus();
  }, [editingNotes]);

  function handleSaveNotes() {
    onSaveNotes(draftNotes);
    setEditingNotes(false);
    toast.success("Observações salvas.");
  }

  const canScheduleExam = candidate.status === "DOCS_COMPLETOS";
  const canBlock = !TERMINAL_STATUSES.includes(candidate.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#0f172b]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-[460px] h-full flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name={candidate.name} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[15px] text-[#0f172b]">{candidate.name}</h2>
                {candidate.helpRequested && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                    <HelpCircle className="w-3 h-3" /> AJUDA
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <StatusBadge status={candidate.status} />
                <AdmBadge type={candidate.admissionType} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors mt-0.5">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Meta strip */}
        <div className="flex items-center gap-5 px-5 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5" />
            {candidate.client}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            Link: {candidate.linkSentAt.slice(5).replace("-", "/")}
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${alert ? "text-red-600 font-semibold" : "text-slate-500"}`}>
            <Clock className="w-3.5 h-3.5" />
            Na etapa há {formatDuration(hours)}
            {alert && <AlertTriangle className="w-3 h-3 ml-0.5" />}
          </div>
        </div>

        {/* AJUDA alert */}
        {candidate.helpRequested && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-200 shrink-0">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-red-700">Candidato solicitou atendimento humano</p>
                <p className="text-[11px] text-red-600 mt-0.5">Respondeu "AJUDA" via Blip em 14/06 10:22. Contate diretamente antes de reenviar mensagens automáticas.</p>
              </div>
              <button
                onClick={onMarkAttended}
                className="shrink-0 text-[11px] font-semibold text-red-700 border border-red-300 bg-white px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                Marcar atendido
              </button>
            </div>
          </div>
        )}

        {/* Pending docs */}
        {candidate.pendingDocs && candidate.pendingDocs.length > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 shrink-0">
            <p className="text-[11px] font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">Documentos pendentes</p>
            <ul className="space-y-1">
              {candidate.pendingDocs.map((doc, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-amber-800">
                  <XCircle className="w-3.5 h-3.5 shrink-0 mt-px text-amber-500" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Linha do Tempo</p>
          {reversed.map((ev, i) => (
            <div key={ev.id} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow ${STATUS_CONFIG[ev.status].dot}`} />
                {i < reversed.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[12px]" />}
              </div>
              <div className="pb-4 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <StatusBadge status={ev.status} />
                  <span className="text-[10px] text-slate-400">
                    {SOURCE_EMOJI[ev.source]} {ev.source}{ev.user ? ` — ${ev.user}` : ""}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-1">{ev.timestamp}</p>
                {ev.note && (
                  <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed">
                    {ev.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notes (RF-23) */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Observações do analista</p>
            {!editingNotes && (
              <button onClick={() => setEditingNotes(true)}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">
                <Pencil className="w-3 h-3" /> Editar
              </button>
            )}
          </div>
          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={draftNotes}
                onChange={e => setDraftNotes(e.target.value)}
                rows={3}
                placeholder="Adicione observações internas sobre este candidato…"
                className="w-full text-xs border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none bg-white"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveNotes}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Save className="w-3 h-3" /> Salvar
                </button>
                <button onClick={() => { setDraftNotes(candidate.notes ?? ""); setEditingNotes(false); }}
                  className="text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed min-h-[2rem]">
              {candidate.notes || <span className="text-slate-300 italic">Sem observações. Clique em Editar para adicionar.</span>}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-200 flex gap-2 shrink-0">
          {canScheduleExam && (
            <button onClick={onOpenExamModal}
              className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Agendar Exame (SOC)
            </button>
          )}
          {(["LINK_ENVIADO", "UPLOAD_INICIADO", "DOCS_PENDENTES"] as Status[]).includes(candidate.status) && (
            <button
              onClick={() => { toast.success(`Notificação enviada via Blip para ${candidate.name}.`); }}
              className="flex-1 bg-[#1d293d] text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-[#0f172b] transition-colors flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Reenviar via Blip
            </button>
          )}
          {canBlock && (
            <button onClick={onOpenBlockModal}
              className="px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Encerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [clientFilter, setClientFilter] = useState("");
  const [alertsOnly, setAlertsOnly] = useState(false);

  // RF-28: detect shared-link token in URL — go directly to operations view
  const urlParams = new URLSearchParams(window.location.search);
  const isSharedLink = urlParams.get("view") === "operacao" && !!urlParams.get("token");
  const [activeView, setActiveView] = useState<NavView>(isSharedLink ? "operacao" : "analista");

  const selected = candidates.find(c => c.id === selectedId) ?? null;

  // ESC closes modals → drawer → nothing
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (examModalOpen) { setExamModalOpen(false); return; }
      if (blockModalOpen) { setBlockModalOpen(false); return; }
      if (selectedId) { setSelectedId(null); return; }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [examModalOpen, blockModalOpen, selectedId]);

  function handleMarkAttended() {
    if (!selected) return;
    updateCandidate(selected.id, { helpRequested: false });
    toast.success(`Atendimento registrado para ${selected.name}.`);
  }

  const stats = useMemo(() => ({
    total: candidates.length,
    docsPendentes: candidates.filter(c => c.status === "DOCS_PENDENTES").length,
    criticos: candidates.filter(c => isAlert(c)).length,
    examesAgendados: candidates.filter(c => c.status === "EXAME_AGENDADO").length,
    admitidos: candidates.filter(c => c.status === "ADMITIDO").length,
    helpCount: candidates.filter(c => c.helpRequested).length,
  }), [candidates]);

  const filtered = useMemo(() => candidates.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.client.toLowerCase().includes(q)) return false;
    }
    if (statusFilter && c.status !== statusFilter) return false;
    if (clientFilter && c.client !== clientFilter) return false;
    if (alertsOnly && !isAlert(c)) return false;
    return true;
  }), [candidates, search, statusFilter, clientFilter, alertsOnly]);

  const statusCounts = useMemo(() =>
    Object.fromEntries(
      (Object.keys(STATUS_CONFIG) as Status[]).map(s => [s, candidates.filter(c => c.status === s).length])
    ), [candidates]
  );

  function updateCandidate(id: string, patch: Partial<Candidate>) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    if (selectedId === id) {
      // keep drawer in sync (selectedId unchanged, candidate object updated via `candidates` state)
    }
  }

  function handleExamConfirm(data: { date: string; time: string; clinic: string; guide: string }) {
    if (!selected) return;
    const formattedDate = data.date.slice(8, 10) + "/" + data.date.slice(5, 7);
    const note = `${data.clinic} — ${formattedDate} às ${data.time} — Guia ${data.guide}. Notificação com guia PDF enviada via Blip.`;
    const newEvent: TimelineEvent = {
      id: "t" + Date.now(),
      timestamp: nowTimestamp(),
      status: "EXAME_AGENDADO",
      source: "Manual",
      user: "Ana Carolina",
      note,
    };
    updateCandidate(selected.id, {
      status: "EXAME_AGENDADO",
      stageEnteredAt: "2026-06-16",
      timeline: [...selected.timeline, newEvent],
    });
    setExamModalOpen(false);
    toast.success(`Exame agendado para ${selected.name}. Notificação enviada via Blip.`);
  }

  function handleBlockConfirm(targetStatus: "BLOQUEADO" | "ABANDONADO", reason: string) {
    if (!selected) return;
    const newEvent: TimelineEvent = {
      id: "t" + Date.now(),
      timestamp: nowTimestamp(),
      status: targetStatus,
      source: "Manual",
      user: "Ana Carolina",
      note: reason,
    };
    updateCandidate(selected.id, {
      status: targetStatus,
      stageEnteredAt: "2026-06-16",
      timeline: [...selected.timeline, newEvent],
    });
    setBlockModalOpen(false);
    toast.success(`${selected.name} marcado como ${STATUS_CONFIG[targetStatus].label}.`);
  }

  function handleSaveNotes(notes: string) {
    if (!selected) return;
    updateCandidate(selected.id, { notes });
  }

  function handleExportCSV() {
    const csv = generateCSV(filtered);
    downloadCSV(csv, `candidatos-gi-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`CSV exportado — ${filtered.length} candidato${filtered.length !== 1 ? "s" : ""}.`);
  }

  // RF-28: standalone mode (accessed via shared link — no analyst sidebar)
  if (isSharedLink) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Toaster position="bottom-right" richColors />
        <OperacaoPanel candidates={candidates} standalone />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="bottom-right" richColors />

      {/* Sidebar with navigation */}
      <div className="h-full w-64 shrink-0">
        <AppSidebar
          activeView={activeView}
          onViewChange={v => { setActiveView(v); setSelectedId(null); }}
          alertCount={stats.criticos}
        />
      </div>

      {/* Animated panel switcher */}
      <AnimatePresence mode="wait" initial={false}>

      {/* Operations view */}
      {activeView === "operacao" && (
        <motion.div
          key="operacao"
          className="flex-1 flex overflow-hidden"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <OperacaoPanel candidates={candidates} />
        </motion.div>
      )}

      {/* Analyst view */}
      {activeView === "analista" && (
        <motion.div
          key="analista"
          className="flex-1 flex flex-col overflow-hidden bg-[#f1f5f9]"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >

          {/* Top bar */}
          <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-slate-400" />
              <h1 className="text-[15px] font-semibold text-[#0f172b]">Painel do Analista</h1>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-400">16 de junho de 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-4 h-4 text-slate-500" />
                {stats.helpCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {stats.helpCount}
                  </span>
                )}
              </button>
              <button onClick={handleExportCSV}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Exportar CSV
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-5">

              {/* Stats */}
              <div className="grid grid-cols-5 gap-4">
                <StatCard label="Total" value={stats.total} sub="candidatos no lote" />
                <StatCard label="Docs Pendentes" value={stats.docsPendentes} sub="aguardando reenvio" variant="amber" />
                <StatCard label="Críticos" value={stats.criticos} sub="parados há +48h" variant="red" />
                <StatCard label="Exames" value={stats.examesAgendados} sub="agendados no SOC" variant="indigo" />
                <StatCard label="Admitidos" value={stats.admitidos} sub="concluídos este mês" variant="green" />
              </div>

              {/* Help alert banner (RF-15) */}
              {stats.helpCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">{stats.helpCount} candidato{stats.helpCount > 1 ? "s" : ""}</span> solicitou atendimento humano via Blip respondendo "AJUDA". Verifique as linhas destacadas abaixo.
                  </p>
                </div>
              )}

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar candidato ou cliente…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d293d]/20 focus:border-[#1d293d] w-56"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as Status | "")}
                  className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d293d]/20"
                >
                  <option value="">Todos os status</option>
                  {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([k, v]) => (
                    <option key={k} value={k}>{v.label} ({statusCounts[k]})</option>
                  ))}
                </select>
                <select
                  value={clientFilter}
                  onChange={e => setClientFilter(e.target.value)}
                  className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d293d]/20"
                >
                  <option value="">Todos os clientes</option>
                  <option value="Shopee">Shopee</option>
                  <option value="SMS">SMS</option>
                </select>
                <button
                  onClick={() => setAlertsOnly(!alertsOnly)}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    alertsOnly ? "bg-red-50 border-red-300 text-red-700 font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Somente críticos
                </button>
                <span className="ml-auto text-xs text-slate-400">
                  {filtered.length} de {candidates.length} candidato{candidates.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="w-8 pl-4" />
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Candidato</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Cliente</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Na etapa</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Tipo</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(c => {
                      const hours = hoursInStage(c.stageEnteredAt);
                      const alert = isAlert(c);
                      const isHelp = c.helpRequested;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedId(c.id)}
                          className={`cursor-pointer transition-colors ${
                            isHelp ? "bg-red-50/60 hover:bg-red-50" : alert ? "hover:bg-amber-50/40" : "hover:bg-slate-50"
                          } ${selectedId === c.id ? "ring-1 ring-inset ring-indigo-300" : ""}`}
                        >
                          <td className="pl-4 py-3 w-8">
                            {isHelp
                              ? <HelpCircle className="w-3.5 h-3.5 text-red-500" />
                              : alert
                                ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                : null}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={c.name} />
                              <span className="text-sm font-medium text-[#0f172b]">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">{c.client}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={c.status} />
                            {c.pendingDocs && c.pendingDocs.length > 0 && (
                              <p className="text-[10px] text-amber-600 mt-0.5">{c.pendingDocs.length} doc{c.pendingDocs.length > 1 ? "s" : ""} pendente{c.pendingDocs.length > 1 ? "s" : ""}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm tabular-nums ${alert ? "text-red-600 font-semibold" : "text-slate-500"}`}>
                              {formatDuration(hours)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <AdmBadge type={c.admissionType} />
                          </td>
                          <td className="pr-4">
                            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-14 text-center">
                    <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Nenhum candidato para os filtros selecionados.</p>
                  </div>
                )}
              </div>

              {/* Status distribution */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Distribuição por etapa — clique para filtrar</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([s, cfg]) => {
                    if (!statusCounts[s]) return null;
                    const active = statusFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(active ? "" : s)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                          active ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm` : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                        <span className={`text-[10px] font-bold px-1 rounded ${active ? "bg-white/50" : "bg-slate-100 text-slate-500"}`}>
                          {statusCounts[s]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      </AnimatePresence>

      {/* Timeline Drawer — outside AnimatePresence so it overlays both views */}
      {selected && activeView === "analista" && (
        <TimelineDrawer
          candidate={selected}
          onClose={() => setSelectedId(null)}
          onOpenExamModal={() => setExamModalOpen(true)}
          onOpenBlockModal={() => setBlockModalOpen(true)}
          onSaveNotes={handleSaveNotes}
          onMarkAttended={handleMarkAttended}
        />
      )}

      {/* Modal: Agendar Exame (RF-19) */}
      {examModalOpen && selected && (
        <ExamModal
          candidate={selected}
          onConfirm={handleExamConfirm}
          onClose={() => setExamModalOpen(false)}
        />
      )}

      {/* Modal: Bloquear / Abandonar (RF-20) */}
      {blockModalOpen && selected && (
        <BlockModal
          candidate={selected}
          onConfirm={handleBlockConfirm}
          onClose={() => setBlockModalOpen(false)}
        />
      )}
    </div>
  );
}
