import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:   'bg-gi-blue text-white hover:bg-gi-navy disabled:opacity-50',
  secondary: 'border border-gi-navy text-gi-navy hover:bg-gi-light disabled:opacity-50',
  ghost:     'text-gi-blue hover:underline disabled:opacity-50',
}

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button
