import type { Locale } from '@/data/translations';
import {
  SiApplepay,
  SiGooglepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from 'react-icons/si';

const text: Record<Locale, { title: string; note: string; names: string[] }> = {
  ar: {
    title: 'خيارات دفع مرنة',
    note: 'تُحدَّد طريقة الدفع المناسبة عند الاتفاق على تفاصيل المشروع.',
    names: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
  },
  en: {
    title: 'Flexible payment options',
    note: 'Payment arrangements are confirmed when project details are agreed.',
    names: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
  },
  fr: {
    title: 'Options de paiement flexibles',
    note: 'Les modalités de paiement sont confirmées avec les détails du projet.',
    names: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
  },
  es: {
    title: 'Opciones de pago flexibles',
    note: 'Las condiciones de pago se confirman al definir el proyecto.',
    names: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
  },
  de: {
    title: 'Flexible Zahlungsoptionen',
    note: 'Die Zahlungsmodalitäten werden mit den Projektdetails vereinbart.',
    names: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
  },
};

const marks = [SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay];
const styles = ['visa', 'mastercard', 'paypal', 'applepay', 'googlepay'];

export function PaymentCards({ locale }: { locale: Locale }) {
  const content = text[locale];

  return (
    <section className="payment-methods" aria-label={content.title}>
      <div className="payment-methods-copy">
        <h2>{content.title}</h2>
        <p>{content.note}</p>
      </div>
      <div className="payment-card-row">
        {content.names.map((name, index) => {
          const Mark = marks[index];
          return (
            <div className={`payment-mini-card payment-${styles[index]}`} key={name} role="img" aria-label={name}>
              <span className="payment-card-sheen" aria-hidden="true" />
              <span className="payment-card-chip" aria-hidden="true" />
              <Mark className="payment-brand-mark" aria-hidden="true" />
              {(index === 1 || index === 2) && <span className="payment-brand-caption" aria-hidden="true">{name}</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
