import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle, X } from 'lucide-react';
import { useSendNewsletterOtp, useVerifyNewsletterOtp } from '@workspace/api-client-react';
import type { Locale, SiteCopy } from '@/data/translations';

type NewsletterDemoProps = { copy: SiteCopy; locale: Locale };

const ui: Record<Locale, {
  eyebrow: string; first: string; second: string; description: string; email: string; placeholder: string;
  submit: string; deliveryNote: string; modalTitle: string; modalDescription: string; sent: string;
  codeLabel: string; verify: string; close: string; resume: string; resend: string;
  invalidEmail: string; invalidCode: string; expired: string; rateLimited: string;
  providerMissing: string; sendFailed: string; verified: string;
}> = {
  ar: {
    eyebrow: 'التحقق عبر Gmail / 03', first: 'مزايا للعملاء،', second: 'مباشرة بعد التحقق.',
    description: 'أدخل عنوان Gmail لإرسال رمز حقيقي من 6 أرقام إلى بريدك، ثم تحقّق للوصول إلى مزايا العملاء.',
    email: 'عنوان Gmail', placeholder: 'name@gmail.com', submit: 'أرسل رمز التحقق',
    deliveryNote: 'لن يظهر الرمز على الموقع؛ يصلك مباشرة إلى بريد Gmail.',
    modalTitle: 'تحقق من بريدك', modalDescription: 'أرسلنا رمزاً إلى {email}. أدخله هنا خلال 10 دقائق.',
    sent: 'تم إرسال الرمز عبر Gmail.', codeLabel: 'رمز التحقق المكوّن من 6 أرقام',
    verify: 'تحقق وافتح المزايا', close: 'إغلاق', resume: 'متابعة التحقق',
    resend: 'إعادة إرسال الرمز', invalidEmail: 'أدخل عنوان Gmail صحيحاً ينتهي بـ @gmail.com.',
    invalidCode: 'الرمز غير صحيح. راجع الرسالة وحاول مرة أخرى.',
    expired: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.', rateLimited: 'طلبات كثيرة. انتظر قليلاً قبل المحاولة مجدداً.',
    providerMissing: 'إرسال البريد غير متاح حالياً. يلزم ربط حساب Gmail للإرسال الحقيقي.',
    sendFailed: 'تعذّر إرسال الرمز. حاول مرة أخرى بعد قليل.',
    verified: 'تم التحقق من بريدك. مزايا العملاء متاحة الآن.',
  },
  en: {
    eyebrow: 'Gmail verification / 03', first: 'Client perks,', second: 'once your email is verified.',
    description: 'Enter your Gmail address to receive a real six-digit code, then verify it to unlock the client perks.',
    email: 'Gmail address', placeholder: 'name@gmail.com', submit: 'Send verification code',
    deliveryNote: 'The code is never displayed on this site; it is sent to your Gmail inbox.',
    modalTitle: 'Check your inbox', modalDescription: 'We sent a code to {email}. Enter it within 10 minutes.',
    sent: 'Verification code sent via Gmail.', codeLabel: '6-digit verification code',
    verify: 'Verify and unlock perks', close: 'Close', resume: 'Continue verification',
    resend: 'Send a new code', invalidEmail: 'Enter a valid Gmail address ending in @gmail.com.',
    invalidCode: 'That code is not correct. Check the email and try again.',
    expired: 'That code expired. Request a new one.', rateLimited: 'Too many requests. Wait a little before trying again.',
    providerMissing: 'Email sending is unavailable until a Gmail account is connected.',
    sendFailed: 'We could not send the code. Please try again shortly.',
    verified: 'Your email is verified. Client perks are now unlocked.',
  },
  fr: {
    eyebrow: 'Vérification Gmail / 03', first: 'Des avantages clients,', second: 'après vérification.',
    description: 'Saisissez votre adresse Gmail pour recevoir un code réel à six chiffres et accéder aux avantages clients.',
    email: 'Adresse Gmail', placeholder: 'name@gmail.com', submit: 'Envoyer le code',
    deliveryNote: 'Le code ne s’affiche pas sur le site : il est envoyé dans votre boîte Gmail.',
    modalTitle: 'Vérifiez votre boîte mail', modalDescription: 'Un code a été envoyé à {email}. Saisissez-le sous 10 minutes.',
    sent: 'Code envoyé via Gmail.', codeLabel: 'Code de vérification à six chiffres',
    verify: 'Vérifier et accéder aux avantages', close: 'Fermer', resume: 'Continuer la vérification',
    resend: 'Renvoyer un code', invalidEmail: 'Saisissez une adresse Gmail valide se terminant par @gmail.com.',
    invalidCode: 'Ce code est incorrect. Vérifiez le message et réessayez.',
    expired: 'Ce code a expiré. Demandez-en un nouveau.', rateLimited: 'Trop de demandes. Réessayez dans un instant.',
    providerMissing: 'L’envoi est indisponible tant qu’un compte Gmail n’est pas connecté.',
    sendFailed: 'Impossible d’envoyer le code. Réessayez dans un instant.',
    verified: 'Votre adresse est vérifiée. Vos avantages clients sont accessibles.',
  },
  es: {
    eyebrow: 'Verificación de Gmail / 03', first: 'Ventajas para clientes,', second: 'al verificar el correo.',
    description: 'Introduce tu Gmail para recibir un código real de seis dígitos y desbloquear las ventajas para clientes.',
    email: 'Dirección de Gmail', placeholder: 'name@gmail.com', submit: 'Enviar código',
    deliveryNote: 'El código no aparece en esta web; se envía a tu bandeja de Gmail.',
    modalTitle: 'Revisa tu bandeja de entrada', modalDescription: 'Enviamos un código a {email}. Introdúcelo en 10 minutos.',
    sent: 'Código enviado mediante Gmail.', codeLabel: 'Código de verificación de 6 dígitos',
    verify: 'Verificar y desbloquear ventajas', close: 'Cerrar', resume: 'Continuar verificación',
    resend: 'Enviar un código nuevo', invalidEmail: 'Introduce una dirección válida que termine en @gmail.com.',
    invalidCode: 'El código no es correcto. Revisa el correo e inténtalo de nuevo.',
    expired: 'El código ha caducado. Solicita uno nuevo.', rateLimited: 'Demasiadas solicitudes. Espera un poco y vuelve a intentarlo.',
    providerMissing: 'El envío no está disponible hasta conectar una cuenta de Gmail.',
    sendFailed: 'No se pudo enviar el código. Inténtalo de nuevo pronto.',
    verified: 'Tu correo está verificado. Ya puedes acceder a las ventajas para clientes.',
  },
  de: {
    eyebrow: 'Gmail-Verifizierung / 03', first: 'Kundenvorteile,', second: 'sobald die E-Mail bestätigt ist.',
    description: 'Geben Sie Ihre Gmail-Adresse ein. Sie erhalten einen echten sechsstelligen Code für den Zugang zu Kundenvorteilen.',
    email: 'Gmail-Adresse', placeholder: 'name@gmail.com', submit: 'Bestätigungscode senden',
    deliveryNote: 'Der Code wird nicht auf der Website angezeigt, sondern an Ihr Gmail-Postfach gesendet.',
    modalTitle: 'Posteingang prüfen', modalDescription: 'Wir haben einen Code an {email} gesendet. Geben Sie ihn innerhalb von 10 Minuten ein.',
    sent: 'Bestätigungscode über Gmail gesendet.', codeLabel: 'Sechsstelliger Bestätigungscode',
    verify: 'Bestätigen und Vorteile freischalten', close: 'Schließen', resume: 'Verifizierung fortsetzen',
    resend: 'Neuen Code senden', invalidEmail: 'Geben Sie eine gültige Gmail-Adresse mit @gmail.com ein.',
    invalidCode: 'Der Code ist falsch. Prüfen Sie die E-Mail und versuchen Sie es erneut.',
    expired: 'Der Code ist abgelaufen. Fordern Sie einen neuen an.', rateLimited: 'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.',
    providerMissing: 'E-Mail-Versand ist erst nach dem Verbinden eines Gmail-Kontos verfügbar.',
    sendFailed: 'Der Code konnte nicht gesendet werden. Versuchen Sie es später erneut.',
    verified: 'Ihre E-Mail ist bestätigt. Die Kundenvorteile sind jetzt freigeschaltet.',
  },
};

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('data' in error)) return undefined;
  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== 'object' || !('code' in data)) return undefined;
  const code = (data as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

export function NewsletterDemo({ copy, locale }: NewsletterDemoProps) {
  const words = ui[locale];
  const sendOtp = useSendNewsletterOtp();
  const verifyOtp = useVerifyNewsletterOtp();
  const [email, setEmail] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const mapError = (issue: unknown, mode: 'send' | 'verify') => {
    const code = errorCode(issue);
    if (code === 'mail_not_connected' || code === 'otp_not_configured') return words.providerMissing;
    if (code === 'rate_limited' || code === 'attempt_limit') return words.rateLimited;
    if (code === 'otp_expired') return words.expired;
    if (code === 'invalid_code') return words.invalidCode;
    return mode === 'send' ? words.sendFailed : words.invalidCode;
  };

  const sendCode = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      setError(words.invalidEmail);
      return;
    }
    setError('');
    setIsUnlocked(false);
    setEnteredCode('');
    try {
      const challenge = await sendOtp.mutateAsync({ data: { email: normalizedEmail } });
      setChallengeId(challenge.challengeId);
      setEmail(normalizedEmail);
      setIsOpen(true);
    } catch (issue) {
      setError(mapError(issue, 'send'));
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeId || enteredCode.length !== 6) {
      setError(words.invalidCode);
      return;
    }
    setError('');
    try {
      await verifyOtp.mutateAsync({ data: { challengeId, code: enteredCode } });
      setIsUnlocked(true);
      setChallengeId(null);
      setIsOpen(false);
    } catch (issue) {
      setError(mapError(issue, 'verify'));
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="wrap newsletter-panel">
        <div className="newsletter-copy">
          <div className="eyebrow">{words.eyebrow}</div>
          <h2>{words.first}<br />{words.second}</h2>
          <p>{words.description}</p>
        </div>
        <div className="newsletter-action">
          <form className="newsletter-form" onSubmit={sendCode} noValidate>
            <label htmlFor="newsletter-email">{words.email}</label>
            <div className="newsletter-input-row">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError('');
                }}
                placeholder={words.placeholder}
                autoComplete="email"
                dir="ltr"
                required
                aria-invalid={Boolean(error)}
                aria-describedby="newsletter-note"
                data-testid="newsletter-email"
              />
              <button type="submit" className="newsletter-submit" disabled={sendOtp.isPending} data-testid="newsletter-start">
                {sendOtp.isPending ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : words.submit}
                {!sendOtp.isPending && <ArrowLeft size={16} aria-hidden="true" />}
              </button>
            </div>
          </form>
          <p className="demo-disclosure" id="newsletter-note"><span className="demo-indicator" />{words.deliveryNote}</p>
          {error && !isOpen && <p className="newsletter-error" role="alert">{error}</p>}
          {challengeId && !isOpen && !isUnlocked && (
            <button className="otp-resume" type="button" onClick={() => setIsOpen(true)}>{words.resume}</button>
          )}
          {isUnlocked && (
            <div className="perk-unlocked" role="status" data-testid="newsletter-unlocked">
              <div className="perk-success"><Check size={16} aria-hidden="true" />{words.verified}</div>
              <h3>{copy.newsletter.perksTitle}</h3>
              <ul>{copy.newsletter.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="verification-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section className="verification-dialog" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <button className="verification-close" type="button" onClick={() => setIsOpen(false)} aria-label={words.close}>
              <X size={20} />
            </button>
            <span className="eyebrow">{words.eyebrow}</span>
            <h2 id="verification-title">{words.modalTitle}</h2>
            <p>{words.modalDescription.replace('{email}', email)}</p>
            <div className="otp-sent-notice" role="status"><Check size={15} aria-hidden="true" />{words.sent}</div>
            <form className="verification-form" onSubmit={verifyCode} noValidate>
              <label htmlFor="newsletter-otp">{words.codeLabel}</label>
              <input
                id="newsletter-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                value={enteredCode}
                onChange={(event) => {
                  setEnteredCode(event.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                dir="ltr"
                autoFocus
                required
                aria-invalid={Boolean(error)}
                data-testid="newsletter-otp"
              />
              {error && <p className="newsletter-error" role="alert">{error}</p>}
              <button type="submit" className="newsletter-submit" disabled={verifyOtp.isPending} data-testid="newsletter-verify">
                {verifyOtp.isPending ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : words.verify}
                {!verifyOtp.isPending && <Check size={16} aria-hidden="true" />}
              </button>
            </form>
            <button type="button" className="otp-resend" onClick={() => void sendCode()} disabled={sendOtp.isPending}>
              {sendOtp.isPending ? <LoaderCircle className="loading-icon" size={14} aria-hidden="true" /> : words.resend}
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
