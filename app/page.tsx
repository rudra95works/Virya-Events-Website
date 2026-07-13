import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { TrustSection } from '@/components/trust-section'
import { ServicesSection } from '@/components/services-section'
import { WhySection } from '@/components/why-section'
import { HowItWorks } from '@/components/how-it-works'
import { GallerySection } from '@/components/gallery-section'
import { FaqSection } from '@/components/faq-section'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'
import { ChatbotPlaceholder } from '@/components/chatbot-placeholder'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustSection />
        <ServicesSection />
        <WhySection />
        <HowItWorks />
        <GallerySection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <ChatbotPlaceholder />
    </>
  )
}
