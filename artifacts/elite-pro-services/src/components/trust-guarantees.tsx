import type { Locale } from '@/data/translations';
import growthIcon from '@/assets/ui-icons/trust-growth.png';
import paymentIcon from '@/assets/ui-icons/trust-payment.png';
import securityIcon from '@/assets/ui-icons/trust-security.png';
import supportIcon from '@/assets/ui-icons/trust-support.png';

const copy: Record<Locale, { eyebrow: string; title: string; items: string[] }> = {
  ar: {
    eyebrow: 'التزامنا / 07',
    title: 'تعاون واضح من البداية.',
    items: ['الأمان والتشفير الكامل', 'نمو المبيعات والعائد على الاستثمار', 'دعم وتواصل مباشر 24/7', 'خطط دفع مرنة وآمنة'],
  },
  en: {
    eyebrow: 'Our commitment / 07',
    title: 'A clear, considered partnership.',
    items: ['100% Security & Full Encryption', 'Sales Growth & High ROI', '24/7 Direct Client Support', 'Flexible & Secure Payment Plans'],
  },
  fr: {
    eyebrow: 'Notre engagement / 07',
    title: 'Un partenariat clair dès le départ.',
    items: ['Sécurité et chiffrement complets', 'Croissance des ventes et retour sur investissement', 'Assistance client directe 24/7', 'Plans de paiement flexibles et sécurisés'],
  },
  es: {
    eyebrow: 'Nuestro compromiso / 07',
    title: 'Una colaboración clara desde el inicio.',
    items: ['Seguridad y cifrado completos', 'Crecimiento de ventas y alto retorno', 'Atención directa al cliente 24/7', 'Planes de pago flexibles y seguros'],
  },
  de: {
    eyebrow: 'Unser Versprechen / 07',
    title: 'Klare Zusammenarbeit von Anfang an.',
    items: ['100 % Sicherheit und Verschlüsselung', 'Umsatzwachstum und hoher ROI', 'Direkter Kundensupport rund um die Uhr', 'Flexible und sichere Zahlungspläne'],
  },
};

const icons = [securityIcon, growthIcon, supportIcon, paymentIcon];

export function TrustGuarantees({ locale }: { locale: Locale }) {
  const content = copy[locale];

  return (
    <section className="trust-section" aria-labelledby="trust-heading">
      <div className="wrap">
        <div className="trust-heading">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 id="trust-heading">{content.title}</h2>
        </div>
        <div className="trust-grid">
          {content.items.map((item, index) => (
            <article className="trust-card" key={item}>
              <span className="trust-icon">
                <img src={icons[index]} alt="" aria-hidden="true" />
              </span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
