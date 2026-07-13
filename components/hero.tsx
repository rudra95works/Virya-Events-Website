import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="home" className="relative min-h-svh w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-event.png"
          alt="A beautifully decorated premium celebration venue with warm lighting"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/80" />
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      {/* Floating decorative elements */}
      <div
        aria-hidden="true"
        className="absolute left-[8%] top-[26%] hidden h-24 w-24 animate-[float_9s_ease-in-out_infinite] rounded-full border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur-sm md:block"
      />
      <div
        aria-hidden="true"
        className="absolute right-[10%] top-[32%] hidden h-16 w-16 animate-[float_7s_ease-in-out_infinite_reverse] rounded-2xl border border-accent/30 bg-accent/10 backdrop-blur-sm lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[18%] right-[18%] hidden h-3 w-3 animate-[float_6s_ease-in-out_infinite] rounded-full bg-accent md:block"
      />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center px-5 py-28 text-center lg:px-8">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/90 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Premium Event Management
        </span>

        <h1 className="font-heading max-w-4xl text-balance text-4xl font-semibold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl">
          Every Celebration Deserves to Be Remembered.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
          Professional event planning and management for birthdays, corporate events, housewarming
          ceremonies and private celebrations.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'group h-12 rounded-full bg-accent px-7 text-base font-semibold text-accent-foreground hover:bg-accent/90',
            )}
          >
            Get a Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#services"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'h-12 rounded-full border-primary-foreground/30 bg-primary-foreground/5 px-7 text-base font-medium text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/15 hover:text-primary-foreground',
            )}
          >
            Explore Services
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <span className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60">
          Scroll
        </span>
      </div>
    </section>
  )
}
