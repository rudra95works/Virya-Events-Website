'use client'

import { useState, type FormEvent } from 'react'
import { Phone, Mail, MessageCircle, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

const channels = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@viryaevents.com',
    href: 'mailto:hello@viryaevents.com',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/919876543210',
  },
]

const eventTypes = [
  'Birthday Party',
  'Corporate Event',
  'Housewarming',
  'Engagement',
  'Private Celebration',
  'Other',
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="relative border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: intro + channels */}
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
              Get in touch
            </p>
            <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
              Let&apos;s plan something unforgettable.
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Tell us a little about your event and we&apos;ll respond with a customized proposal.
              No stress, no confusion — just a clear next step.
            </p>

            <div className="mt-10 space-y-3">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.label === 'WhatsApp' ? '_blank' : undefined}
                  rel={channel.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_16px_36px_-24px_rgba(31,42,68,0.35)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                    <channel.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      {channel.label}
                    </span>
                    <span className="font-heading text-base font-medium text-primary">
                      {channel.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={120}>
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_30px_60px_-36px_rgba(31,42,68,0.4)] sm:p-8">
              {submitted ? (
                <div className="flex min-h-80 flex-col items-center justify-center text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-7 w-7" />
                  </span>
                  <h3 className="font-heading mt-5 text-xl font-semibold text-primary">
                    Thank you — request received.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    We&apos;ve noted your details and will be in touch shortly with a customized
                    proposal for your celebration.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-heading text-xl font-semibold text-primary">
                    Request a Quote
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field id="name" label="Full name">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </Field>
                    <Field id="phone" label="Phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        className={inputClass}
                        placeholder="+91 ..."
                      />
                    </Field>
                  </div>

                  <Field id="email" label="Email">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field id="eventType" label="Event type">
                    <select id="eventType" name="eventType" required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select an event type
                      </option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="message" label="Tell us about your event">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Date, guest count, ideas, budget…"
                    />
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="group h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Send Request
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We&apos;ll never share your details. Response within one business day.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/25'

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-secondary">
        {label}
      </label>
      {children}
    </div>
  )
}
