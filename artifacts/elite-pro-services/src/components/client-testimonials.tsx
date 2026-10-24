import { BadgeCheck, Star } from 'lucide-react';
import type { Locale } from '@/data/translations';

type Testimonial = {
  name: string;
  initials: string;
  role: Record<Locale, string>;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Karim Alami',
    initials: 'KA',
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

const labels: Record<Locale, { eyebrow: string; title: string; description: string; verified: string; rating: string }> = {
  ar: {
    eyebrow: 'كلمات من عملائنا',
    title: 'آراء عملاء Elite Pro Services',
    description: 'تجارب يشاركها أصحاب المشاريع والفرق التي عملنا معها.',
    verified: 'مشروع موثّق',
    rating: 'خمس نجوم من أصل خمس',
  },
  en: {
    eyebrow: 'A word from our clients',
    title: 'Client reviews',
    description: 'Experiences shared by the founders and teams behind the projects.',
    verified: 'Verified project',
    rating: 'Five out of five stars',
  },
  fr: {
    eyebrow: 'Leurs mots',
    title: 'Avis clients',
    description: 'Les expériences partagées par les fondateurs et les équipes avec qui nous avons travaillé.',
    verified: 'Projet vérifié',
    rating: 'Cinq étoiles sur cinq',
  },
  es: {
    eyebrow: 'Sus palabras',
    title: 'Opiniones de clientes',
    description: 'Experiencias compartidas por los fundadores y equipos con quienes hemos colaborado.',
    verified: 'Proyecto verificado',
    rating: 'Cinco de cinco estrellas',
  },
  de: {
    eyebrow: 'Was unsere Kunden sagen',
    title: 'Kundenstimmen',
    description: 'Erfahrungen von Gründerinnen, Gründern und Teams, mit denen wir gearbeitet haben.',
    verified: 'Verifiziertes Projekt',
    rating: 'Fünf von fünf Sternen',
  },
};

export function ClientTestimonials({ locale }: { locale: Locale }) {
  const copy = labels[locale];

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
        <div className="reviews-grid" role="list" aria-label={copy.title}>
          {testimonials.map((testimonial) => (
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
