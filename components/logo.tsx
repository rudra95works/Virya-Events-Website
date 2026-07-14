import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/virya-logo.png"
      alt="Virya Events"
      width={160}
      height={160}
      priority
      className={cn('shrink-0 object-contain', className)}
    />
  )
}
