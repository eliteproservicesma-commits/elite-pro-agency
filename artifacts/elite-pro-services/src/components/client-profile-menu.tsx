import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BadgeCheck, CircleUserRound, Languages, LogOut, Settings2 } from 'lucide-react';
import type { Locale } from '@/data/translations';

export type ClientProfile = { email: string; fullName: string; verified: true; avatarUrl?: string };

type ClientProfileMenuProps = {
  profile: ClientProfile;
  locale: Locale;
  perks: string[];
  onSignedOut: () => void;
};

const words: Record<Locale, {
  account: string; verified: string; tier: string; manage: string; perks: string; settings: string;
  signOut: string; signingOut: string; signOutError: string; back: string; emailLabel: string;
}> = {
  ar: {
    account: 'حساب العميل', verified: 'بريد موثّق', tier: 'حساب مفعل - عميل مميز', manage: 'إدارة الحساب',
    perks: 'مزايا العملاء', settings: 'إعدادات اللغة', signOut: 'تسجيل الخروج', signingOut: 'جارٍ الخروج…',
    signOutError: 'تعذر تسجيل الخروج. حاول مرة أخرى.', back: 'رجوع', emailLabel: 'البريد الإلكتروني',
  },
  en: {
    account: 'Client account', verified: 'Verified email', tier: 'Verified client', manage: 'Manage account',
    perks: 'Client perks', settings: 'Language settings', signOut: 'Sign out', signingOut: 'Signing out…',
    signOutError: 'Sign out failed. Please try again.', back: 'Back', emailLabel: 'Email address',
  },
  fr: {
    account: 'Compte client', verified: 'E-mail vérifié', tier: 'Client vérifié', manage: 'Gérer le compte',
    perks: 'Avantages clients', settings: 'Langue', signOut: 'Se déconnecter', signingOut: 'Déconnexion…',
    signOutError: 'La déconnexion a échoué. Réessayez.', back: 'Retour', emailLabel: 'Adresse e-mail',
  },
  es: {
    account: 'Cuenta de cliente', verified: 'Correo verificado', tier: 'Cliente verificado', manage: 'Gestionar cuenta',
    perks: 'Ventajas para clientes', settings: 'Idioma', signOut: 'Cerrar sesión', signingOut: 'Cerrando sesión…',
    signOutError: 'No se pudo cerrar sesión. Inténtalo de nuevo.', back: 'Volver', emailLabel: 'Correo electrónico',
  },
  de: {
    account: 'Kundenkonto', verified: 'E-Mail bestätigt', tier: 'Verifizierter Kunde', manage: 'Konto verwalten',
    perks: 'Kundenvorteile', settings: 'Spracheinstellungen', signOut: 'Abmelden', signingOut: 'Abmeldung…',
    signOutError: 'Abmeldung fehlgeschlagen. Bitte erneut versuchen.', back: 'Zurück', emailLabel: 'E-Mail-Adresse',
  },
};

function initials(fullName: string) {
  return fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || 'EP';
}

export function ClientProfileMenu({ profile, locale, perks, onSignedOut }: ClientProfileMenuProps) {
  const copy = words[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activePanel, setActivePanel] = useState<'account' | 'perks' | null>(null);
  const [error, setError] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const scrollTo = (target: string) => {
    setIsOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const signOut = async () => {
    setError('');
    setIsSigningOut(true);
    try {
      const response = await fetch('/api/profile', { method: 'DELETE', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Sign out failed');
      setIsOpen(false);
      onSignedOut();
    } catch {
      setError(copy.signOutError);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="client-profile" ref={rootRef}>
      <button
        className="client-profile-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="client-profile-menu"
        aria-label={`${copy.account}: ${profile.fullName}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="client-avatar" aria-hidden="true">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : <span>{initials(profile.fullName)}</span>}
        </span>

      </button>
      {isOpen && (
        <section id="client-profile-menu" className="client-profile-menu" aria-label={copy.account}>
          <div className="client-profile-summary">
            <span className="client-avatar client-avatar-large" aria-hidden="true">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : <span>{initials(profile.fullName)}</span>}
            </span>
            <span className="client-profile-identity"><strong>{profile.fullName}</strong><small dir="ltr">{profile.email}</small></span>
          </div>
          <span className="client-tier"><BadgeCheck size={14} aria-hidden="true" />{copy.tier}</span>
          {activePanel ? (
            <div className="client-profile-subpanel">
              <button className="client-profile-back" type="button" onClick={() => setActivePanel(null)}>
                <ArrowLeft size={14} aria-hidden="true" />{copy.back}
              </button>
              {activePanel === 'account' ? (
                <div className="client-account-details">
                  <span>{copy.emailLabel}</span><strong dir="ltr">{profile.email}</strong>
                  <span>{copy.verified}</span><strong>{copy.tier}</strong>
                </div>
              ) : (
                <ul className="client-perks-list">{perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
              )}
            </div>
          ) : (
            <div className="client-profile-links">
              <button type="button" onClick={() => setActivePanel('account')}><CircleUserRound size={15} aria-hidden="true" />{copy.manage}</button>
              <button type="button" onClick={() => setActivePanel('perks')}><BadgeCheck size={15} aria-hidden="true" />{copy.perks}</button>
              <button type="button" onClick={() => scrollTo('language-select')}><Settings2 size={15} aria-hidden="true" />{copy.settings}<Languages size={14} className="client-profile-trailing-icon" aria-hidden="true" /></button>
            </div>
          )}
          {error && <p className="client-profile-error" role="alert">{error}</p>}
          <button className="client-signout" type="button" onClick={() => void signOut()} disabled={isSigningOut}>
            <LogOut size={15} aria-hidden="true" />{isSigningOut ? copy.signingOut : copy.signOut}
          </button>
        </section>
      )}
    </div>
  );
}
