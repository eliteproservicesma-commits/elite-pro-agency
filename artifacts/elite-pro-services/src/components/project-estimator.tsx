import { useMemo, useState } from 'react';
import { ArrowUpRight, Calculator, Check } from 'lucide-react';
import type { Locale } from '@/data/translations';

type EstimateOption = { key: string; min: number; max: number; weeksMin: number; weeksMax: number };

const projects: Record<Locale, { title: string; name: string; note: string; items: (EstimateOption & { label: string })[] }> = {
  ar: {
    title: 'حاسبة تقدير المشروع',
    name: 'نوع المشروع',
    note: 'نطاق إرشادي للتخطيط وليس تعريفة معتمدة؛ يتحدد السعر والوقت النهائيان بعد مراجعة نطاق العمل.',
    items: [
      { key: 'web', label: 'تطبيق أو موقع ويب', min: 8000, max: 20000, weeksMin: 4, weeksMax: 7 },
      { key: 'ecommerce', label: 'متجر إلكتروني', min: 12000, max: 28000, weeksMin: 6, weeksMax: 10 },
      { key: 'mobile', label: 'تطبيق هاتف', min: 18000, max: 45000, weeksMin: 8, weeksMax: 16 },
      { key: '3d', label: 'تجربة ثلاثية الأبعاد', min: 9000, max: 30000, weeksMin: 4, weeksMax: 10 },
      { key: 'brand-seo', label: 'هوية بصرية أو SEO', min: 4000, max: 12000, weeksMin: 2, weeksMax: 6 },
    ],
  },
  en: {
    title: 'Project cost & timeline estimator',
    name: 'Project type',
    note: 'Illustrative planning range, not a confirmed studio tariff. Final cost and timing depend on the reviewed scope.',
    items: [
      { key: 'web', label: 'Web app or website', min: 8000, max: 20000, weeksMin: 4, weeksMax: 7 },
      { key: 'ecommerce', label: 'E-commerce store', min: 12000, max: 28000, weeksMin: 6, weeksMax: 10 },
      { key: 'mobile', label: 'Mobile app', min: 18000, max: 45000, weeksMin: 8, weeksMax: 16 },
      { key: '3d', label: '3D experience', min: 9000, max: 30000, weeksMin: 4, weeksMax: 10 },
      { key: 'brand-seo', label: 'Branding or SEO', min: 4000, max: 12000, weeksMin: 2, weeksMax: 6 },
    ],
  },
  fr: {
    title: 'Estimateur de coût et de délai',
    name: 'Type de projet',
    note: 'Fourchette indicative, sans valeur de tarif confirmé. Le prix et le délai définitifs dépendent du périmètre validé.',
    items: [
      { key: 'web', label: 'Application ou site web', min: 8000, max: 20000, weeksMin: 4, weeksMax: 7 },
      { key: 'ecommerce', label: 'Boutique e-commerce', min: 12000, max: 28000, weeksMin: 6, weeksMax: 10 },
      { key: 'mobile', label: 'Application mobile', min: 18000, max: 45000, weeksMin: 8, weeksMax: 16 },
      { key: '3d', label: 'Expérience 3D', min: 9000, max: 30000, weeksMin: 4, weeksMax: 10 },
      { key: 'brand-seo', label: 'Identité ou SEO', min: 4000, max: 12000, weeksMin: 2, weeksMax: 6 },
    ],
  },
  es: {
    title: 'Estimador de coste y plazo',
    name: 'Tipo de proyecto',
    note: 'Rango orientativo, no una tarifa confirmada. El precio y el plazo finales dependen del alcance acordado.',
    items: [
      { key: 'web', label: 'Aplicación o sitio web', min: 8000, max: 20000, weeksMin: 4, weeksMax: 7 },
      { key: 'ecommerce', label: 'Tienda e-commerce', min: 12000, max: 28000, weeksMin: 6, weeksMax: 10 },
      { key: 'mobile', label: 'Aplicación móvil', min: 18000, max: 45000, weeksMin: 8, weeksMax: 16 },
      { key: '3d', label: 'Experiencia 3D', min: 9000, max: 30000, weeksMin: 4, weeksMax: 10 },
      { key: 'brand-seo', label: 'Marca o SEO', min: 4000, max: 12000, weeksMin: 2, weeksMax: 6 },
    ],
  },
  de: {
    title: 'Projektkosten- und Zeitplan-Schätzung',
    name: 'Projekttyp',
    note: 'Unverbindlicher Planungswert, kein bestätigter Festpreis. Kosten und Zeitrahmen richten sich nach dem abgestimmten Umfang.',
    items: [
      { key: 'web', label: 'Web-App oder Website', min: 8000, max: 20000, weeksMin: 4, weeksMax: 7 },
      { key: 'ecommerce', label: 'E-Commerce-Shop', min: 12000, max: 28000, weeksMin: 6, weeksMax: 10 },
      { key: 'mobile', label: 'Mobile App', min: 18000, max: 45000, weeksMin: 8, weeksMax: 16 },
      { key: '3d', label: '3D-Erlebnis', min: 9000, max: 30000, weeksMin: 4, weeksMax: 10 },
      { key: 'brand-seo', label: 'Branding oder SEO', min: 4000, max: 12000, weeksMin: 2, weeksMax: 6 },
    ],
  },
};

