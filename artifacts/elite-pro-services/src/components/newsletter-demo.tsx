import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle, X } from 'lucide-react';
import type { Locale, SiteCopy } from '@/data/translations';

type NewsletterDemoProps = { copy: SiteCopy; locale: Locale };
type OtpChallenge = {
  challengeId: string;
  expiresInSeconds: number;
  mode: 'email' | 'mock';
  mockCode?: string;
};

const mockCode = '123456';

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

function waitForMockResponse() {
  return new Promise((resolve) => window.setTimeout(resolve, 450));
}

const ui: Record<Locale, {
  eyebrow: string; first: string; second: string; description: string; email: string; placeholder: string;
  submit: string; deliveryNote: string; modalTitle: string; modalDescription: string; sent: string;
  codeLabel: string; verify: string; close: string; resume: string; resend: string;
  resendIn: string; mockSent: string; mockCodeLabel: string;
  invalidEmail: string; invalidCode: string; expired: string; rateLimited: string;
  providerMissing: string; sendFailed: string; verified: string;
}> = {
  ar: {
    eyebrow: 'التحقق عبر Gmail / 03', first: 'مزايا للعملاء،', second: 'مباشرة بعد التحقق.',
    description: 'أدخل عنوان Gmail لإرسال رمز من 6 أرقام إلى بريدك، ثم تحقّق للوصول إلى مزايا العملاء.',
    email: 'عنوان Gmail', placeholder: 'name@gmail.com', submit: 'أرسل رمز التحقق',
    deliveryNote: 'في الوضع التجريبي يظهر رمز الاختبار؛ وعند تفعيل البريد يصلك الرمز إلى Gmail.',
    modalTitle: 'تحقق من بريدك', modalDescription: 'أرسلنا رمزاً إلى {email}. أدخله هنا خلال 10 دقائق.',
    sent: 'تم إرسال الرمز إلى بريدك.', codeLabel: 'رمز التحقق المكوّن من 6 أرقام',
    verify: 'تأكيد الرمز', close: 'إغلاق', resume: 'متابعة التحقق',
    resend: 'إعادة إرسال الرمز', resendIn: 'إعادة الإرسال خلال {seconds} ثانية',
    mockSent: 'وضع تجريبي — استخدم رمز الاختبار التالي.', mockCodeLabel: 'رمز الاختبار: {code}',
    invalidEmail: 'أدخل عنوان Gmail صحيحاً ينتهي بـ @gmail.com.',
    invalidCode: 'الرمز غير صحيح. راجع الرسالة وحاول مرة أخرى.',
    expired: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.', rateLimited: 'طلبات كثيرة. انتظر قليلاً قبل المحاولة مجدداً.',
    providerMissing: 'إرسال البريد غير متاح حالياً. يلزم ربط حساب Gmail للإرسال الحقيقي.',
    sendFailed: 'تعذّر إرسال الرمز. حاول مرة أخرى بعد قليل.',
    verified: 'تم التحقق من بريدك. مزايا العملاء متاحة الآن.',
  },
  en: {
    eyebrow: 'Gmail verification / 03', first: 'Client perks,', second: 'once your email is verified.',
    description: 'Enter your Gmail address to receive a six-digit code, then verify it to unlock the client perks.',
    email: 'Gmail address', placeholder: 'name@gmail.com', submit: 'Send verification code',
    deliveryNote: 'Demo mode shows a test code; once email is enabled, codes arrive in your Gmail inbox.',
    modalTitle: 'Check your inbox', modalDescription: 'We sent a code to {email}. Enter it within 10 minutes.',
    sent: 'A verification code was sent to your inbox.', codeLabel: '6-digit verification code',
    verify: 'Confirm code', close: 'Close', resume: 'Continue verification',
    resend: 'Send a new code', resendIn: 'Resend in {seconds}s',
    mockSent: 'Demo mode — use the test code below.', mockCodeLabel: 'Test code: {code}',
    invalidEmail: 'Enter a valid Gmail address ending in @gmail.com.',
    invalidCode: 'That code is not correct. Check the email and try again.',
    expired: 'That code expired. Request a new one.', rateLimited: 'Too many requests. Wait a little before trying again.',
    providerMissing: 'Email sending is unavailable until a Gmail account is connected.',
    sendFailed: 'We could not send the code. Please try again shortly.',
    verified: 'Your email is verified. Client perks are now unlocked.',
  },
  fr: {
    eyebrow: 'Vérification Gmail / 03', first: 'Des avantages clients,', second: 'après vérification.',
    description: 'Saisissez votre adresse Gmail pour recevoir un code à six chiffres et accéder aux avantages clients.',
    email: 'Adresse Gmail', placeholder: 'name@gmail.com', submit: 'Envoyer le code',
    deliveryNote: 'Le mode démo affiche un code de test ; une fois l’envoi activé, le code arrive par Gmail.',
    modalTitle: 'Vérifiez votre boîte mail', modalDescription: 'Un code a été envoyé à {email}. Saisissez-le sous 10 minutes.',
    sent: 'Un code de vérification a été envoyé.', codeLabel: 'Code de vérification à six chiffres',
    verify: 'Confirmer le code', close: 'Fermer', resume: 'Continuer la vérification',
    resend: 'Renvoyer un code', resendIn: 'Renvoyer dans {seconds}s',
    mockSent: 'Mode démo — utilisez le code de test ci-dessous.', mockCodeLabel: 'Code de test : {code}',
    invalidEmail: 'Saisissez une adresse Gmail valide se terminant par @gmail.com.',
    invalidCode: 'Ce code est incorrect. Vérifiez le message et réessayez.',
    expired: 'Ce code a expiré. Demandez-en un nouveau.', rateLimited: 'Trop de demandes. Réessayez dans un instant.',
    providerMissing: 'L’envoi est indisponible tant qu’un compte Gmail n’est pas connecté.',
    sendFailed: 'Impossible d’envoyer le code. Réessayez dans un instant.',
    verified: 'Votre adresse est vérifiée. Vos avantages clients sont accessibles.',
  },
  es: {
    eyebrow: 'Verificación de Gmail / 03', first: 'Ventajas para clientes,', second: 'al verificar el correo.',
    description: 'Introduce tu Gmail para recibir un código de seis dígitos y desbloquear las ventajas para clientes.',
    email: 'Dirección de Gmail', placeholder: 'name@gmail.com', submit: 'Enviar código',
    deliveryNote: 'El modo de prueba muestra un código de test; al activar el envío llegará a tu Gmail.',
    modalTitle: 'Revisa tu bandeja de entrada', modalDescription: 'Enviamos un código a {email}. Introdúcelo en 10 minutos.',
    sent: 'Se ha enviado un código de verificación.', codeLabel: 'Código de verificación de 6 dígitos',
    verify: 'Confirmar código', close: 'Cerrar', resume: 'Continuar verificación',
    resend: 'Enviar un código nuevo', resendIn: 'Reenviar en {seconds}s',
    mockSent: 'Modo de prueba — usa el código de test siguiente.', mockCodeLabel: 'Código de prueba: {code}',
    invalidEmail: 'Introduce una dirección válida que termine en @gmail.com.',
    invalidCode: 'El código no es correcto. Revisa el correo e inténtalo de nuevo.',
    expired: 'El código ha caducado. Solicita uno nuevo.', rateLimited: 'Demasiadas solicitudes. Espera un poco y vuelve a intentarlo.',
    providerMissing: 'El envío no está disponible hasta conectar una cuenta de Gmail.',
    sendFailed: 'No se pudo enviar el código. Inténtalo de nuevo pronto.',
    verified: 'Tu correo está verificado. Ya puedes acceder a las ventajas para clientes.',
  },
  de: {
    eyebrow: 'Gmail-Verifizierung / 03', first: 'Kundenvorteile,', second: 'sobald die E-Mail bestätigt ist.',
    description: 'Geben Sie Ihre Gmail-Adresse ein. Sie erhalten einen sechsstelligen Code für den Zugang zu Kundenvorteilen.',
    email: 'Gmail-Adresse', placeholder: 'name@gmail.com', submit: 'Bestätigungscode senden',
    deliveryNote: 'Im Demo-Modus wird ein Testcode angezeigt; nach Aktivierung kommt er direkt per Gmail.',
    modalTitle: 'Posteingang prüfen', modalDescription: 'Wir haben einen Code an {email} gesendet. Geben Sie ihn innerhalb von 10 Minuten ein.',
    sent: 'Ein Bestätigungscode wurde gesendet.', codeLabel: 'Sechsstelliger Bestätigungscode',
    verify: 'Code bestätigen', close: 'Schließen', resume: 'Verifizierung fortsetzen',
    resend: 'Neuen Code senden', resendIn: 'Erneut senden in {seconds}s',
    mockSent: 'Demo-Modus — verwenden Sie den Testcode unten.', mockCodeLabel: 'Testcode: {code}',
    invalidEmail: 'Geben Sie eine gültige Gmail-Adresse mit @gmail.com ein.',
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
  const [email, setEmail] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [mockCodeForChallenge, setMockCodeForChallenge] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
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
    setIsSending(true);
    try {
      const challenge = import.meta.env.DEV
        ? (await waitForMockResponse(), {
            challengeId: `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            expiresInSeconds: 600,
            mode: 'mock' as const,
            mockCode,
          })
        : await requestOtp<OtpChallenge>('/api/send-otp', { email: normalizedEmail });
      setChallengeId(challenge.challengeId);
      setMockCodeForChallenge(challenge.mode === 'mock' ? challenge.mockCode ?? mockCode : null);
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
      if (mockCodeForChallenge) {
        await waitForMockResponse();
        if (enteredCode !== mockCodeForChallenge) throw { data: { code: 'invalid_code' } };
      } else {
        await requestOtp<{ verified: boolean }>('/api/verify-otp', { challengeId, code: enteredCode });
      }
      setIsUnlocked(true);
      setChallengeId(null);
      setMockCodeForChallenge(null);
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
              <button type="submit" className="newsletter-submit" disabled={isSending} data-testid="newsletter-start" aria-busy={isSending}>
                {isSending ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : words.submit}
                {!isSending && <ArrowLeft size={16} aria-hidden="true" />}
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
          <section ref={dialogRef} className="verification-dialog" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <button className="verification-close" type="button" onClick={() => setIsOpen(false)} aria-label={words.close}>
              <X size={20} />
            </button>
            <span className="eyebrow">{words.eyebrow}</span>
            <h2 id="verification-title">{words.modalTitle}</h2>
            <p>{words.modalDescription.replace('{email}', email)}</p>
            <div className="otp-sent-notice" role="status"><Check size={15} aria-hidden="true" />{mockCodeForChallenge ? words.mockSent : words.sent}</div>
            {mockCodeForChallenge && (
              <div className="demo-code-display" role="note" dir="ltr">
                {words.mockCodeLabel.replace('{code}', mockCodeForChallenge)}
              </div>
            )}
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
