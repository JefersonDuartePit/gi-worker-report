import svgPaths from "@/imports/Sidebar/svg-fg9u7nyk7h";
import { ClipboardList, BarChart3 } from "lucide-react";
import type { NavView } from "../types";

interface AppSidebarProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  alertCount?: number;
}

const NAV_ITEMS: { id: NavView; label: string; Icon: React.ElementType }[] = [
  { id: "analista",  label: "Painel Analista",  Icon: ClipboardList },
  { id: "operacao",  label: "Painel Operação",  Icon: BarChart3     },
];

export function AppSidebar({ activeView, onViewChange, alertCount = 0 }: AppSidebarProps) {
  return (
    <div className="bg-[#0f172b] flex flex-col h-full w-full">

      {/* Logo — same SVG structure as the Figma import */}
      <div className="h-[105px] relative shrink-0">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 256 105"
        >
          <mask fill="white" id="gi-logo-mask">
            <path d="M0 0H256V105H0V0Z" />
          </mask>
          {/* bottom divider line */}
          <path d={svgPaths.p108c4c00} fill="#1D293D" mask="url(#gi-logo-mask)" />
          {/* Gi mark */}
          <path clipRule="evenodd" d={svgPaths.p2d87c00}  fill="white" fillRule="evenodd" />
          {/* C-O-N-E-C-T-A */}
          <path d={svgPaths.paeb3500}  fill="white" />
          <path clipRule="evenodd" d={svgPaths.p265da600} fill="white" fillRule="evenodd" />
          <path d={svgPaths.p19299900} fill="white" />
          <path d={svgPaths.p37de44b0} fill="white" />
          <path d={svgPaths.p1a129880} fill="white" />
          <path d={svgPaths.p1ac38900} fill="white" />
          <path clipRule="evenodd" d={svgPaths.p20894500} fill="white" fillRule="evenodd" />
        </svg>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              activeView === id
                ? "bg-[#1d293d] text-white"
                : "text-[#90a1b9] hover:bg-[#1d293d]/60 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-[14px] font-medium tracking-[-0.01em]">{label}</span>
            {id === "operacao" && alertCount > 0 && (
              <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shrink-0">
                {alertCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User info — mirrors the Figma Container1 */}
      <div className="shrink-0 border-t border-[#1d293d] px-4 py-[17px]">
        <div className="flex items-center gap-3">
          <div className="bg-[#314158] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="text-[#e2e8f0] text-sm font-medium">RH</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[14px] font-medium leading-5 truncate">Ana Carolina</p>
            <p className="text-[#90a1b9] text-xs leading-4">Analista CARE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