const addOns: Record<Locale, { title: string; items: (EstimateOption & { label: string })[] }> = {
  ar: {
    title: 'إضافات اختيارية',
    items: [
      { key: 'multilingual', label: 'دعم لغات متعددة', min: 1500, max: 3500, weeksMin: 1, weeksMax: 2 },
      { key: 'cms', label: 'لوحة إدارة المحتوى', min: 2500, max: 6000, weeksMin: 1, weeksMax: 2 },
      { key: 'payments', label: 'الحجز أو الدفع الإلكتروني', min: 3000, max: 8000, weeksMin: 1, weeksMax: 3 },
      { key: 'motion', label: 'حركة وموشن مخصص', min: 4000, max: 10000, weeksMin: 2, weeksMax: 4 },
      { key: 'analytics', label: 'إعداد SEO والتحليلات', min: 1500, max: 4000, weeksMin: 1, weeksMax: 2 },
    ],
  },
  en: {
    title: 'Optional add-ons',
    items: [
      { key: 'multilingual', label: 'Multilingual support', min: 1500, max: 3500, weeksMin: 1, weeksMax: 2 },
      { key: 'cms', label: 'Content management system', min: 2500, max: 6000, weeksMin: 1, weeksMax: 2 },
      { key: 'payments', label: 'Booking or payment flow', min: 3000, max: 8000, weeksMin: 1, weeksMax: 3 },
      { key: 'motion', label: 'Custom motion design', min: 4000, max: 10000, weeksMin: 2, weeksMax: 4 },
      { key: 'analytics', label: 'SEO and analytics setup', min: 1500, max: 4000, weeksMin: 1, weeksMax: 2 },
    ],
  },
  fr: {
    title: 'Options complémentaires',
    items: [
      { key: 'multilingual', label: 'Prise en charge multilingue', min: 1500, max: 3500, weeksMin: 1, weeksMax: 2 },
      { key: 'cms', label: 'Gestion de contenu', min: 2500, max: 6000, weeksMin: 1, weeksMax: 2 },
      { key: 'payments', label: 'Réservation ou paiement', min: 3000, max: 8000, weeksMin: 1, weeksMax: 3 },
      { key: 'motion', label: 'Animation sur mesure', min: 4000, max: 10000, weeksMin: 2, weeksMax: 4 },
      { key: 'analytics', label: 'Configuration SEO et analytics', min: 1500, max: 4000, weeksMin: 1, weeksMax: 2 },
    ],
  },
  es: {
    title: 'Extras opcionales',
    items: [
      { key: 'multilingual', label: 'Soporte multilingüe', min: 1500, max: 3500, weeksMin: 1, weeksMax: 2 },
      { key: 'cms', label: 'Gestión de contenidos', min: 2500, max: 6000, weeksMin: 1, weeksMax: 2 },
      { key: 'payments', label: 'Reservas o pagos', min: 3000, max: 8000, weeksMin: 1, weeksMax: 3 },
      { key: 'motion', label: 'Movimiento y animación a medida', min: 4000, max: 10000, weeksMin: 2, weeksMax: 4 },
      { key: 'analytics', label: 'Configuración SEO y analítica', min: 1500, max: 4000, weeksMin: 1, weeksMax: 2 },
    ],
  },
  de: {
    title: 'Optionale Zusatzleistungen',
    items: [
      { key: 'multilingual', label: 'Mehrsprachige Unterstützung', min: 1500, max: 3500, weeksMin: 1, weeksMax: 2 },
      { key: 'cms', label: 'Content-Management-System', min: 2500, max: 6000, weeksMin: 1, weeksMax: 2 },
      { key: 'payments', label: 'Buchungs- oder Zahlungsablauf', min: 3000, max: 8000, weeksMin: 1, weeksMax: 3 },
      { key: 'motion', label: 'Individuelles Motion-Design', min: 4000, max: 10000, weeksMin: 2, weeksMax: 4 },
      { key: 'analytics', label: 'SEO- und Analytics-Einrichtung', min: 1500, max: 4000, weeksMin: 1, weeksMax: 2 },
    ],
  },
};

