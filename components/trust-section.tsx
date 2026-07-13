import { ClipboardCheck, Handshake, MessagesSquare, Workflow } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const pillars = [
  {
    icon: ClipboardCheck,
    title: 'Professional Planning',
    description: 'Every detail mapped, scheduled and owned — so nothing is left to chance.',
  },
  {
    icon: Handshake,
    title: 'Trusted Vendors',
    description: 'A carefully vetted network of decorators, caterers and specialists.',
  },
  {
    icon: MessagesSquare,
    title: 'Transparent Communication',
    description: 'Clear updates and honest pricing at every stage of your event.',
  },
  {
    icon: Workflow,
    title: 'Seamless Execution',
    description: 'Calm, coordinated delivery on the day, managed end to end.',
  },
]

export function TrustSection() {
  return (
    <section className="relative border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Why families & teams choose us
          </p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
            Clarity, replacing the chaos of planning.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 90}
              as="article"
              className="group h-full rounded-3xl border border-border bg-card p-7 shadow-[0_1px_2px_rgba(31,42,68,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(31,42,68,0.28)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                <pillar.icon className="h-6 w-6" />
              </span>
              <h3 className="font-heading mt-5 text-lg font-semibold text-primary">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
