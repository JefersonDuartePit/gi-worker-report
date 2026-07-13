type StatCardAccent = 'default' | 'amber' | 'red' | 'green' | 'blue'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: StatCardAccent
}

const ACCENT_BORDER: Record<StatCardAccent, string> = {
  default: '',
  amber: 'border-t-2 border-t-gi-amber',
  red: 'border-t-2 border-t-gi-red',
  green: 'border-t-2 border-t-gi-green',
  blue: 'border-t-2 border-t-gi-blue',
}

function StatCard({ label, value, sub, accent = 'default' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 border border-gi-border shadow-sm ${ACCENT_BORDER[accent]}`}>
      <p className="text-[10px] font-bold text-gi-charcoal uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-bold leading-none text-gi-navy">{value}</p>
      {sub && <p className="text-[11px] text-gi-charcoal mt-1.5">{sub}</p>}
    </div>
  )
}

export default StatCard
