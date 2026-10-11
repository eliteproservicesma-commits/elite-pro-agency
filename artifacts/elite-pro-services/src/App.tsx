import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
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
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const closeMenu = () => setMenuOpen(false);
  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const service = String(form.get('service') || '').trim();
    const details = String(form.get('details') || '').trim();
    const message = [
      'السلام عليكم، أرغب في مناقشة مشروع رقمي مع Elite Pro Services.',
      `الاسم: ${name}`,
      `البريد الإلكتروني: ${email}`,
      `الخدمة المطلوبة: ${service}`,
      `تفاصيل المشروع: ${details || 'أود مناقشة الفكرة معكم.'}`,
    ].join('\n');
    window.open(`https://wa.me/212722016229?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <main className="site-shell" dir="rtl" lang="ar">
      <header className="topbar">
        <div className="nav-inner">
          <a href="#home" className="brand" aria-label="Elite Pro Services — الرئيسية">
            <img src="/assets/elite-pro-logo.webp" alt="شعار Elite Pro Services" />
            <span>ELITE <b>PRO</b> SERVICES</span>
          </a>
          <nav className="nav-links" aria-label="التنقل الرئيسي">
            <a href="#home">الرئيسية</a>
            <a href="#services">الخدمات</a>
            <a href="#work">الأعمال</a>
            <a href="#studio">عن الاستوديو</a>
          </nav>
          <a className="nav-contact" href="#contact">ابدأ مشروعك <ArrowLeft size={14} /></a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu-toggle">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="التنقل على الهاتف">
            <a href="#home" onClick={closeMenu}>الرئيسية</a>
            <a href="#services" onClick={closeMenu}>الخدمات</a>
            <a href="#work" onClick={closeMenu}>الأعمال</a>
            <a href="#studio" onClick={closeMenu}>عن الاستوديو</a>
            <a href="#contact" onClick={closeMenu}>ابدأ مشروعك</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="hero-location"><span className="live-dot" /> استوديو رقمي مستقل · طنجة، المغرب</div>
            <h1>فكرتك،<span>بصوتها الرقمي.</span></h1>
            <p className="hero-desc">نبني مواقع وتطبيقات وتجارب رقمية لها حضورها الخاص. تصميم مدروس، تقنية متقنة، ولمسة إبداعية تنطلق من طنجة إلى العالم.</p>
            <div className="hero-actions">
              <a className="pill-button" href="#contact">لنتحدث عن مشروعك <ArrowLeft size={16} /></a>
              <a className="text-link" href="#work">اكتشف الأعمال <ArrowDown size={15} /></a>
            </div>
          </div>
          <div className="hero-art" aria-label="عمل فني تجريدي يعكس التجارب الرقمية">
            <div className="art-orbit" />
            <img className="hero-liquid" src="/assets/abstract-fluid.png" alt="تكوين ثلاثي الأبعاد من الأشكال السائلة البنفسجية" />
            <img className="hero-ai" src="/assets/ai-portrait.webp" alt="صورة فنية لشخصية ذكاء اصطناعي" />
            <div className="art-caption">DIGITAL<br />WORLDS<br />MADE HERE</div>
          </div>
        </div>
        <span className="hero-index">01 — 05&nbsp; / &nbsp;ELITE PRO SERVICES</span>
        <a className="hero-scroll" href="#services">مرّر لاكتشاف المزيد <i /></a>
      </section>

      <div className="ticker" aria-label="مجالات عمل الاستوديو">
        <div className="ticker-inner" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span className="ticker-inner" key={copy}>
              <span>تصميم الويب</span><b /><span>تطوير التطبيقات</span><b /><span>تجارب ثلاثية الأبعاد</span><b /><span>الذكاء الاصطناعي</span><b /><span>التسويق الرقمي</span><b /><span>طنجة · المغرب</span><b />
            </span>
          ))}
        </div>
      </div>

      <section className="section wrap" id="services">
        <div className="section-head">
          <div><div className="eyebrow section-kicker">ما نصنعه / 01</div><h2>من أول فكرة،<br />إلى تجربة متكاملة.</h2></div>
          <p className="section-intro">لا نبدأ من قالب جاهز. نبدأ بفهم مشروعك، ثم نصمم ونبني ما يحتاجه بالضبط — بوضوح واهتمام بالتفاصيل.</p>
        </div>
        <div className="service-list">
          {[
            { icon: <Code2 size={19} />, name: 'مواقع الويب والمنصات الرقمية', en: 'Web design & development', text: 'مواقع تعريفية ومتاجر ومنصات أعمال، بتصميم متجاوب وتجربة استخدام واضحة.' },
            { icon: <Smartphone size={19} />, name: 'تطبيقات الهاتف', en: 'App development', text: 'واجهات وتطبيقات عملية للهاتف، من تصور التجربة إلى بناء المنتج.' },
            { icon: <Layers3 size={19} />, name: 'تجارب 3D وذكاء اصطناعي', en: '3D, motion & AI', text: 'محتوى بصري تفاعلي، موشن جرافيك، وحلول ذكية تضيف بعداً جديداً للعلامة.' },
            { icon: <Megaphone size={19} />, name: 'التسويق والنمو الرقمي', en: 'Digital marketing', text: 'تحسين محركات البحث، التسويق بالمحتوى والبريد، الحملات المدفوعة وإدارة السمعة.' },
          ].map((service, index) => (
            <article className="service-row" key={service.en}>
              <span className="service-no">0{index + 1}</span>
              <div className="service-content"><h3>{service.name}</h3><p>{service.text}</p></div>
              <span className="service-icon" title={service.en}>{service.icon}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="wrap">
          <div className="section-head work-head">
            <div><div className="eyebrow section-kicker">مختارات / 02</div><h2>أفكار تأخذ شكلها<br />على الشاشة.</h2></div>
            <p className="section-intro">نماذج من اتجاهات وتجارب رقمية نعمل عليها. كل مشروع يبدأ بسؤال مختلف، وكل شاشة لها غرضها.</p>
          </div>
          <div className="project-grid">
            <article className="project-card">
              <img className="project-image" src="/assets/project-fashion-app.webp" alt="تصميم واجهات تطبيق أزياء على هاتفين" />
              <div className="project-meta"><h3>Pypo Finance 3D App</h3><span>تجربة تطبيق · واجهات رقمية</span></div>
              <div className="project-count">01 — PRODUCT EXPERIENCE</div>
            </article>
            <article className="project-card">
              <img className="project-image" src="/assets/project-portfolio-app.webp" alt="تصاميم تطبيق محفظة أعمال وملف إبداعي" />
              <div className="project-meta"><h3>Auto École Touijer</h3><span>منصة ويب · طنجة</span></div>
              <div className="project-count">02 — DIGITAL PLATFORM</div>
            </article>
            <article className="project-card">
              <img className="project-image" src="/assets/project-builder-app.webp" alt="تصميم تطبيق بناء وعرض محفظة أعمال على الهاتف" />
              <div className="project-meta"><h3>Maestro Business Catalog</h3><span>كتالوج أعمال · تجربة تفاعلية</span></div>
              <div className="project-count">03 — MOBILE PRODUCT</div>
            </article>
          </div>
          <a className="text-link" href="https://drive.google.com/drive/folders/1sQWOJKDH3xDaEO2dSw3IcrQ_Flxa-R1_" target="_blank" rel="noreferrer" style={{ color: '#33383b', marginTop: 42 }}>تصفّح أرشيف الأعمال <ArrowUpLeft size={16} /></a>
        </div>
      </section>

      <section className="section wrap" id="studio">
        <div className="studio">
          <div className="studio-visual">
            <span className="studio-mark">A HUMAN APPROACH TO DIGITAL</span>
            <img src="/assets/ai-liquid-portrait.webp" alt="بورتريه فني بتأثيرات لونية سائلة" />
          </div>
          <div className="studio-copy">
            <div className="eyebrow">عن الاستوديو / 03</div>
            <h2>فريق صغير.<br />فضول لا يهدأ.</h2>
            <p>Elite Pro Services استوديو إبداع رقمي يقوده عمران شتوان من مسنانة، طنجة. نعمل عند تقاطع التصميم والتقنية لنحوّل الأفكار الطموحة إلى تجارب مفهومة، جميلة، وقابلة للاستخدام.</p>
            <p>نتعاون مع الشركات والعلامات التجارية التي تبحث عن حضور رقمي واضح — من أول سطر في الموقع، إلى آخر تفصيلة في المنتج.</p>
            <div className="founder">
              <span className="founder-initials">IC</span>
              <span><strong>عمران شتوان</strong><small>المؤسس والمدير الإبداعي · The Lone Don</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow section-kicker">كيف نعمل / 04</div><h2>مسار واضح.<br />نتيجة لها معنى.</h2></div>
            <p className="section-intro">عمل جيد يبدأ بتواصل صريح. هذه هي الخطوات التي تحوّل الفكرة إلى تجربة رقمية قابلة للحياة.</p>
          </div>
          <div className="process-grid">
            {[
              ['01', 'نستمع', 'نتعرف على نشاطك وجمهورك وما تريد أن تحققه.'],
              ['02', 'نرسم الاتجاه', 'نحدد البنية والأسلوب البصري وأولويات التجربة.'],
              ['03', 'نصمم ونبني', 'نحوّل الاتجاه إلى تجربة حقيقية مع مراجعة التفاصيل معك.'],
              ['04', 'نطلق ونطوّر', 'نجهز الإطلاق ونبقى قريبين حين يحين وقت الخطوة التالية.'],
            ].map(([num, title, text]) => <article className="process-step" key={num}><span className="num">{num} /</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="contact wrap" id="contact">
        <div className="contact-panel">
          <aside className="contact-aside">
            <div className="eyebrow">مساحتك القادمة تبدأ هنا / 05</div>
            <h2>لديك فكرة؟<br />نحن نصغي.</h2>
            <p>أخبرنا قليلاً عن مشروعك. ستُفتح رسالة واتساب جاهزة بتفاصيلك لتراجعها وترسلها بنفسك.</p>
            <div className="contact-details">
              <a href="tel:+212722016229"><span className="detail-icon"><Smartphone size={17} /></span>+212 722 016 229</a>
              <a href="mailto:eliteproservices.ma@gmail.com"><span className="detail-icon"><Braces size={17} /></span>eliteproservices.ma@gmail.com</a>
              <div><span className="detail-icon"><MousePointer2 size={17} /></span>مسنانة، طنجة · المغرب</div>
            </div>
          </aside>
          <form className="contact-form" onSubmit={submitInquiry}>
            <h3>احكِ لنا عن مشروعك</h3>
            <p className="form-note">املأ التفاصيل وسنجهز لك رسالة واتساب لمراجعتها.</p>
            <div className="field-row">
              <div className="field"><label htmlFor="inquiry-name">الاسم الكامل</label><input id="inquiry-name" name="name" type="text" placeholder="كيف نناديك؟" autoComplete="name" required data-testid="input-name" /></div>
              <div className="field"><label htmlFor="inquiry-email">البريد الإلكتروني</label><input id="inquiry-email" name="email" type="email" placeholder="name@example.com" autoComplete="email" required data-testid="input-email" /></div>
            </div>
            <div className="field"><label htmlFor="inquiry-service">الخدمة المطلوبة</label>
              <select id="inquiry-service" name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required data-testid="select-service">
                <option value="" disabled>اختر ما يناسب فكرتك</option>
                <option value="تطوير مواقع الويب (Web Development)">تطوير مواقع الويب</option>
                <option value="تطوير التطبيقات (App Development)">تطوير التطبيقات</option>
                <option value="الموشن جرافيك والأنيماشن (Video Animation)">الموشن جرافيك والأنيماشن</option>
                <option value="التسويق بالمحتوى (Content Marketing)">التسويق بالمحتوى</option>
                <option value="التسويق عبر البريد (Email Marketing)">التسويق عبر البريد</option>
                <option value="إدارة السمعة الرقمية (Reputation Management)">إدارة السمعة الرقمية</option>
                <option value="تحسين محركات البحث (SEO)">تحسين محركات البحث</option>
                <option value="الإعلانات المدفوعة (PPC Marketing)">الإعلانات المدفوعة</option>
              </select>
            </div>
            <div className="field"><label htmlFor="inquiry-details">تفاصيل إضافية</label><textarea id="inquiry-details" name="details" placeholder="ما الفكرة التي تريد أن نبنيها معاً؟" data-testid="input-details" /></div>
            <button className="send-button" type="submit" data-testid="button-send-inquiry">{submitted ? <>فتحنا رسالتك في واتساب <Check size={16} /></> : <>جهّز رسالة واتساب <ArrowLeft size={16} /></>}</button>
            {submitted && <p className="form-success" role="status">رسالتك جاهزة في واتساب. راجعها ثم أرسلها للتواصل مع عمران.</p>}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a href="#home" className="brand footer-brand"><span>ELITE <b>PRO</b> SERVICES</span></a>
          <span>استوديو رقمي مستقل في طنجة، المغرب</span>
          <span>© {new Date().getFullYear()} Elite Pro Services</span>
          <a href="#home" className="to-top" aria-label="العودة إلى الأعلى"><ChevronUp size={17} /></a>
        </div>
      </footer>
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
