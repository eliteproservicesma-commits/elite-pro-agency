import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { SiteCopy } from '@/data/translations';

type NewsletterDemoProps = { copy: SiteCopy };

export function NewsletterDemo({ copy }: NewsletterDemoProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const text = copy.newsletter;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const startDemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      setError(text.invalidEmail);
      return;
    }
    setError('');
    setIsUnlocked(false);
    setEnteredCode('');
    setCode(String(Math.floor(100000 + Math.random() * 900000)));
    setEmail('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCode('');
    setEnteredCode('');
    setError('');
  };

  const verifyDemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enteredCode.trim() !== code) {
      setError(text.invalidCode);
      return;
    }
    setError('');
    setIsUnlocked(true);
    closeModal();
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="wrap newsletter-panel">
        <div className="newsletter-copy">
          <div className="eyebrow">{text.eyebrow}</div>
          <h2>{text.first}<br />{text.second}</h2>
          <p>{text.description}</p>
        </div>
        <div className="newsletter-action">
          <form className="newsletter-form" onSubmit={startDemo} noValidate>
            <label htmlFor="newsletter-email">{text.email}</label>
            <div className="newsletter-input-row">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError('');
                }}
                placeholder={text.placeholder}
                autoComplete="email"
                dir="ltr"
                required
                aria-invalid={Boolean(error)}
                data-testid="newsletter-email"
              />
              <button type="submit" className="newsletter-submit" data-testid="newsletter-start">
                {text.submit}<ArrowLeft size={16} aria-hidden="true" />
              </button>
            </div>
          </form>
          <p className="demo-disclosure"><span className="demo-indicator" />{text.demoNotice}</p>
          {error && !isOpen && <p className="newsletter-error" role="alert">{error}</p>}
          {isUnlocked && (
            <div className="perk-unlocked" role="status" data-testid="newsletter-unlocked">
              <div className="perk-success"><Check size={16} aria-hidden="true" />{text.success}</div>
              <h3>{text.perksTitle}</h3>
              <ul>{text.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="verification-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section className="verification-dialog" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <button className="verification-close" type="button" onClick={closeModal} aria-label={text.close}>
              <X size={20} />
            </button>
            <span className="eyebrow">{text.eyebrow}</span>
            <h2 id="verification-title">{text.modalTitle}</h2>
            <p>{text.modalDescription}</p>
            <div className="demo-code-display" dir="ltr" aria-live="polite">{text.codeHint.replace('{code}', code)}</div>
            <form className="verification-form" onSubmit={verifyDemo}>
              <label htmlFor="demo-otp">{text.codeLabel}</label>
              <input
                id="demo-otp"
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
              <button type="submit" className="newsletter-submit" data-testid="newsletter-verify">{text.verify}<Check size={16} /></button>
            </form>
            <p className="verification-disclosure">{text.demoNotice}</p>
          </section>
        </div>
      )}
    </section>
  );
}