const labels: Record<Locale, { estimate: string; min: string; weeks: string; cta: string; result: string }> = {
  ar: { estimate: 'التقدير المبدئي', min: 'درهم مغربي', weeks: 'المدة المتوقعة', cta: 'إرسال التقدير واتساب', result: 'ملخص التقدير' },
  en: { estimate: 'Indicative estimate', min: 'MAD', weeks: 'Estimated timeline', cta: 'Send estimate to WhatsApp', result: 'Estimate summary' },
  fr: { estimate: 'Estimation indicative', min: 'MAD', weeks: 'Délai estimé', cta: 'Envoyer sur WhatsApp', result: 'Récapitulatif' },
  es: { estimate: 'Estimación orientativa', min: 'MAD', weeks: 'Plazo estimado', cta: 'Enviar por WhatsApp', result: 'Resumen de la estimación' },
  de: { estimate: 'Unverbindliche Schätzung', min: 'MAD', weeks: 'Geschätzter Zeitrahmen', cta: 'Per WhatsApp senden', result: 'Kostenschätzung' },
};

const whatsappCopy: Record<Locale, { intro: string; project: string; addOns: string; none: string; range: string; timeline: string; weeks: string }> = {
  ar: { intro: 'السلام عليكم، أود مناقشة مشروع مع Elite Pro Services.', project: 'نوع المشروع', addOns: 'الإضافات', none: 'لا توجد', range: 'التقدير الأولي', timeline: 'المدة المتوقعة', weeks: 'أسابيع' },
  en: { intro: 'Hello, I would like to discuss a project with Elite Pro Services.', project: 'Project type', addOns: 'Add-ons', none: 'None', range: 'Indicative estimate', timeline: 'Estimated timeline', weeks: 'weeks' },
  fr: { intro: 'Bonjour, je souhaite discuter d’un projet avec Elite Pro Services.', project: 'Type de projet', addOns: 'Options', none: 'Aucune', range: 'Estimation indicative', timeline: 'Délai estimé', weeks: 'semaines' },
  es: { intro: 'Hola, me gustaría hablar sobre un proyecto con Elite Pro Services.', project: 'Tipo de proyecto', addOns: 'Extras', none: 'Ninguno', range: 'Estimación orientativa', timeline: 'Plazo estimado', weeks: 'semanas' },
  de: { intro: 'Hallo, ich möchte ein Projekt mit Elite Pro Services besprechen.', project: 'Projekttyp', addOns: 'Zusatzleistungen', none: 'Keine', range: 'Unverbindliche Schätzung', timeline: 'Geschätzter Zeitrahmen', weeks: 'Wochen' },
};

