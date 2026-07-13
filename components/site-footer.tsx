import { Logo } from '@/components/logo'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms', href: '#' },
]

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8 text-primary-foreground" />
              <span className="font-heading text-lg font-semibold tracking-tight">
                Virya <span className="font-normal text-primary-foreground/70">Events</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-primary-foreground/70">
              Every celebration deserves to be remembered. Professional planning, trusted vendor
              coordination and seamless execution — based in Bengaluru.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center rounded-full border border-primary-foreground/15 px-4 py-2 text-xs font-medium text-primary-foreground/80 transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs text-primary-foreground/60">
            &copy; {year} Virya Events. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/60">
            Every Celebration Deserves to Be Remembered.
          </p>
        </div>
      </div>
    </footer>
  )
}
