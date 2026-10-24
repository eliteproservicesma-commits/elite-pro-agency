import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, ChevronDown, CircleUserRound, Languages, LogOut, Settings2 } from 'lucide-react';
import type { Locale } from '@/data/translations';

export type ClientProfile = { email: string; fullName: string; verified: true };

type ClientProfileMenuProps = {
  profile: ClientProfile;
  locale: Locale;
  onSignedOut: () => void;
};

const words: Record<Locale, {
  account: string; verified: string; tier: string; manage: string; perks: string; settings: string;
  signOut: string; signingOut: string; signOutError: string;
}> = {
  ar: {
    account: 'حساب العميل', verified: 'بريد موثّق', tier: 'حساب مفعل - عميل مميز', manage: 'إدارة الحساب',
    perks: 'مزايا العملاء', settings: 'إعدادات اللغة', signOut: 'تسجيل الخروج', signingOut: 'جارٍ الخروج…',
    signOutError: 'تعذر تسجيل الخروج. حاول مرة أخرى.',
  },
  en: {
    account: 'Client account', verified: 'Verified email', tier: 'Verified client', manage: 'Manage account',
    perks: 'Client perks', settings: 'Language settings', signOut: 'Sign out', signingOut: 'Signing out…',
    signOutError: 'Sign out failed. Please try again.',
  },
  fr: {
    account: 'Compte client', verified: 'E-mail vérifié', tier: 'Client vérifié', manage: 'Gérer le compte',
    perks: 'Avantages clients', settings: 'Langue', signOut: 'Se déconnecter', signingOut: 'Déconnexion…',
    signOutError: 'La déconnexion a échoué. Réessayez.',
  },
  es: {
    account: 'Cuenta de cliente', verified: 'Correo verificado', tier: 'Cliente verificado', manage: 'Gestionar cuenta',
    perks: 'Ventajas para clientes', settings: 'Idioma', signOut: 'Cerrar sesión', signingOut: 'Cerrando sesión…',
    signOutError: 'No se pudo cerrar sesión. Inténtalo de nuevo.',
  },
  de: {
    account: 'Kundenkonto', verified: 'E-Mail bestätigt', tier: 'Verifizierter Kunde', manage: 'Konto verwalten',
    perks: 'Kundenvorteile', settings: 'Spracheinstellungen', signOut: 'Abmelden', signingOut: 'Abmeldung…',
    signOutError: 'Abmeldung fehlgeschlagen. Bitte erneut versuchen.',
  },
};

function initials(fullName: string) {
  return fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || 'EP';
}

export function ClientProfileMenu({ profile, locale, onSignedOut }: ClientProfileMenuProps) {
  const copy = words[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
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
        aria-label={`${copy.account}: ${profile.fullName}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="client-avatar" aria-hidden="true"><img src="/assets/client-avatar.png" alt="" /><span>{initials(profile.fullName)}</span></span>
        <span className="client-profile-trigger-copy"><strong>{profile.fullName}</strong><small>{copy.verified}</small></span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {isOpen && (
        <section className="client-profile-menu" aria-label={copy.account}>
          <div className="client-profile-summary">
            <span className="client-avatar client-avatar-large" aria-hidden="true"><img src="/assets/client-avatar.png" alt="" /><span>{initials(profile.fullName)}</span></span>
            <span className="client-profile-identity"><strong>{profile.fullName}</strong><small dir="ltr">{profile.email}</small></span>
          </div>
          <span className="client-tier"><BadgeCheck size={14} aria-hidden="true" />{copy.tier}</span>
          <div className="client-profile-links">
            <button type="button" onClick={() => scrollTo('newsletter')}><CircleUserRound size={15} aria-hidden="true" />{copy.manage}</button>
            <button type="button" onClick={() => scrollTo('newsletter')}><BadgeCheck size={15} aria-hidden="true" />{copy.perks}</button>
            <button type="button" onClick={() => scrollTo('language-select')}><Settings2 size={15} aria-hidden="true" />{copy.settings}<Languages size={14} className="client-profile-trailing-icon" aria-hidden="true" /></button>
          </div>
          {error && <p className="client-profile-error" role="alert">{error}</p>}
          <button className="client-signout" type="button" onClick={() => void signOut()} disabled={isSigningOut}>
            <LogOut size={15} aria-hidden="true" />{isSigningOut ? copy.signingOut : copy.signOut}
          </button>
        </section>
      )}
    </div>
  );
}
