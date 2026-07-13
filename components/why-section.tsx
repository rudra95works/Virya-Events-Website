import Image from 'next/image'
import { UserCheck, Network, SlidersHorizontal, MessageSquareText, ShieldCheck, ListChecks } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const reasons = [
  { icon: UserCheck, title: 'One Point of Contact', description: 'A single dedicated coordinator for your entire event.' },
  { icon: Network, title: 'Trusted Vendor Network', description: 'Reliable, vetted partners we work with time and again.' },
  { icon: SlidersHorizontal, title: 'Customized Planning', description: 'Plans shaped around your vision, guests and budget.' },
  { icon: MessageSquareText, title: 'Clear Communication', description: 'Straightforward updates with no jargon or surprises.' },
  { icon: ShieldCheck, title: 'Reliable Execution', description: 'Dependable delivery you can count on, every time.' },
  { icon: ListChecks, title: 'Professional Coordination', description: 'Every moving part managed with precision and calm.' },
]

export function WhySection() {
  return (
    <section id="about" className="relative border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Why Virya Events
          </p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
            A calmer, more considered way to plan.
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            We built Virya Events around a simple promise — no stress, no confusion, professional
            execution. Here is what that looks like in practice.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 70} className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <reason.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-primary">
                    {reason.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={120}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_60px_-30px_rgba(31,42,68,0.4)]">
            <Image
              src="/images/about-planning.png"
              alt="Elegant event planning materials including a mood board, fabric swatches and floral sketches"
              width={900}
              height={1100}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-6 rounded-3xl border border-border bg-muted/50 p-6">
            <p className="font-heading text-lg font-medium leading-relaxed text-primary">
              &ldquo;No stress. No confusion. Professional execution.&rdquo;
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Our promise on every event.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
