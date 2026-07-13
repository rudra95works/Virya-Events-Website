import { Reveal } from '@/components/reveal'

const steps = [
  {
    number: '01',
    title: 'Tell us about your event.',
    description: 'Share your occasion, guest count, ideas and budget. We listen closely.',
  },
  {
    number: '02',
    title: 'Receive a customized proposal.',
    description: 'We return with a tailored plan, curated vendors and transparent pricing.',
  },
  {
    number: '03',
    title: 'Finalize every detail.',
    description: 'We refine the plan together and lock in every element with you.',
  },
  {
    number: '04',
    title: 'Enjoy your celebration.',
    description: 'On the day, we manage everything — you simply enjoy the moment.',
  },
]

export function HowItWorks() {
  return (
    <section className="relative border-b border-border bg-primary py-20 text-primary-foreground md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            How it works
          </p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold sm:text-4xl">
            Four simple steps to a seamless event.
          </h2>
        </Reveal>

        <ol className="mt-14 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-6">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 110} as="li" className="relative">
              <div className="flex items-center gap-4">
                <span className="font-heading text-2xl font-semibold text-accent">
                  {step.number}
                </span>
                <span className="h-px flex-1 bg-primary-foreground/15" aria-hidden="true" />
              </div>
              <h3 className="font-heading mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
