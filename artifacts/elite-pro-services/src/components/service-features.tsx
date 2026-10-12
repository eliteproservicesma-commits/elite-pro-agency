import type { Locale } from '@/data/translations';
import contentIcon from '@/assets/ui-icons/service-content.png';
import designIcon from '@/assets/ui-icons/service-design.png';
import platformsIcon from '@/assets/ui-icons/service-platforms.png';
import seoIcon from '@/assets/ui-icons/service-seo.png';
import targetIcon from '@/assets/ui-icons/service-target.png';

const text: Record<Locale, { eyebrow: string; title: string; items: { title: string; description: string }[] }> = {
  ar: {
    eyebrow: 'تفاصيل تصنع الفرق',
    title: 'خدمات مصممة لتحقيق نتائج واضحة.',
    items: [
      { title: 'التركيز على الأهداف والنتائج', description: 'نربط كل قرار رقمي بهدف عملي قابل للقياس.' },
      { title: 'تطوير وإدارة المحتوى السلس', description: 'نطوّر واجهات وأدوات تسهّل إدارة المحتوى اليومي.' },
      { title: 'تحليل الأداء وتحسين محركات البحث', description: 'نحسّن الظهور الرقمي اعتماداً على مؤشرات الأداء.' },
      { title: 'تصميم واجهات وتجارب مستخدم مبتكرة', description: 'تجارب بصرية واضحة ومريحة على مختلف الشاشات.' },
      { title: 'تطوير المنصات والتطبيقات الرقمية', description: 'مواقع وتطبيقات مصممة لتناسب احتياجات مشروعك.' },
    ],
  },
  en: {
    eyebrow: 'The details that move work forward',
    title: 'Services designed around clear outcomes.',
    items: [
      { title: 'Goal-oriented execution', description: 'Every digital decision supports a practical, measurable goal.' },
      { title: 'Seamless content and platform management', description: 'Flexible interfaces and tools for managing everyday content.' },
      { title: 'SEO and performance analytics', description: 'Improve digital visibility with useful performance insights.' },
      { title: 'Innovative UI/UX design', description: 'Clear, considered experiences across screen sizes.' },
      { title: 'Custom apps and digital platforms', description: 'Websites and apps shaped around your project needs.' },
    ],
  },
  fr: {
    eyebrow: 'Le détail qui fait la différence',
    title: 'Des services pensés pour des résultats concrets.',
    items: [
      { title: 'Une approche axée sur les objectifs', description: 'Chaque choix numérique sert un objectif concret et mesurable.' },
      { title: 'Gestion de contenu et de plateforme fluide', description: 'Des outils souples pour gérer le contenu au quotidien.' },
      { title: 'SEO et analyse des performances', description: 'Améliorer la visibilité grâce à des indicateurs utiles.' },
      { title: 'Design UI/UX innovant', description: 'Des expériences claires sur tous les écrans.' },
      { title: 'Applications et plateformes sur mesure', description: 'Des sites et applications adaptés à votre projet.' },
    ],
  },
  es: {
    eyebrow: 'Los detalles que marcan la diferencia',
    title: 'Servicios pensados para lograr resultados claros.',
    items: [
      { title: 'Ejecución orientada a objetivos', description: 'Cada decisión digital respalda una meta práctica y medible.' },
      { title: 'Gestión fluida de contenido y plataformas', description: 'Herramientas flexibles para gestionar el contenido diario.' },
      { title: 'SEO y análisis del rendimiento', description: 'Mejoramos la visibilidad con métricas útiles.' },
      { title: 'Diseño UI/UX innovador', description: 'Experiencias claras y cuidadas en cualquier pantalla.' },
      { title: 'Aplicaciones y plataformas a medida', description: 'Webs y aplicaciones adaptadas a tu proyecto.' },
    ],
  },
  de: {
    eyebrow: 'Details, die den Unterschied machen',
    title: 'Services mit klaren Zielen und Ergebnissen.',
    items: [
      { title: 'Zielorientierte Umsetzung', description: 'Jede digitale Entscheidung unterstützt ein messbares Ziel.' },
      { title: 'Reibungslose Content- und Plattformverwaltung', description: 'Flexible Tools für die tägliche Verwaltung von Inhalten.' },
      { title: 'SEO und Performance-Analyse', description: 'Mehr Sichtbarkeit mit aussagekräftigen Kennzahlen.' },
      { title: 'Innovatives UI/UX-Design', description: 'Klare Nutzererlebnisse auf allen Bildschirmgrößen.' },
      { title: 'Individuelle Apps und digitale Plattformen', description: 'Websites und Apps passend zu Ihrem Projekt.' },
    ],
  },
};

const icons = [targetIcon, contentIcon, seoIcon, designIcon, platformsIcon];

export function ServiceFeatures({ locale }: { locale: Locale }) {
  const copy = text[locale];

  return (
    <div className="service-features" aria-label={copy.title}>
      <div className="service-features-heading">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h3>{copy.title}</h3>
      </div>
      <div className="service-features-grid">
        {copy.items.map((item, index) => (
          <article className="service-feature-card" key={item.title}>
            <span className="service-feature-icon">
              <img src={icons[index]} alt="" aria-hidden="true" />
            </span>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
