import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const images = [
  { src: '/images/gallery-stage.png', alt: 'Elegant event stage with soft uplighting and a floral backdrop', span: 'row-span-2' },
  { src: '/images/gallery-table.png', alt: 'Refined banquet table setting with candlelight', span: '' },
  { src: '/images/gallery-decor.png', alt: 'Close-up of white and cream floral event decoration', span: '' },
  { src: '/images/gallery-corporate.png', alt: 'Sophisticated corporate event space with clean lighting', span: 'row-span-2' },
  { src: '/images/gallery-celebration.png', alt: 'Beautifully decorated intimate celebration space', span: '' },
  { src: '/images/gallery-lighting.png', alt: 'Warm ambient event lighting with lanterns at dusk', span: '' },
]

export function GallerySection() {
  return (
    <section className="relative border-b border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Gallery</p>
          <h2 className="font-heading mt-3 text-balance text-3xl font-semibold text-primary sm:text-4xl">
            The atmosphere we love to create.
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
            Representative visuals shown for illustration of style and ambience. These are not
            photographs of specific Virya Events projects.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[240px]">
          {images.map((image, i) => (
            <Reveal
              key={image.src}
              delay={(i % 3) * 90}
              className={`group relative overflow-hidden rounded-3xl border border-border ${image.span}`}
            >
              <Image
                src={image.src || '/placeholder.svg'}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
