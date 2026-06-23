interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}

function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`h-2 bg-gi-border rounded-full overflow-hidden ${className ?? ''}`}>
      <div className="h-full bg-gi-blue rounded-full" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
