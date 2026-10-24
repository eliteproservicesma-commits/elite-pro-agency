import { type FormEvent, type ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { setBaseUrl } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowLeft,
  Braces,
  Check,
  ChevronUp,
  Code2,
  Layers3,
  Menu,
  Megaphone,
  MousePointer2,
  Smartphone,
  X,
} from 'lucide-react';
import { NewsletterDemo } from '@/components/newsletter-demo';
import { ClientProfileMenu, type ClientProfile } from '@/components/client-profile-menu';
import { PortfolioGallery } from '@/components/portfolio-gallery';
import { ClientTestimonials } from '@/components/client-testimonials';
import { ServiceFeatures } from '@/components/service-features';
import { TrustGuarantees } from '@/components/trust-guarantees';
import { PaymentCards } from '@/components/payment-cards';
import { FloatingAssistant } from '@/components/floating-assistant';
import { ProjectEstimator } from '@/components/project-estimator';
import { SoundToggle } from '@/components/sound-toggle';
import { localeOptions, translations, type Locale } from '@/data/translations';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const PlanetCanvas = lazy(() => import('@/components/planet-canvas'));
const queryClient = new QueryClient();
const profileQueryKey = ['client-profile'];
const signInLabels: Record<Locale, string> = {
  ar: 'تسجيل الدخول', en: 'Sign in', fr: 'Se connecter', es: 'Iniciar sesión', de: 'Anmelden',
};
const configuredApiOrigin = import.meta.env.VITE_API_BASE_URL?.trim();
if (configuredApiOrigin) setBaseUrl(configuredApiOrigin);

