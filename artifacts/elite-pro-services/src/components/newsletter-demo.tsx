import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle, X } from 'lucide-react';
import { SiApple, SiGithub, SiGoogle } from 'react-icons/si';
import type { Locale, SiteCopy } from '@/data/translations';
import type { ClientProfile } from './client-profile-menu';

type NewsletterDemoProps = {
  copy: SiteCopy;
  locale: Locale;
  profile: ClientProfile | null;
  isProfileLoading: boolean;
  onVerified: (profile: ClientProfile) => void;
};
type OtpChallenge = { challengeId: string; expiresInSeconds: number; mode: 'email' };

async function requestOtp<T>(url: string, payload: Record<string, string>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw { data: result };
  return result as T;
}

const ui: Record<Locale, {
  eyebrow: string; first: string; second: string; description: string; fullName: string; fullNamePlaceholder: string;
  email: string; placeholder: string; submit: string; deliveryNote: string; socialGoogle: string; socialGithub: string;
  socialApple: string; oauthUnavailable: string; modalTitle: string; modalDescription: string; sent: string;
  codeLabel: string; verify: string; close: string; resume: string; resend: string; resendIn: string;
  invalidEmail: string; invalidName: string; invalidCode: string; expired: string; rateLimited: string;
  providerMissing: string; sendFailed: string; verified: string; accountWelcome: string; loadingProfile: string;
}> = {
  ar: {
    eyebrow: 'بوابة العملاء / 03', first: 'حسابك،', second: 'بتحقق آمن.',
    description: 'أنشئ حسابك ببريدك الإلكتروني واستمتع بمزايا العملاء. سنرسل رمز تحقق حقيقي إلى بريدك.',
    fullName: 'الاسم الكامل', fullNamePlaceholder: 'اكتب اسمك الكامل', email: 'البريد الإلكتروني', placeholder: 'name@example.com', submit: 'استمرار',
    deliveryNote: 'رمز تحقق من 6 أرقام سيصلك عبر البريد الإلكتروني.',
    socialGoogle: 'المتابعة عبر Google', socialGithub: 'المتابعة عبر GitHub', socialApple: 'المتابعة عبر Apple',
    oauthUnavailable: 'الدخول عبر هذا المزود يحتاج إعداداً خارجياً. استخدم التحقق بالبريد الإلكتروني حالياً.',
    modalTitle: 'تحقق من بريدك', modalDescription: 'أرسلنا رمزاً إلى {email}. أدخله هنا خلال 10 دقائق.',
    sent: 'تم إرسال الرمز إلى بريدك.', codeLabel: 'رمز التحقق المكوّن من 6 أرقام',
    verify: 'تأكيد الرمز', close: 'إغلاق', resume: 'متابعة التحقق', resend: 'إعادة إرسال الرمز', resendIn: 'إعادة الإرسال خلال {seconds} ثانية',
    invalidEmail: 'أدخل عنوان بريد إلكتروني صالحاً.', invalidName: 'أدخل اسمك الكامل.',
    invalidCode: 'الرمز غير صحيح. راجع الرسالة وحاول مرة أخرى.',
    expired: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.', rateLimited: 'طلبات كثيرة. انتظر قليلاً قبل المحاولة مجدداً.',
    providerMissing: 'إرسال البريد الإلكتروني غير متاح حالياً.',
    sendFailed: 'تعذّر إرسال الرمز. حاول مرة أخرى بعد قليل.',
    verified: 'تم التحقق من بريدك. مزايا العملاء متاحة الآن.', accountWelcome: 'حسابك جاهز ومفعّل.', loadingProfile: 'جارٍ التحقق من حالة الحساب…',
  },
  en: {
    eyebrow: 'Client access / 03', first: 'Your account,', second: 'verified by email.',
    description: 'Create your account with a real email verification code and unlock client perks.',
    fullName: 'Full name', fullNamePlaceholder: 'Enter your full name', email: 'Email address', placeholder: 'name@example.com', submit: 'Continue',
    deliveryNote: 'A six-digit verification code will be sent to your inbox.',
    socialGoogle: 'Continue with Google', socialGithub: 'Continue with GitHub', socialApple: 'Continue with Apple',
    oauthUnavailable: 'This sign-in provider needs external setup. Use email verification for now.',
    modalTitle: 'Check your inbox', modalDescription: 'We sent a code to {email}. Enter it within 10 minutes.',
    sent: 'A verification code was sent to your inbox.', codeLabel: '6-digit verification code',
    verify: 'Confirm code', close: 'Close', resume: 'Continue verification', resend: 'Send a new code', resendIn: 'Resend in {seconds}s',
    invalidEmail: 'Enter a valid email address.', invalidName: 'Enter your full name.',
    invalidCode: 'That code is not correct. Check the email and try again.',
    expired: 'That code expired. Request a new one.', rateLimited: 'Too many requests. Wait a little before trying again.',
    providerMissing: 'Email verification is temporarily unavailable.',
    sendFailed: 'We could not send the code. Please try again shortly.',
    verified: 'Your email is verified. Client perks are now unlocked.', accountWelcome: 'Your account is active.', loadingProfile: 'Checking your account…',
  },
  fr: {
    eyebrow: 'Accès client / 03', first: 'Votre compte,', second: 'vérifié par e-mail.',
    description: 'Créez votre compte avec un vrai code envoyé par e-mail et accédez aux avantages clients.',
    fullName: 'Nom complet', fullNamePlaceholder: 'Saisissez votre nom complet', email: 'Adresse e-mail', placeholder: 'name@example.com', submit: 'Continuer',
    deliveryNote: 'Un code de vérification à six chiffres sera envoyé dans votre boîte mail.',
    socialGoogle: 'Continuer avec Google', socialGithub: 'Continuer avec GitHub', socialApple: 'Continuer avec Apple',
    oauthUnavailable: 'Ce fournisseur nécessite une configuration externe. Utilisez la vérification par e-mail.',
    modalTitle: 'Vérifiez votre boîte mail', modalDescription: 'Un code a été envoyé à {email}. Saisissez-le sous 10 minutes.',
    sent: 'Un code de vérification a été envoyé.', codeLabel: 'Code de vérification à six chiffres',
    verify: 'Confirmer le code', close: 'Fermer', resume: 'Continuer la vérification', resend: 'Renvoyer un code', resendIn: 'Renvoyer dans {seconds}s',
    invalidEmail: 'Saisissez une adresse e-mail valide.', invalidName: 'Saisissez votre nom complet.',
    invalidCode: 'Ce code est incorrect. Vérifiez le message et réessayez.',
    expired: 'Ce code a expiré. Demandez-en un nouveau.', rateLimited: 'Trop de demandes. Réessayez dans un instant.',
    providerMissing: 'La vérification par e-mail est temporairement indisponible.',
    sendFailed: 'Impossible d’envoyer le code. Réessayez dans un instant.',
    verified: 'Votre adresse est vérifiée. Vos avantages clients sont accessibles.', accountWelcome: 'Votre compte est actif.', loadingProfile: 'Vérification du compte…',
  },
  es: {
    eyebrow: 'Acceso de clientes / 03', first: 'Tu cuenta,', second: 'verificada por correo.',
    description: 'Crea tu cuenta con un código de verificación real y accede a las ventajas para clientes.',
    fullName: 'Nombre completo', fullNamePlaceholder: 'Introduce tu nombre completo', email: 'Correo electrónico', placeholder: 'name@example.com', submit: 'Continuar',
    deliveryNote: 'Enviaremos un código de verificación de seis dígitos a tu bandeja de entrada.',
    socialGoogle: 'Continuar con Google', socialGithub: 'Continuar con GitHub', socialApple: 'Continuar con Apple',
    oauthUnavailable: 'Este proveedor requiere configuración externa. Usa la verificación por correo.',
    modalTitle: 'Revisa tu bandeja de entrada', modalDescription: 'Enviamos un código a {email}. Introdúcelo en 10 minutos.',
    sent: 'Se ha enviado un código de verificación.', codeLabel: 'Código de verificación de 6 dígitos',
    verify: 'Confirmar código', close: 'Cerrar', resume: 'Continuar la verificación', resend: 'Enviar un código nuevo', resendIn: 'Reenviar en {seconds}s',
    invalidEmail: 'Introduce una dirección de correo válida.', invalidName: 'Introduce tu nombre completo.',
    invalidCode: 'El código no es correcto. Revisa el correo e inténtalo de nuevo.',
    expired: 'El código ha caducado. Solicita uno nuevo.', rateLimited: 'Demasiadas solicitudes. Espera un poco y vuelve a intentarlo.',
    providerMissing: 'La verificación por correo no está disponible temporalmente.',
    sendFailed: 'No se pudo enviar el código. Inténtalo de nuevo pronto.',
    verified: 'Tu correo está verificado. Ya puedes acceder a las ventajas para clientes.', accountWelcome: 'Tu cuenta está activa.', loadingProfile: 'Comprobando tu cuenta…',
  },
  de: {
    eyebrow: 'Kundenzugang / 03', first: 'Ihr Konto,', second: 'per E-Mail bestätigt.',
    description: 'Erstellen Sie Ihr Konto mit einem echten E-Mail-Code und schalten Sie Kundenvorteile frei.',
    fullName: 'Vollständiger Name', fullNamePlaceholder: 'Geben Sie Ihren Namen ein', email: 'E-Mail-Adresse', placeholder: 'name@example.com', submit: 'Weiter',
    deliveryNote: 'Ein sechsstelliger Bestätigungscode wird an Ihr Postfach gesendet.',
    socialGoogle: 'Mit Google fortfahren', socialGithub: 'Mit GitHub fortfahren', socialApple: 'Mit Apple fortfahren',
    oauthUnavailable: 'Dieser Anbieter benötigt eine externe Einrichtung. Nutzen Sie vorerst die E-Mail-Verifizierung.',
    modalTitle: 'Posteingang prüfen', modalDescription: 'Wir haben einen Code an {email} gesendet. Geben Sie ihn innerhalb von 10 Minuten ein.',
    sent: 'Ein Bestätigungscode wurde gesendet.', codeLabel: 'Sechsstelliger Bestätigungscode',
    verify: 'Code bestätigen', close: 'Schließen', resume: 'Verifizierung fortsetzen', resend: 'Neuen Code senden', resendIn: 'Erneut senden in {seconds}s',
    invalidEmail: 'Geben Sie eine gültige E-Mail-Adresse ein.', invalidName: 'Geben Sie Ihren vollständigen Namen ein.',
    invalidCode: 'Der Code ist falsch. Prüfen Sie die E-Mail und versuchen Sie es erneut.',
    expired: 'Der Code ist abgelaufen. Fordern Sie einen neuen an.', rateLimited: 'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.',
    providerMissing: 'Die E-Mail-Verifizierung ist vorübergehend nicht verfügbar.',
    sendFailed: 'Der Code konnte nicht gesendet werden. Versuchen Sie es später erneut.',
    verified: 'Ihre E-Mail ist bestätigt. Die Kundenvorteile sind jetzt freigeschaltet.', accountWelcome: 'Ihr Konto ist aktiv.', loadingProfile: 'Konto wird geprüft…',
  },
};

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('data' in error)) return undefined;
  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== 'object' || !('code' in data)) return undefined;
  const code = (data as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

export function NewsletterDemo({ copy, locale, profile, isProfileLoading, onVerified }: NewsletterDemoProps) {
  const words = ui[locale];
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [error, setError] = useState('');
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timeout = window.setTimeout(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [isOpen, resendSeconds]);

  const mapError = (issue: unknown, mode: 'send' | 'verify') => {
    const code = errorCode(issue);
    if (code === 'rate_limited' || code === 'attempt_limit' || code === 'resend_wait') return words.rateLimited;
    if (code === 'otp_expired') return words.expired;
    if (code === 'invalid_name') return words.invalidName;
    if (code === 'invalid_code') return words.invalidCode;
  if (code === 'email_not_configured') return words.providerMissing;
  return mode === 'send' ? words.sendFailed : words.invalidCode;

  };

  const sendCode = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim().replace(/\s+/g, ' ');
    if (!normalizedName || normalizedName.length > 80) {
      setError(words.invalidName);
      return;
    }
    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError(words.invalidEmail);
      return;
    }

    setError('');
    setEnteredCode('');
    setIsSending(true);
    try {
      const challenge = await requestOtp<OtpChallenge>('/api/send-otp', { email: normalizedEmail, fullName: normalizedName });
      setChallengeId(challenge.challengeId);
      setFullName(normalizedName);
      setEmail(normalizedEmail);
      setResendSeconds(60);
      setIsOpen(true);
    } catch (issue) {
      setError(mapError(issue, 'send'));
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeId || !/^\d{6}$/.test(enteredCode)) {
      setError(words.invalidCode);
      return;
    }
    setError('');
    setIsVerifying(true);
    try {
      const result = await requestOtp<{ verified: boolean; profile: ClientProfile }>('/api/verify-otp', { challengeId, code: enteredCode });
      if (!result.verified || !result.profile) throw { data: { code: 'invalid_code' } };
      onVerified(result.profile);
      setChallengeId(null);
      setIsOpen(false);
    } catch (issue) {
      setError(mapError(issue, 'verify'));
    } finally {
      setIsVerifying(false);
    }
  };

  const formatSeconds = (seconds: number) => {
    const value = String(seconds).padStart(2, '0');
    return locale === 'ar' ? value.replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]) : value;
  };

  const onOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    if (digits.length > 1) {
      setEnteredCode(digits);
      otpInputs.current[Math.min(digits.length - 1, 5)]?.focus();
    } else {
      const nextCode = enteredCode.padEnd(6, ' ').split('');
      nextCode[index] = digits || ' ';
      setEnteredCode(nextCode.join('').replace(/\s+$/, '').slice(0, 6));
      if (digits) otpInputs.current[Math.min(index + 1, 5)]?.focus();
    }
    setError('');
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
            {isProfileLoading ? (
              <div className="profile-loading" role="status"><LoaderCircle className="loading-icon" size={18} aria-hidden="true" />{words.loadingProfile}</div>
            ) : profile ? (
              <div className="perk-unlocked" role="status" data-testid="newsletter-unlocked">
                <div className="perk-success"><Check size={16} aria-hidden="true" />{words.verified}</div>
                <h3>{words.accountWelcome} {profile.fullName}</h3>
                <p className="profile-email" dir="ltr">{profile.email}</p>
                <ul>{copy.newsletter.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
              </div>
            ) : (
              <>
                <form className="newsletter-form" onSubmit={sendCode} noValidate>
                  <div className="field">
                    <label htmlFor="newsletter-name">{words.fullName}</label>
                    <input
                      id="newsletter-name"
                      type="text"
                      value={fullName}
                      onChange={(event) => { setFullName(event.target.value); setError(''); }}
                      placeholder={words.fullNamePlaceholder}
                      autoComplete="name"
                      maxLength={80}
                      required
                      aria-invalid={Boolean(error)}
                      data-testid="newsletter-name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="newsletter-email">{words.email}</label>
                    <div className="newsletter-input-row">
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(event) => { setEmail(event.target.value); setError(''); }}
                        placeholder={words.placeholder}
                        autoComplete="email"
                        dir="ltr"
                        required
                        aria-invalid={Boolean(error)}
                        aria-describedby="newsletter-note"
                        data-testid="newsletter-email"
                      />
                      <button type="submit" className="newsletter-submit" disabled={isSending} data-testid="newsletter-start" aria-busy={isSending}>
                        {isSending ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : words.submit}
                        {!isSending && <ArrowLeft size={16} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </form>
                <p className="demo-disclosure" id="newsletter-note"><span className="demo-indicator" />{words.deliveryNote}</p>
                <div className="social-login-options" aria-label="خيارات تسجيل الدخول">
                  <button type="button" onClick={() => setError(words.oauthUnavailable)}><SiGoogle aria-hidden="true" />{words.socialGoogle}</button>
                  <button type="button" onClick={() => setError(words.oauthUnavailable)}><SiGithub aria-hidden="true" />{words.socialGithub}</button>
                  <button type="button" onClick={() => setError(words.oauthUnavailable)}><SiApple aria-hidden="true" />{words.socialApple}</button>
                </div>
                {error && !isOpen && <p className="newsletter-error" role="alert">{error}</p>}
                {challengeId && !isOpen && (
                  <button className="otp-resume" type="button" onClick={() => setIsOpen(true)}>{words.resume}</button>
                )}
              </>
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
          <section ref={dialogRef} className="verification-dialog" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <button className="verification-close" type="button" onClick={() => setIsOpen(false)} aria-label={words.close}>
              <X size={20} />
            </button>
            <span className="eyebrow">{words.eyebrow}</span>
            <h2 id="verification-title">{words.modalTitle}</h2>
            <p>{words.modalDescription.replace('{email}', email)}</p>
            <div className="otp-sent-notice" role="status"><Check size={15} aria-hidden="true" />{words.sent}</div>
            <form className="verification-form" onSubmit={verifyCode} noValidate>
              <label id="newsletter-otp-label" htmlFor="newsletter-otp-0">{words.codeLabel}</label>
              <div className="otp-code-inputs" role="group" aria-labelledby="newsletter-otp-label" dir="ltr">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    id={`newsletter-otp-${index}`}
                    ref={(input) => { otpInputs.current[index] = input; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={6}
                    value={enteredCode[index] === ' ' ? '' : enteredCode[index] ?? ''}
                    onChange={(event) => onOtpChange(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && (!enteredCode[index] || enteredCode[index] === ' ') && index > 0) otpInputs.current[index - 1]?.focus();
                      if (event.key === 'ArrowLeft' && index > 0) otpInputs.current[index - 1]?.focus();
                      if (event.key === 'ArrowRight' && index < 5) otpInputs.current[index + 1]?.focus();
                    }}
                    dir="ltr"
                    autoFocus={index === 0}
                    required
                    aria-invalid={Boolean(error)}
                    data-testid={index === 0 ? 'newsletter-otp' : `newsletter-otp-${index}`}
                  />
                ))}
              </div>
              {error && <p className="newsletter-error" role="alert">{error}</p>}
              <button type="submit" className="newsletter-submit" disabled={isVerifying || !/^\d{6}$/.test(enteredCode)} data-testid="newsletter-verify" aria-busy={isVerifying}>
                {isVerifying ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : words.verify}
                {!isVerifying && <Check size={16} aria-hidden="true" />}
              </button>
            </form>
            <button type="button" className="otp-resend" onClick={() => void sendCode()} disabled={isSending || resendSeconds > 0} aria-live="polite">
              {isSending ? <LoaderCircle className="loading-icon" size={14} aria-hidden="true" /> : resendSeconds > 0 ? words.resendIn.replace('{seconds}', formatSeconds(resendSeconds)) : words.resend}
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
