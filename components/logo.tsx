import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      {/* Stylised 'V' */}
      <path
        d="M11 12L20 28L29 12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="12" r="2.1" fill="var(--accent)" />
    </svg>
  )
}
