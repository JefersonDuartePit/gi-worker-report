interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  fillClassName?: string
}

function ProgressBar({ value, max = 100, className, fillClassName = 'bg-gi-blue' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`h-2 bg-gi-border rounded-full overflow-hidden ${className ?? ''}`}>
      <div className={`h-full ${fillClassName} rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