export function ProjectEstimator({ locale }: { locale: Locale }) {
  const projectCopy = projects[locale];
  const addonCopy = addOns[locale];
  const words = labels[locale];
  const [projectKey, setProjectKey] = useState('web');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const chosenProject = projectCopy.items.find((project) => project.key === projectKey) ?? projectCopy.items[0];
  const chosenAddOns = addonCopy.items.filter((item) => selectedAddOns.includes(item.key));
  const estimate = useMemo(() => {
    const base = [chosenProject, ...chosenAddOns];
    return {
      min: base.reduce((sum, item) => sum + item.min, 0),
      max: base.reduce((sum, item) => sum + item.max, 0),
      weeksMin: base.reduce((sum, item) => sum + item.weeksMin, 0),
      weeksMax: base.reduce((sum, item) => sum + item.weeksMax, 0),
    };
  }, [chosenAddOns, chosenProject]);
  const format = (value: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : `${locale}-MA`, { maximumFractionDigits: 0 }).format(value);
  const messageCopy = whatsappCopy[locale];
  const whatsappMessage = [
    messageCopy.intro,
    '',
    `${messageCopy.project}: ${chosenProject.label}`,
    `${messageCopy.addOns}: ${chosenAddOns.length ? chosenAddOns.map((item) => item.label).join(locale === 'ar' ? '، ' : ', ') : messageCopy.none}`,
    `${messageCopy.range}: ${format(estimate.min)}–${format(estimate.max)} MAD`,
    `${messageCopy.timeline}: ${estimate.weeksMin}–${estimate.weeksMax} ${messageCopy.weeks}`,
  ].join('\n');
  const whatsappHref = `https://wa.me/212722016229?text=${encodeURIComponent(whatsappMessage)}`;

  const toggleAddOn = (key: string) => {
    setSelectedAddOns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };

  return (
    <section className="estimator-panel" aria-labelledby="estimator-title">
      <div className="estimator-heading">
        <span className="eyebrow"><Calculator size={14} aria-hidden="true" /> {words.result}</span>
        <h3 id="estimator-title">{projectCopy.title}</h3>
        <p>{projectCopy.note}</p>
      </div>
      <div className="estimator-controls">
        <label className="estimator-project-label" htmlFor="estimate-project">{projectCopy.name}</label>
        <select id="estimate-project" value={projectKey} onChange={(event) => setProjectKey(event.target.value)}>
          {projectCopy.items.map((project) => <option value={project.key} key={project.key}>{project.label}</option>)}
        </select>
        <fieldset className="estimator-addons">
          <legend>{addonCopy.title}</legend>
          {addonCopy.items.map((addon) => (
            <label className="estimator-addon" key={addon.key}>
              <input type="checkbox" checked={selectedAddOns.includes(addon.key)} onChange={() => toggleAddOn(addon.key)} />
              <span>{addon.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="estimator-result" aria-live="polite">
        <div className="estimator-summary">
          <span>{words.estimate}</span>
          <strong className="estimator-amount" dir="ltr">{format(estimate.min)}–{format(estimate.max)} <small>{words.min}</small></strong>
        </div>
        <div className="estimator-summary">
          <span>{words.weeks}</span>
          <strong dir="ltr">{estimate.weeksMin}–{estimate.weeksMax} <small>{locale === 'ar' ? 'أسابيع' : 'weeks'}</small></strong>
        </div>
        <a className="estimator-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          {words.cta}<ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
