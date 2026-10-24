import { useState } from 'react';
import { BadgeCheck, Star } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Locale } from '@/data/translations';

type TestimonialCategory = 'المتاجر الإلكترونية' | 'المواقع' | 'التطبيقات و 3D';
type ReviewFilter = 'all' | TestimonialCategory;

type Testimonial = {
  name: string;
  initials: string;
  category: TestimonialCategory;
  role: string;
  quote: string;
  rating: number;
  badge: string;
};

const testimonials: Testimonial[] = [
  { name: 'Karim Alami', initials: 'KA', role: 'مؤسس متجر أزياء', category: 'المتاجر الإلكترونية', quote: 'سرعة خرافية فـ التصفح وتجاوب ممتاز مع الواتساب. تحسنات المبيعات بـ 40%.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'Yassine El Baqali', initials: 'YB', role: 'مدير وكالة عقارات طنجة', category: 'المواقع', quote: 'تصميم فخم وكود نقي بزاف. التعامل مع عمران وفريق Elite Pro كيزيد الثقة.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'Sarah Benjelloun', initials: 'SB', role: 'Directrice Marketing', category: 'التطبيقات و 3D', quote: 'Une expérience UI/UX exceptionnelle avec animations 3D fluid. Très recommandé!', rating: 5, badge: 'Verified Client 🇫🇷' },
  { name: 'Mehdi Tazi', initials: 'MT', role: 'Owner - Auto School', category: 'المواقع', quote: 'خدمة احترافية وتجاوب سريع فـ التعديلات، السيت طلع سابق الوقت.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'Omar Al Mansoori', initials: 'OA', role: 'E-Com Director Dubai', category: 'المتاجر الإلكترونية', quote: 'Top-tier development and seamless execution. High ROI on our store.', rating: 5, badge: 'Verified UAE 🇦🇪' },
  { name: 'أمين الحنصلي', initials: 'أح', role: 'مؤسس منصة تعليمية', category: 'التطبيقات و 3D', quote: 'الربط التفاعلي والتصميم الأسود الذهبي عطى هيبة كبيرة للمشروع.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'Sophie Laurent', initials: 'SL', role: 'Startup Founder Paris', category: 'المواقع', quote: 'Service impeccable, Vercel deployment rapide et design moderne.', rating: 5, badge: 'Verified Client 🇫🇷' },
  { name: 'حمزة الوردي', initials: 'حو', role: 'صاحب مطعم طنجة', category: 'المتاجر الإلكترونية', quote: 'منيو إلكتروني سريع ونظام طلبات الواتساب سهل علينا الخدمة.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'David Miller', initials: 'DM', role: 'Tech Lead', category: 'التطبيقات و 3D', quote: 'Clean code, excellent performance, and zero layout bugs.', rating: 5, badge: 'Verified Client 🇺🇸' },
  { name: 'هشام العمراني', initials: 'ها', role: 'مؤسس متجر إلكتروني', category: 'المتاجر الإلكترونية', quote: 'أحسن وكالة تعاملت معاها فـ المغرب، احترافية فـ المواعيد.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'سلمى الإدريسي', initials: 'سا', role: 'مصممة ديكور', category: 'المواقع', quote: 'معرض الأعمال طالع كيحمق والكليان كيعجبهم السيت بزاف.', rating: 5, badge: 'مشروع موثق 🇲🇦' },
  { name: 'Alexandre Dubois', initials: 'AD', role: 'Founder Studio', category: 'التطبيقات و 3D', quote: 'Superbe rendu WebGL et animations fluide. Bravo à l’équipe Elite Pro.', rating: 5, badge: 'Verified Client 🇫🇷' },
];

const labels: Record<Locale, { eyebrow: string; title: string; description: string; verified: string; rating: string; filterLabel: string; filters: Record<ReviewFilter, string>; results: (count: number) => string; more: string; less: string }> = {
  ar: {
    eyebrow: 'كلمات من عملائنا',
    title: 'آراء عملاء Elite Pro Services',
    description: 'تجارب يشاركها أصحاب المشاريع والفرق التي عملنا معها.',
    verified: 'مشروع موثّق',
    rating: 'خمس نجوم من أصل خمس',
    filterLabel: 'تصفية التقييمات حسب نوع المشروع',
    filters: { all: 'الكل', 'المتاجر الإلكترونية': 'المتاجر الإلكترونية', المواقع: 'المواقع', 'التطبيقات و 3D': 'التطبيقات و 3D' },
    results: (count) => `${count} تقييمات`,
    more: 'عرض المزيد',
    less: 'عرض أقل',
  },
  en: {
    eyebrow: 'A word from our clients',
    title: 'Client reviews',
    description: 'Experiences shared by the founders and teams behind the projects.',
    verified: 'Verified project',
    rating: 'Five out of five stars',
    filterLabel: 'Filter reviews by project type',
    filters: { all: 'All', 'المتاجر الإلكترونية': 'E-Commerce', المواقع: 'Websites', 'التطبيقات و 3D': 'Apps & 3D' },
    results: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    more: 'Show more',
    less: 'Show less',
  },
  fr: {
    eyebrow: 'Leurs mots',
    title: 'Avis clients',
    description: 'Les expériences partagées par les fondateurs et les équipes avec qui nous avons travaillé.',
    verified: 'Projet vérifié',
    rating: 'Cinq étoiles sur cinq',
    filterLabel: 'Filtrer les avis par type de projet',
    filters: { all: 'Tous', 'المتاجر الإلكترونية': 'E-commerce', المواقع: 'Sites web', 'التطبيقات و 3D': 'Apps et 3D' },
    results: (count) => `${count} avis`,
    more: 'Voir plus',
    less: 'Voir moins',
  },
  es: {
    eyebrow: 'Sus palabras',
    title: 'Opiniones de clientes',
    description: 'Experiencias compartidas por los fundadores y equipos con quienes hemos colaborado.',
    verified: 'Proyecto verificado',
    rating: 'Cinco de cinco estrellas',
    filterLabel: 'Filtrar opiniones por tipo de proyecto',
    filters: { all: 'Todas', 'المتاجر الإلكترونية': 'Comercio electrónico', المواقع: 'Sitios web', 'التطبيقات و 3D': 'Apps y 3D' },
    results: (count) => `${count} opiniones`,
    more: 'Ver más',
    less: 'Ver menos',
  },
  de: {
    eyebrow: 'Was unsere Kunden sagen',
    title: 'Kundenstimmen',
    description: 'Erfahrungen von Gründerinnen, Gründern und Teams, mit denen wir gearbeitet haben.',
    verified: 'Verifiziertes Projekt',
    rating: 'Fünf von fünf Sternen',
    filterLabel: 'Bewertungen nach Projekttyp filtern',
    filters: { all: 'Alle', 'المتاجر الإلكترونية': 'E-Commerce', المواقع: 'Websites', 'التطبيقات و 3D': 'Apps und 3D' },
    results: (count) => `${count} Bewertungen`,
    more: 'Mehr anzeigen',
    less: 'Weniger anzeigen',
  },
};

export function ClientTestimonials({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const filteredTestimonials = activeFilter === 'all'
    ? testimonials
    : testimonials.filter((testimonial) => testimonial.category === activeFilter);
  const visibleTestimonials = filteredTestimonials.slice(0, showAll ? filteredTestimonials.length : 6);
  const filterOptions: ReviewFilter[] = ['all', 'المتاجر الإلكترونية', 'المواقع', 'التطبيقات و 3D'];

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
            onValueChange={(value) => {
              if (value) {
                setActiveFilter(value as ReviewFilter);
                setShowAll(false);
              }
            }}
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
        <div id="reviews-grid" className="reviews-grid" data-count={visibleTestimonials.length} role="list" aria-label={copy.title}>
          {visibleTestimonials.map((testimonial) => (
            <article className="review-card" role="listitem" key={testimonial.name}>
              <div className="review-topline">
                <span className="review-verified"><BadgeCheck size={15} aria-hidden="true" />{testimonial.badge}</span>
                <span className="review-rating" role="img" aria-label={copy.rating}>
                  <span className="review-stars" aria-hidden="true">
                    {Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}
                  </span>
                </span>
              </div>
              <blockquote className="review-quote">“{testimonial.quote}”</blockquote>
              <div className="review-client">
                <span className="review-avatar" aria-hidden="true">{testimonial.initials}</span>
                <span className="review-client-copy">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
        {filteredTestimonials.length > 6 && (
          <button
            className="reviews-more-button"
            type="button"
            aria-expanded={showAll}
            aria-controls="reviews-grid"
            onClick={() => setShowAll((expanded) => !expanded)}
          >
            {showAll ? copy.less : copy.more}
          </button>
        )}
      </div>
    </section>
  );
}
