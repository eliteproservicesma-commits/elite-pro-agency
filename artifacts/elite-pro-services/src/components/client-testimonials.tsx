import { useState } from 'react';
import { BadgeCheck, Star } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Locale } from '@/data/translations';

type TestimonialCategory = 'ecommerce' | 'websites' | 'apps3d';
type ReviewFilter = 'all' | TestimonialCategory;

type Testimonial = {
  name: string;
  initials: string;
  category: TestimonialCategory;
  role: Record<Locale, string>;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Karim Alami',
    initials: 'KA',
    category: 'ecommerce',
    role: {
      ar: 'مؤسس متجر إلكتروني',
      en: 'E-Commerce Founder',
      fr: 'Fondateur e-commerce',
      es: 'Fundador de comercio electrónico',
      de: 'E-Commerce-Gründer',
    },
    quote: 'تحول كامل فـ المتجر الإلكتروني ديالنا. الديزاين الأسود الفخم والسرعة فـ التحميل زادو نسبة المبيعات بـ 35% فـ أول شهر.',
  },
  {
    name: 'Sarah Benjelloun',
    initials: 'SB',
    category: 'apps3d',
    role: {
      ar: 'مديرة التسويق',
      en: 'Marketing Director',
      fr: 'Directrice marketing',
      es: 'Directora de marketing',
      de: 'Marketingdirektorin',
    },
    quote: 'احترافية عالية فـ التعامل مع عمران وفريق Elite Pro Services. تطبيق الهواتف والواجهة 3D كانت كثر ملي توقعنا.',
  },
  {
    name: 'David Miller',
    initials: 'DM',
    category: 'websites',
    role: {
      ar: 'مؤسس شركة تقنية ناشئة',
      en: 'Tech Startup Founder',
      fr: 'Fondateur d’une startup tech',
      es: 'Fundador de una startup tecnológica',
      de: 'Gründer eines Tech-Start-ups',
    },
    quote: 'Exceptional UI/UX quality and top-notch Vercel deployment. Highly recommended agency for serious brands.',
  },
];

const labels: Record<Locale, { eyebrow: string; title: string; description: string; verified: string; rating: string; filterLabel: string; filters: Record<ReviewFilter, string>; results: (count: number) => string }> = {
  ar: {
    eyebrow: 'كلمات من عملائنا',
    title: 'آراء عملاء Elite Pro Services',
    description: 'تجارب يشاركها أصحاب المشاريع والفرق التي عملنا معها.',
    verified: 'مشروع موثّق',
    rating: 'خمس نجوم من أصل خمس',
    filterLabel: 'تصفية التقييمات حسب نوع المشروع',
    filters: { all: 'الكل', ecommerce: 'المتاجر الإلكترونية', websites: 'المواقع التعريفية', apps3d: 'التطبيقات و 3D' },
    results: (count) => `${count} تقييمات`,
  },
  en: {
    eyebrow: 'A word from our clients',
    title: 'Client reviews',
    description: 'Experiences shared by the founders and teams behind the projects.',
    verified: 'Verified project',
    rating: 'Five out of five stars',
    filterLabel: 'Filter reviews by project type',
    filters: { all: 'All', ecommerce: 'E-Commerce', websites: 'Websites', apps3d: 'Apps & 3D' },
    results: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
  },
  fr: {
    eyebrow: 'Leurs mots',
    title: 'Avis clients',
    description: 'Les expériences partagées par les fondateurs et les équipes avec qui nous avons travaillé.',
    verified: 'Projet vérifié',
    rating: 'Cinq étoiles sur cinq',
    filterLabel: 'Filtrer les avis par type de projet',
    filters: { all: 'Tous', ecommerce: 'E-commerce', websites: 'Sites web', apps3d: 'Apps et 3D' },
    results: (count) => `${count} avis`,
  },
  es: {
    eyebrow: 'Sus palabras',
    title: 'Opiniones de clientes',
    description: 'Experiencias compartidas por los fundadores y equipos con quienes hemos colaborado.',
    verified: 'Proyecto verificado',
    rating: 'Cinco de cinco estrellas',
    filterLabel: 'Filtrar opiniones por tipo de proyecto',
    filters: { all: 'Todas', ecommerce: 'Comercio electrónico', websites: 'Sitios web', apps3d: 'Apps y 3D' },
    results: (count) => `${count} opiniones`,
  },
  de: {
    eyebrow: 'Was unsere Kunden sagen',
    title: 'Kundenstimmen',
    description: 'Erfahrungen von Gründerinnen, Gründern und Teams, mit denen wir gearbeitet haben.',
    verified: 'Verifiziertes Projekt',
    rating: 'Fünf von fünf Sternen',
    filterLabel: 'Bewertungen nach Projekttyp filtern',
    filters: { all: 'Alle', ecommerce: 'E-Commerce', websites: 'Websites', apps3d: 'Apps und 3D' },
    results: (count) => `${count} Bewertungen`,
  },
};

export function ClientTestimonials({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all');
  const visibleTestimonials = activeFilter === 'all'
    ? testimonials
    : testimonials.filter((testimonial) => testimonial.category === activeFilter);
  const filterOptions: ReviewFilter[] = ['all', 'ecommerce', 'websites', 'apps3d'];

  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-heading" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="wrap">
        <header className="reviews-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="reviews-heading">{copy.title}</h2>
          </div>
          <p className="reviews-intro">{copy.description}</p>
        </header>
        <div className="reviews-controls">
          <ToggleGroup
            type="single"
            value={activeFilter}
            onValueChange={(value) => { if (value) setActiveFilter(value as ReviewFilter); }}
            variant="outline"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            aria-label={copy.filterLabel}
            className="reviews-filters"
          >
            {filterOptions.map((filter) => (
              <ToggleGroupItem className="review-filter-button" key={filter} value={filter}>
                {copy.filters[filter]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="reviews-count" aria-live="polite">{copy.results(visibleTestimonials.length)}</p>
        </div>
        <div className="reviews-grid" data-count={visibleTestimonials.length} role="list" aria-label={copy.title}>
          {visibleTestimonials.map((testimonial) => (
            <article className="review-card" role="listitem" key={testimonial.name}>
              <div className="review-topline">
                <span className="review-verified"><BadgeCheck size={15} aria-hidden="true" />{copy.verified}</span>
                <span className="review-rating" role="img" aria-label={copy.rating}>
                  <span className="review-stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}
                  </span>
                </span>
              </div>
              <blockquote className="review-quote">“{testimonial.quote}”</blockquote>
              <div className="review-client">
                <span className="review-avatar" aria-hidden="true">{testimonial.initials}</span>
                <span className="review-client-copy">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role[locale]}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
