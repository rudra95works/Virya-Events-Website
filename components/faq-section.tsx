'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const faqs = [
  {
    question: 'What events do you organize?',
    answer:
      'We plan and manage birthdays, corporate events, housewarming ceremonies, engagements, farewells, freshers parties and a wide range of private celebrations — from intimate gatherings to larger functions.',
  },
  {
    question: 'Can I hire only decoration?',
    answer:
      'Yes. While we love handling complete events, our services are modular. You can engage us for decoration alone, or for any single element such as catering, photography or stage setup.',
  },
  {
    question: 'Do you provide catering?',
    answer:
      'We coordinate catering through our trusted, vetted culinary partners. We help you choose menus that suit your guests, preferences and budget, and manage the arrangements on your behalf.',
  },
  {
    question: 'How can I request a quotation?',
    answer:
      'Simply share your event details through the contact form, phone or WhatsApp. We will get back to you with a customized proposal and transparent pricing.',
  },
  {
    question: 'How early should I book?',
    answer:
      'We recommend reaching out as early as possible — ideally a few weeks ahead for smaller events and earlier for larger ones. This gives us the best window to secure vendors and venues.',
  },
  {
    question: 'Do you work outside Bengaluru?',
    answer:
      'Our base is Bengaluru and we primarily serve the city and surrounding regions. For events further afield, please get in touch and we will do our best to help.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative border-b border-border bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Frequently asked
          </p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
            Answers before you ask.
          </h2>
        </Reveal>

        <Reveal className="mt-12" delay={80}>
          <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
            {faqs.map((faq, i) => {
              const isOpen = open === i
              return (
                <div key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
                    >
                      <span className="font-heading text-base font-medium text-primary">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 shrink-0 text-accent transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
