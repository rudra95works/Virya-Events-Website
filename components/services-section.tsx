import {
  CalendarCheck,
  Cake,
  Building2,
  Home,
  PartyPopper,
  Gem,
  Sparkle,
  GraduationCap,
  Flower2,
  UtensilsCrossed,
  Camera,
  Video,
  Music,
  Disc3,
  Speaker,
  Theater,
  Users,
  MapPin,
  Package,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const services = [
  { icon: CalendarCheck, title: 'Complete Event Planning', description: 'End-to-end planning and coordination from first idea to final applause.' },
  { icon: Cake, title: 'Birthday Parties', description: 'Memorable celebrations tailored for every age and every guest list.' },
  { icon: Building2, title: 'Corporate Events', description: 'Polished conferences, launches and team gatherings that impress.' },
  { icon: Home, title: 'Housewarming Ceremonies', description: 'Warm, traditional and thoughtfully arranged welcomes for your new home.' },
  { icon: PartyPopper, title: 'Private Celebrations', description: 'Intimate gatherings designed around the people who matter most.' },
  { icon: Gem, title: 'Engagement Events', description: 'Elegant settings to mark the beginning of a beautiful journey.' },
  { icon: Sparkle, title: 'Farewell Parties', description: 'Heartfelt send-offs planned with care and a personal touch.' },
  { icon: GraduationCap, title: 'Freshers Parties', description: 'Energetic, well-organised events for institutions and communities.' },
  { icon: Flower2, title: 'Decoration', description: 'Florals, drapery and styling curated to suit your theme.' },
  { icon: UtensilsCrossed, title: 'Catering', description: 'Trusted culinary partners for menus that delight every palate.' },
  { icon: Camera, title: 'Photography', description: 'Skilled photographers to capture the moments you will revisit.' },
  { icon: Video, title: 'Videography', description: 'Cinematic films that preserve the feeling of the day.' },
  { icon: Music, title: 'Entertainment', description: 'Curated performers and experiences to keep guests engaged.' },
  { icon: Disc3, title: 'DJ', description: 'Professional DJs reading the room and setting the mood.' },
  { icon: Speaker, title: 'Sound & Lighting', description: 'Crisp audio and atmospheric lighting, expertly configured.' },
  { icon: Theater, title: 'Stage Setup', description: 'Striking, safe and photogenic stages built to your brief.' },
  { icon: Users, title: 'Guest Management', description: 'Invitations, RSVPs and on-site hospitality handled for you.' },
  { icon: MapPin, title: 'Venue Assistance', description: 'Guidance to find and secure the right space for your event.' },
  { icon: Package, title: 'Customized Packages', description: 'Flexible packages assembled around your priorities and budget.' },
]

export function ServicesSection() {
  return (
    <section id="services" className="relative border-b border-border bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            What we do
          </p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
            One team for every part of your celebration.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From the first plan to the final detail, our services cover everything your event needs
            — coordinated under a single point of contact.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={(i % 3) * 90}
              as="article"
              className="group flex h-full items-start gap-4 rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-22px_rgba(31,42,68,0.3)]"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                <service.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-primary">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
