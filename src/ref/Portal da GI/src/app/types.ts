export type Status =
  | "LINK_ENVIADO" | "UPLOAD_INICIADO" | "DOCS_PENDENTES" | "DOCS_COMPLETOS"
  | "EXAME_AGENDADO" | "EXAME_REALIZADO" | "ASO_EMITIDO" | "CONTRATO_ENVIADO"
  | "CONTRATO_ASSINADO" | "MATRICULA_GERADA" | "ADMITIDO" | "BLOQUEADO" | "ABANDONADO";

export type AdmissionType = "simples" | "com_portal" | "com_treinamento";
export type EventSource = "IEM" | "SOC" | "D4Sign" | "GINFOR" | "Manual" | "Blip" | "Sistema";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: Status;
  source: EventSource;
  user?: string;
  note?: string;
}

export interface Candidate {
  id: string;
  name: string;
  client: string;
  status: Status;
  linkSentAt: string;
  stageEnteredAt: string;
  admissionType: AdmissionType;
  pendingDocs?: string[];
  timeline: TimelineEvent[];
  notes?: string;
  helpRequested?: boolean;
}

export type NavView = "analista" | "operacao";

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; dot: string; border: string; hex: string }> = {
  LINK_ENVIADO:      { label: "Link Enviado",      color: "text-slate-700",   bg: "bg-slate-100",   dot: "bg-slate-400",   border: "border-slate-300",   hex: "#94a3b8" },
  UPLOAD_INICIADO:   { label: "Upload Iniciado",    color: "text-blue-700",    bg: "bg-blue-50",     dot: "bg-blue-400",    border: "border-blue-200",    hex: "#60a5fa" },
  DOCS_PENDENTES:    { label: "Docs Pendentes",     color: "text-amber-700",   bg: "bg-amber-50",    dot: "bg-amber-400",   border: "border-amber-200",   hex: "#fbbf24" },
  DOCS_COMPLETOS:    { label: "Docs Completos",     color: "text-teal-700",    bg: "bg-teal-50",     dot: "bg-teal-500",    border: "border-teal-200",    hex: "#2dd4bf" },
  EXAME_AGENDADO:    { label: "Exame Agendado",     color: "text-indigo-700",  bg: "bg-indigo-50",   dot: "bg-indigo-500",  border: "border-indigo-200",  hex: "#818cf8" },
  EXAME_REALIZADO:   { label: "Exame Realizado",    color: "text-violet-700",  bg: "bg-violet-50",   dot: "bg-violet-500",  border: "border-violet-200",  hex: "#a78bfa" },
  ASO_EMITIDO:       { label: "ASO Emitido",        color: "text-sky-700",     bg: "bg-sky-50",      dot: "bg-sky-500",     border: "border-sky-200",     hex: "#38bdf8" },
  CONTRATO_ENVIADO:  { label: "Contrato Enviado",   color: "text-blue-700",    bg: "bg-blue-50",     dot: "bg-blue-500",    border: "border-blue-200",    hex: "#3b82f6" },
  CONTRATO_ASSINADO: { label: "Contrato Assinado",  color: "text-green-700",   bg: "bg-green-50",    dot: "bg-green-500",   border: "border-green-200",   hex: "#4ade80" },
  MATRICULA_GERADA:  { label: "Matrícula Gerada",   color: "text-emerald-700", bg: "bg-emerald-50",  dot: "bg-emerald-500", border: "border-emerald-200", hex: "#34d399" },
  ADMITIDO:          { label: "Admitido",           color: "text-green-800",   bg: "bg-green-100",   dot: "bg-green-600",   border: "border-green-300",   hex: "#16a34a" },
  BLOQUEADO:         { label: "Bloqueado",          color: "text-red-700",     bg: "bg-red-50",      dot: "bg-red-500",     border: "border-red-200",     hex: "#ef4444" },
  ABANDONADO:        { label: "Abandonado",         color: "text-gray-500",    bg: "bg-gray-100",    dot: "bg-gray-400",    border: "border-gray-200",    hex: "#9ca3af" },
};

export const ADMISSION_LABELS: Record<AdmissionType, { label: string; abbr: string; cls: string }> = {
  simples:         { label: "Simples",         abbr: "S", cls: "bg-slate-100 text-slate-600"  },
  com_portal:      { label: "Com Portal",      abbr: "P", cls: "bg-blue-50 text-blue-600"     },
  com_treinamento: { label: "Com Treinamento", abbr: "T", cls: "bg-purple-50 text-purple-600" },
};

// Hours expected per stage (SLA baseline)
export const SLA_HOURS: Partial<Record<Status, number>> = {
  LINK_ENVIADO:      24,
  UPLOAD_INICIADO:   48,
  DOCS_PENDENTES:    72,
  DOCS_COMPLETOS:    24,
  EXAME_AGENDADO:   120,
  EXAME_REALIZADO:   48,
  ASO_EMITIDO:       24,
  CONTRATO_ENVIADO:  48,
  CONTRATO_ASSINADO: 24,
  MATRICULA_GERADA:  24,
};

export const STAGE_ORDER: Status[] = [
  "LINK_ENVIADO", "UPLOAD_INICIADO", "DOCS_PENDENTES", "DOCS_COMPLETOS",
  "EXAME_AGENDADO", "EXAME_REALIZADO", "ASO_EMITIDO", "CONTRATO_ENVIADO",
  "CONTRATO_ASSINADO", "MATRICULA_GERADA", "ADMITIDO",
];

export const TERMINAL_STATUSES: Status[] = ["ADMITIDO", "BLOQUEADO", "ABANDONADO"];