function Home() {
  const profileQuery = useQuery<ClientProfile | null>({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const response = await fetch('/api/profile', { credentials: 'same-origin' });
      if (response.status === 401) return null;
      if (!response.ok) throw new Error('Unable to load client profile');
      const result = await response.json() as { profile: ClientProfile | null };
      return result.profile;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const profile = profileQuery.data ?? null;
  const onVerified = (verifiedProfile: ClientProfile) => queryClient.setQueryData(profileQueryKey, verifiedProfile);
  const onSignedOut = () => queryClient.setQueryData(profileQueryKey, null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [locale, setLocale] = useState<Locale>('ar');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return window.localStorage.getItem('elite-pro-ui-sounds') === 'enabled';
    } catch {
      return false;
    }
  });
  const copy = translations[locale];
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem('elite-pro-ui-sounds', soundEnabled ? 'enabled' : 'muted');
    } catch {
      // Sound preference remains available for this session when storage is unavailable.
    }
  }, [soundEnabled]);

  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(decodeURIComponent(sectionId));
      if (!section) return;
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      section.scrollIntoView({ behavior: 'auto', block: 'start' });
      document.documentElement.style.scrollBehavior = previousBehavior;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const serviceValue = String(form.get('service') || '').trim();
    const service = copy.contact.options.find((option) => option.value === serviceValue)?.label || '';
    const details = String(form.get('details') || '').trim();
    const message = [
      copy.contact.whatsappIntro,
      `${copy.contact.name}: ${name}`,
      `${copy.contact.email}: ${email}`,
      `${copy.contact.service}: ${service}`,
      `${copy.contact.details}: ${details || copy.contact.detailsFallback}`,
    ].join('\n');
    window.open(`https://wa.me/212722016229?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <main className="site-shell" dir={direction} lang={locale}>
      <div className="planet-canvas" aria-hidden="true"><Suspense fallback={null}><PlanetCanvas /></Suspense></div>
      <header className="topbar">
        <div className="nav-inner">
          <a href="#home" className="brand" aria-label={`Elite Pro Services — ${copy.nav.home}`}>
            <img src="/assets/elite-pro-logo.webp" alt="Elite Pro Services" />
            <span>ELITE <b>PRO</b> SERVICES</span>
          </a>
          <nav className="nav-links" aria-label={copy.nav.contact}>
            <a href="#home">{copy.nav.home}</a>
            <a href="#services">{copy.nav.services}</a>
            <a href="#work">{copy.nav.work}</a>
            <a href="#studio">{copy.nav.studio}</a>
          </nav>
          <div className="nav-actions">
            <div className="nav-controls">
              <label className="language-picker">
                <span className="sr-only">{copy.language}</span>
                <select id="language-select" aria-label={copy.language} value={locale} onChange={(event) => setLocale(event.target.value as Locale)} data-testid="language-select">
                  {localeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <SoundToggle locale={locale} enabled={soundEnabled} onEnabledChange={setSoundEnabled} />
            </div>
            <a className="nav-contact" href="#contact">{copy.nav.start} <ArrowLeft size={14} /></a>
            <div className="nav-portal">
              {profile ? (
                <ClientProfileMenu profile={profile} locale={locale} perks={copy.newsletter.perks} onSignedOut={onSignedOut} />
              ) : (
                <button
                  className="portal-trigger login-trigger"
                  type="button"
                  onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                >
                  {signInLabels[locale]}
                </button>
              )}
            </div>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu-toggle">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label={copy.nav.contact}>
            <a href="#home" onClick={closeMenu}>{copy.nav.home}</a>
            <a href="#services" onClick={closeMenu}>{copy.nav.services}</a>
            <a href="#work" onClick={closeMenu}>{copy.nav.work}</a>
            <a href="#studio" onClick={closeMenu}>{copy.nav.studio}</a>
            <a href="#contact" onClick={closeMenu}>{copy.nav.start}</a>
            <div className="mobile-menu-controls">
              <label className="language-picker">
                <span className="sr-only">{copy.language}</span>
                <select id="mobile-language-select" aria-label={copy.language} value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
                  {localeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <SoundToggle locale={locale} enabled={soundEnabled} onEnabledChange={setSoundEnabled} playFeedback={false} />
            </div>
          </nav>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="hero-location"><span className="live-dot" /> {copy.hero.location}</div>
            <h1>{copy.hero.first}<span>{copy.hero.second}</span></h1>
            <p className="hero-desc">{copy.hero.description}</p>
            <div className="hero-actions">
              <a className="pill-button" href="#contact">{copy.hero.contact} <ArrowLeft size={16} /></a>
              <a className="text-link" href="#work">{copy.hero.work} <ArrowDown size={15} /></a>
            </div>
          </div>
          <div className="hero-art" aria-label={copy.studio.imageLabel}>
            <div className="art-orbit" />
            <img className="hero-liquid" src="/assets/abstract-fluid.png" alt={copy.studio.imageLabel} />
            <img className="hero-ai" src="/assets/ai-portrait.webp" alt={copy.studio.imageLabel} />
            <div className="art-caption">DIGITAL<br />WORLDS<br />MADE HERE</div>
          </div>
        </div>
        <span className="hero-index">{copy.hero.index}</span>
        <a className="hero-scroll" href="#services">{copy.hero.scroll} <i /></a>
      </section>

      <div className="ticker" aria-label={copy.services.eyebrow}>
        <div className="ticker-inner" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span className="ticker-inner" key={copy}>
              {translations[locale].ticker.map((item) => <span className="ticker-item" key={item}>{item}<b /></span>)}
            </span>
          ))}
        </div>
      </div>

      <section className="section wrap" id="services">
        <div className="section-head">
          <div><div className="eyebrow section-kicker">{copy.services.eyebrow}</div><h2>{copy.services.first}<br />{copy.services.second}</h2></div>
          <p className="section-intro">{copy.services.description}</p>
        </div>
        <div className="service-list">
          {copy.services.items.map((service, index) => {
            const icons = [<Code2 size={19} />, <Smartphone size={19} />, <Layers3 size={19} />, <Megaphone size={19} />];
            return (
            <article className="service-row" key={service.english}>
              <span className="service-no">0{index + 1}</span>
              <div className="service-content"><h3>{service.name}</h3><p>{service.description}</p></div>
              <span className="service-icon" title={service.english}>{icons[index]}</span>
            </article>
            );
          })}
        </div>
        <ServiceFeatures locale={locale} />
        <ProjectEstimator locale={locale} />
      </section>

      <PortfolioGallery copy={copy} />
      <ClientTestimonials locale={locale} />
      {!profile && !profileQuery.isLoading && (
        <NewsletterDemo
          copy={copy}
          locale={locale}
          profile={null}
          isProfileLoading={false}
          onVerified={onVerified}
        />
      )}

      <section className="section wrap" id="studio">
        <div className="studio">
          <div className="studio-visual">
            <span className="studio-mark">A HUMAN APPROACH TO DIGITAL</span>
            <img src="/assets/ai-liquid-portrait.webp" alt={copy.studio.imageLabel} />
          </div>
          <div className="studio-copy">
            <div className="eyebrow">{copy.studio.eyebrow}</div>
            <h2>{copy.studio.first}<br />{copy.studio.second}</h2>
            <p>{copy.studio.paragraphOne}</p>
            <p>{copy.studio.paragraphTwo}</p>
            <div className="founder">
              <span className="founder-initials">IC</span>
              <span><strong>{copy.studio.founder}</strong><small>{copy.studio.role}</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow section-kicker">{copy.process.eyebrow}</div><h2>{copy.process.first}<br />{copy.process.second}</h2></div>
            <p className="section-intro">{copy.process.description}</p>
          </div>
          <div className="process-grid">
            {copy.process.steps.map((step, index) => <article className="process-step" key={step.title}><span className="num">0{index + 1} /</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="contact wrap" id="contact">
        <div className="contact-panel">
          <aside className="contact-aside">
            <div className="eyebrow">{copy.contact.eyebrow}</div>
            <h2>{copy.contact.first}<br />{copy.contact.second}</h2>
            <p>{copy.contact.description}</p>
            <div className="contact-details">
              <a href="tel:+212722016229"><span className="detail-icon"><Smartphone size={17} /></span>+212 722 016 229</a>
              <a href="mailto:eliteproservices.ma@gmail.com"><span className="detail-icon"><Braces size={17} /></span>eliteproservices.ma@gmail.com</a>
              <div><span className="detail-icon"><MousePointer2 size={17} /></span>{copy.contact.location}</div>
            </div>
          </aside>
          <form className="contact-form" onSubmit={submitInquiry}>
            <h3>{copy.contact.formTitle}</h3>
            <p className="form-note">{copy.contact.formNote}</p>
            <div className="field-row">
              <div className="field"><label htmlFor="inquiry-name">{copy.contact.name}</label><input id="inquiry-name" name="name" type="text" placeholder={copy.contact.namePlaceholder} autoComplete="name" required data-testid="input-name" /></div>
              <div className="field"><label htmlFor="inquiry-email">{copy.contact.email}</label><input id="inquiry-email" name="email" type="email" placeholder={copy.contact.emailPlaceholder} autoComplete="email" required data-testid="input-email" /></div>
            </div>
            <div className="field"><label htmlFor="inquiry-service">{copy.contact.service}</label>
              <select id="inquiry-service" name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required data-testid="select-service">
                <option value="" disabled>{copy.contact.servicePlaceholder}</option>
                {copy.contact.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="inquiry-details">{copy.contact.details}</label><textarea id="inquiry-details" name="details" placeholder={copy.contact.detailsPlaceholder} data-testid="input-details" /></div>
            <button className="send-button" type="submit" data-testid="button-send-inquiry">{submitted ? <>{copy.contact.submitted} <Check size={16} /></> : <>{copy.contact.submit} <ArrowLeft size={16} /></>}</button>
            {submitted && <p className="form-success" role="status">{copy.contact.success}</p>}
          </form>
        </div>
      </section>

      <TrustGuarantees locale={locale} />
      <footer className="footer">
        <div className="wrap"><PaymentCards locale={locale} /></div>
        <div className="wrap footer-inner">
          <a href="#home" className="brand footer-brand"><span>ELITE <b>PRO</b> SERVICES</span></a>
          <span>{copy.footer.studio}</span>
          <span>© {new Date().getFullYear()} Elite Pro Services</span>
          <a href="#home" className="to-top" aria-label={copy.footer.backToTop}><ChevronUp size={17} /></a>
        </div>
      </footer>
      <FloatingAssistant locale={locale} />
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
