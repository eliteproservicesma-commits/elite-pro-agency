import type { GalleryCategory, GalleryDescription } from './gallery';

export type Locale = 'ar' | 'en' | 'fr' | 'es' | 'de';

export const localeOptions: { value: Locale; label: string }[] = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
];

type Service = { name: string; english: string; description: string };
type Step = { title: string; description: string };

export type SiteCopy = {
  language: string;
  nav: { home: string; services: string; work: string; studio: string; contact: string; start: string; openMenu: string; closeMenu: string };
  hero: { location: string; first: string; second: string; description: string; contact: string; work: string; scroll: string; index: string };
  ticker: string[];
  services: { eyebrow: string; first: string; second: string; description: string; items: Service[] };
  gallery: {
    eyebrow: string; first: string; second: string; description: string;
    archive: string; archiveNote: string; open: string; count: string;
    titleLabel: string; categoryLabel: string; descriptionLabel: string; locationLabel: string;
    close: string; previous: string; next: string; referenceNote: string;
  };
  newsletter: {
    eyebrow: string; first: string; second: string; description: string;
    email: string; placeholder: string; submit: string; demoNotice: string;
    modalTitle: string; modalDescription: string; codeLabel: string; codeHint: string;
    verify: string; close: string; invalidEmail: string; invalidCode: string;
    perksTitle: string; perks: string[]; success: string;
  };
  studio: { eyebrow: string; first: string; second: string; paragraphOne: string; paragraphTwo: string; founder: string; role: string; imageLabel: string };
  process: { eyebrow: string; first: string; second: string; description: string; steps: Step[] };
  contact: {
    eyebrow: string; first: string; second: string; description: string; formTitle: string; formNote: string;
    name: string; namePlaceholder: string; email: string; emailPlaceholder: string;
    service: string; servicePlaceholder: string; details: string; detailsPlaceholder: string;
    submit: string; submitted: string; success: string; whatsappIntro: string; detailsFallback: string; location: string;
    options: { value: string; label: string }[];
  };
  footer: { studio: string; backToTop: string };
  categories: Record<GalleryCategory, string>;
  locations: { tangier: string; global: string };
  galleryDescriptions: Record<GalleryDescription, string>;
};

export const translations: Record<Locale, SiteCopy> = {
  ar: {
    language: 'اللغة',
    nav: { home: 'الرئيسية', services: 'الخدمات', work: 'الأعمال', studio: 'عن الاستوديو', contact: 'اتصل بنا', start: 'ابدأ مشروعك', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة' },
    hero: { location: 'استوديو رقمي مستقل · طنجة، المغرب', first: 'فكرتك،', second: 'بصوتها الرقمي.', description: 'نبني مواقع وتطبيقات وتجارب رقمية لها حضورها الخاص. تصميم مدروس، تقنية متقنة، ولمسة إبداعية تنطلق من طنجة إلى العالم.', contact: 'لنتحدث عن مشروعك', work: 'اكتشف الأعمال', scroll: 'مرّر لاكتشاف المزيد', index: '01 — 05 / ELITE PRO SERVICES' },
    ticker: ['تصميم الويب', 'تطوير التطبيقات', 'تجارب ثلاثية الأبعاد', 'الذكاء الاصطناعي', 'التسويق الرقمي', 'طنجة · المغرب'],
    services: {
      eyebrow: 'ما نصنعه / 01', first: 'من أول فكرة،', second: 'إلى تجربة متكاملة.',
      description: 'لا نبدأ من قالب جاهز. نبدأ بفهم مشروعك، ثم نصمم ونبني ما يحتاجه بالضبط — بوضوح واهتمام بالتفاصيل.',
      items: [
        { name: 'مواقع الويب والمنصات الرقمية', english: 'Web design & development', description: 'مواقع تعريفية ومتاجر ومنصات أعمال، بتصميم متجاوب وتجربة استخدام واضحة.' },
        { name: 'تطبيقات الهاتف', english: 'App development', description: 'واجهات وتطبيقات عملية للهاتف، من تصور التجربة إلى بناء المنتج.' },
        { name: 'تجارب 3D وذكاء اصطناعي', english: '3D, motion & AI', description: 'محتوى بصري تفاعلي، موشن جرافيك، وحلول ذكية تضيف بعداً جديداً للعلامة.' },
        { name: 'التسويق والنمو الرقمي', english: 'Digital marketing', description: 'تحسين محركات البحث، التسويق بالمحتوى والبريد، الحملات المدفوعة وإدارة السمعة.' },
      ],
    },
    gallery: {
      eyebrow: 'معرض الصور / 02', first: 'أفكار تأخذ شكلها', second: 'على الشاشة.',
      description: 'معرض شامل للصور والمواد التي أُرفقت بالمشروع. تم تمييز لقطات المواقع والشعارات كمواد مرجعية، لا كدراسات حالة مؤكدة للاستوديو.',
      archive: 'تصفّح أرشيف الأعمال على Google Drive', archiveNote: 'أكثر من 163 عملاً في الأرشيف', open: 'افتح الصورة', count: 'صورة',
      titleLabel: 'عنوان المشروع', categoryLabel: 'التصنيف', descriptionLabel: 'نبذة', locationLabel: 'الموقع',
      close: 'إغلاق الصورة', previous: 'الصورة السابقة', next: 'الصورة التالية',
      referenceNote: 'مادة مرجعية مرفقة — ليست دراسة حالة مؤكدة لعميل.',
    },
    newsletter: {
      eyebrow: 'التحقق من Gmail والنشرة البريدية / 03', first: 'أفكار جديدة،', second: 'مباشرة إلى بريدك.',
      description: 'اشترك لتتابع أعمال الاستوديو وأفكار التصميم الرقمي. تجربة التحقق أدناه تجريبية فقط.',
      email: 'عنوان Gmail', placeholder: 'name@gmail.com', submit: 'ابدأ التحقق التجريبي',
      demoNotice: 'وضع تجريبي: لا يُرسل بريد إلكتروني، ولا يُحفظ العنوان، ولا يتم التحقق من ملكيته.',
      modalTitle: 'رمز التحقق التجريبي', modalDescription: 'هذه محاكاة للواجهة فقط. أدخل الرمز الظاهر هنا للمتابعة.',
      codeLabel: 'رمز من 6 أرقام', codeHint: 'رمز العرض التجريبي: {code}', verify: 'تحقق وافتح المزايا',
      close: 'إغلاق', invalidEmail: 'أدخل عنوان Gmail صحيحاً ينتهي بـ @gmail.com.', invalidCode: 'الرمز غير صحيح. استخدم الرمز الظاهر في هذه النافذة.',
      perksTitle: 'معاينة مزايا العملاء', perks: ['قائمة تحضير موجزة لمشروعك', 'معاينة مبكرة للأعمال الجديدة', 'طريقة مباشرة لبدء محادثة المشروع'],
      success: 'اكتملت المحاكاة. لم يُرسل بريد إلكتروني ولم يُحفظ العنوان.',
    },
    studio: {
      eyebrow: 'عن الاستوديو / 04', first: 'فريق صغير.', second: 'فضول لا يهدأ.',
      paragraphOne: 'Elite Pro Services استوديو إبداع رقمي يقوده عمران شتوان من مسنانة، طنجة. نعمل عند تقاطع التصميم والتقنية لنحوّل الأفكار الطموحة إلى تجارب مفهومة، جميلة، وقابلة للاستخدام.',
      paragraphTwo: 'نتعاون مع الشركات والعلامات التجارية التي تبحث عن حضور رقمي واضح — من أول سطر في الموقع، إلى آخر تفصيلة في المنتج.',
      founder: 'عمران شتوان', role: 'المؤسس والمدير الإبداعي · The Lone Don', imageLabel: 'عمل فني ثلاثي الأبعاد',
    },
    process: {
      eyebrow: 'كيف نعمل / 05', first: 'مسار واضح.', second: 'نتيجة لها معنى.',
      description: 'عمل جيد يبدأ بتواصل صريح. هذه هي الخطوات التي تحوّل الفكرة إلى تجربة رقمية قابلة للحياة.',
      steps: [
        { title: 'نستمع', description: 'نتعرف على نشاطك وجمهورك وما تريد أن تحققه.' },
        { title: 'نرسم الاتجاه', description: 'نحدد البنية والأسلوب البصري وأولويات التجربة.' },
        { title: 'نصمم ونبني', description: 'نحوّل الاتجاه إلى تجربة حقيقية مع مراجعة التفاصيل معك.' },
        { title: 'نطلق ونطوّر', description: 'نجهز الإطلاق ونبقى قريبين حين يحين وقت الخطوة التالية.' },
      ],
    },
    contact: {
      eyebrow: 'مساحتك القادمة تبدأ هنا / 06', first: 'لديك فكرة؟', second: 'نحن نصغي.',
      description: 'أخبرنا قليلاً عن مشروعك. ستُفتح رسالة واتساب جاهزة بتفاصيلك لتراجعها وترسلها بنفسك.',
      formTitle: 'احكِ لنا عن مشروعك', formNote: 'املأ التفاصيل وسنجهز لك رسالة واتساب لمراجعتها.',
      name: 'الاسم الكامل', namePlaceholder: 'كيف نناديك؟', email: 'البريد الإلكتروني', emailPlaceholder: 'name@example.com',
      service: 'الخدمة المطلوبة', servicePlaceholder: 'اختر ما يناسب فكرتك', details: 'تفاصيل إضافية',
      detailsPlaceholder: 'ما الفكرة التي تريد أن نبنيها معاً؟', submit: 'جهّز رسالة واتساب',
      submitted: 'فتحنا رسالتك في واتساب', success: 'رسالتك جاهزة في واتساب. راجعها ثم أرسلها للتواصل مع عمران.',
      whatsappIntro: 'السلام عليكم، أرغب في مناقشة مشروع رقمي مع Elite Pro Services.',
      detailsFallback: 'أود مناقشة الفكرة معكم.', location: 'مسنانة، طنجة · المغرب',
      options: [
        { value: 'web', label: 'تطوير مواقع الويب' }, { value: 'app', label: 'تطوير التطبيقات' },
        { value: 'motion', label: 'الموشن جرافيك والأنيماشن' }, { value: 'content', label: 'التسويق بالمحتوى' },
        { value: 'email', label: 'التسويق عبر البريد' }, { value: 'reputation', label: 'إدارة السمعة الرقمية' },
        { value: 'seo', label: 'تحسين محركات البحث' }, { value: 'ppc', label: 'الإعلانات المدفوعة' },
      ],
    },
    footer: { studio: 'استوديو رقمي مستقل في طنجة، المغرب', backToTop: 'العودة إلى الأعلى' },
    categories: { website: 'موقع ويب', webApp: 'منصة ويب', ecommerce: 'تجارة إلكترونية', mobileApp: 'تطبيق هاتف', branding: 'هوية بصرية', threeD: 'تجربة ثلاثية الأبعاد', photo: 'صورة مرجعية', reference: 'مرجع لموقع ويب', trust: 'شارة منصة' },
    locations: { tangier: 'طنجة، المغرب', global: 'عالمي' },
    galleryDescriptions: {
      productVisual: 'صورة منتج أو واجهة تجارية من الملفات المرفقة؛ معروضة كمادة مرجعية.',
      appVisual: 'واجهة أو تصور رقمي من الصور المرفقة؛ معروض كمرجع بصري.',
      brandVisual: 'صورة هوية أو شعار مرفق؛ لا تعني وحدها وجود علاقة عميل مؤكدة.',
      threeDVisual: 'عمل فني ثلاثي الأبعاد أو بالذكاء الاصطناعي من الصور المرفقة.',
      photoVisual: 'صورة مرجعية مرفقة ضمن مجموعة المواد البصرية.',
      siteReference: 'لقطة لموقع أُرفقت كمرجع للإلهام؛ ليست دراسة حالة مؤكدة للاستوديو.',
      trustVisual: 'شارة Trustpilot مرفقة كعنصر مرجعي، وليست تقييماً موثقاً للاستوديو.',
    },
  },
  en: {
    language: 'Language',
    nav: { home: 'Home', services: 'Services', work: 'Work', studio: 'Studio', contact: 'Contact', start: 'Start a project', openMenu: 'Open menu', closeMenu: 'Close menu' },
    hero: { location: 'Independent digital studio · Tangier, Morocco', first: 'Your idea,', second: 'in its digital voice.', description: 'We build websites, apps, and digital experiences with a presence of their own. Thoughtful design, considered technology, and a creative point of view from Tangier to the world.', contact: 'Talk about your project', work: 'Explore the work', scroll: 'Scroll to discover more', index: '01 — 05 / ELITE PRO SERVICES' },
    ticker: ['Web design', 'App development', '3D experiences', 'Artificial intelligence', 'Digital marketing', 'Tangier · Morocco'],
    services: {
      eyebrow: 'What we make / 01', first: 'From the first idea,', second: 'to a complete experience.',
      description: 'We do not start from a template. We start by understanding your project, then design and build exactly what it needs—with clarity and care.',
      items: [
        { name: 'Websites & digital platforms', english: 'Web design & development', description: 'Brand sites, stores, and business platforms with responsive design and clear user journeys.' },
        { name: 'Mobile applications', english: 'App development', description: 'Useful mobile interfaces and apps, from experience concept through product build.' },
        { name: '3D & AI experiences', english: '3D, motion & AI', description: 'Interactive visuals, motion graphics, and thoughtful tools that add a new dimension to your brand.' },
        { name: 'Digital marketing & growth', english: 'Digital marketing', description: 'Search, content and email marketing, paid campaigns, and reputation management.' },
      ],
    },
    gallery: {
      eyebrow: 'Image gallery / 02', first: 'Ideas taking shape', second: 'on screen.',
      description: 'A complete gallery of images and materials attached to this project. Website captures and logos are marked as references, not confirmed studio case studies.',
      archive: 'Browse the work archive on Google Drive', archiveNote: 'More than 163 items in the archive', open: 'Open image', count: 'images',
      titleLabel: 'Project title', categoryLabel: 'Category', descriptionLabel: 'About this visual', locationLabel: 'Location',
      close: 'Close image', previous: 'Previous image', next: 'Next image',
      referenceNote: 'Supplied reference material — not a confirmed client case study.',
    },
    newsletter: {
      eyebrow: 'Gmail verification & newsletter / 03', first: 'Fresh ideas,', second: 'straight to your inbox.',
      description: 'Sign up for studio work and digital design notes. The verification flow below is a simulation only.',
      email: 'Gmail address', placeholder: 'name@gmail.com', submit: 'Start demo verification',
      demoNotice: 'Demo mode: no email is sent, the address is not saved, and ownership is not verified.',
      modalTitle: 'Demo verification code', modalDescription: 'This is a UI simulation only. Enter the code shown here to continue.',
      codeLabel: '6-digit code', codeHint: 'Demo code: {code}', verify: 'Verify & preview perks',
      close: 'Close', invalidEmail: 'Enter a valid Gmail address ending in @gmail.com.', invalidCode: 'That code is not correct. Use the code shown in this dialog.',
      perksTitle: 'Client perks preview', perks: ['A concise project-planning checklist', 'Early previews of new work', 'A direct way to start a project conversation'],
      success: 'Demo complete. No email was sent and the address was not saved.',
    },
    studio: {
      eyebrow: 'About the studio / 04', first: 'A small team.', second: 'An open mind.',
      paragraphOne: 'Elite Pro Services is an independent digital studio led by Imran Chetouane in Mesnana, Tangier. We work where design and technology meet, turning ambitious ideas into clear, useful, and considered experiences.',
      paragraphTwo: 'We partner with businesses and brands looking for a distinctive digital presence—from the first line on a website to the last detail in a product.',
      founder: 'Imran Chetouane', role: 'Founder & creative director · The Lone Don', imageLabel: '3D artwork',
    },
    process: {
      eyebrow: 'How we work / 05', first: 'A clear path.', second: 'A meaningful result.',
      description: 'Good work begins with an honest conversation. These are the steps that turn an idea into a living digital experience.',
      steps: [
        { title: 'Listen', description: 'We learn about your business, audience, and goals.' },
        { title: 'Set direction', description: 'We define the structure, visual language, and experience priorities.' },
        { title: 'Design & build', description: 'We shape the direction into a real experience and review the details together.' },
        { title: 'Launch & grow', description: 'We prepare for launch and stay close as you plan what comes next.' },
      ],
    },
    contact: {
      eyebrow: 'Your next chapter starts here / 06', first: 'Have an idea?', second: 'We are listening.',
      description: 'Tell us a little about your project. We will prepare a WhatsApp message with your details for you to review and send.',
      formTitle: 'Tell us about your project', formNote: 'Add a few details and we will prepare a WhatsApp message for you.',
      name: 'Full name', namePlaceholder: 'What should we call you?', email: 'Email address', emailPlaceholder: 'name@example.com',
      service: 'Service', servicePlaceholder: 'Choose what fits your idea', details: 'Project details',
      detailsPlaceholder: 'What would you like us to build together?', submit: 'Prepare WhatsApp message',
      submitted: 'Your WhatsApp message is ready', success: 'Your message is ready in WhatsApp. Review and send it to contact Imran.',
      whatsappIntro: 'Hello, I would like to discuss a digital project with Elite Pro Services.',
      detailsFallback: 'I would like to discuss the idea with you.', location: 'Mesnana, Tangier · Morocco',
      options: [
        { value: 'web', label: 'Website development' }, { value: 'app', label: 'App development' },
        { value: 'motion', label: 'Motion graphics & animation' }, { value: 'content', label: 'Content marketing' },
        { value: 'email', label: 'Email marketing' }, { value: 'reputation', label: 'Reputation management' },
        { value: 'seo', label: 'Search engine optimization' }, { value: 'ppc', label: 'Paid advertising' },
      ],
    },
    footer: { studio: 'Independent digital studio in Tangier, Morocco', backToTop: 'Back to top' },
    categories: { website: 'Website', webApp: 'Web app', ecommerce: 'E-commerce', mobileApp: 'Mobile app', branding: 'Brand identity', threeD: '3D experience', photo: 'Photo reference', reference: 'Website reference', trust: 'Platform badge' },
    locations: { tangier: 'Tangier, Morocco', global: 'Global' },
    galleryDescriptions: {
      productVisual: 'Product or commerce visual from the supplied image set, shown as reference material.',
      appVisual: 'Digital interface or concept from the supplied images, shown as a visual reference.',
      brandVisual: 'Supplied brand or logo visual; it does not by itself confirm a client relationship.',
      threeDVisual: '3D or AI artwork included in the supplied visual collection.',
      photoVisual: 'Photo reference included with the supplied visual materials.',
      siteReference: 'Website capture supplied for inspiration; not presented as a confirmed studio case study.',
      trustVisual: 'Trustpilot badge supplied as an asset; it is not a verified studio rating.',
    },
  },
  fr: {
    language: 'Langue',
    nav: { home: 'Accueil', services: 'Services', work: 'Projets', studio: 'Studio', contact: 'Contact', start: 'Démarrer un projet', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu' },
    hero: { location: 'Studio numérique indépendant · Tanger, Maroc', first: 'Votre idée,', second: 'sa voix numérique.', description: 'Nous créons des sites web, des applications et des expériences numériques avec une identité propre. Design réfléchi, technologie maîtrisée et regard créatif de Tanger vers le monde.', contact: 'Parlons de votre projet', work: 'Découvrir les projets', scroll: 'Défiler pour découvrir', index: '01 — 05 / ELITE PRO SERVICES' },
    ticker: ['Design web', 'Développement d’applications', 'Expériences 3D', 'Intelligence artificielle', 'Marketing numérique', 'Tanger · Maroc'],
    services: {
      eyebrow: 'Nos créations / 01', first: 'De la première idée,', second: 'à une expérience complète.',
      description: 'Nous ne partons pas d’un modèle. Nous commençons par comprendre votre projet, puis concevons et réalisons ce dont il a besoin, avec clarté et attention.',
      items: [
        { name: 'Sites web et plateformes numériques', english: 'Web design & development', description: 'Sites de marque, boutiques et plateformes avec un design adaptatif et des parcours clairs.' },
        { name: 'Applications mobiles', english: 'App development', description: 'Interfaces et applications mobiles utiles, du concept d’expérience à la réalisation.' },
        { name: 'Expériences 3D et IA', english: '3D, motion & AI', description: 'Visuels interactifs, animation et outils pertinents pour donner une nouvelle dimension à votre marque.' },
        { name: 'Marketing numérique et croissance', english: 'Digital marketing', description: 'Référencement, contenus, e-mail, campagnes payantes et gestion de réputation.' },
      ],
    },
    gallery: {
      eyebrow: 'Galerie d’images / 02', first: 'Des idées prennent forme', second: 'à l’écran.',
      description: 'Une galerie complète des images et ressources jointes au projet. Les captures de sites et les logos sont identifiés comme références, et non comme études de cas confirmées.',
      archive: 'Voir l’archive des projets sur Google Drive', archiveNote: 'Plus de 163 éléments dans l’archive', open: 'Ouvrir l’image', count: 'images',
      titleLabel: 'Titre du projet', categoryLabel: 'Catégorie', descriptionLabel: 'À propos du visuel', locationLabel: 'Lieu',
      close: 'Fermer l’image', previous: 'Image précédente', next: 'Image suivante',
      referenceNote: 'Référence fournie — pas une étude de cas client confirmée.',
    },
    newsletter: {
      eyebrow: 'Vérification Gmail et newsletter / 03', first: 'Des idées nouvelles,', second: 'dans votre boîte mail.',
      description: 'Recevez les actualités du studio et des idées de design numérique. La vérification ci-dessous est une simulation.',
      email: 'Adresse Gmail', placeholder: 'name@gmail.com', submit: 'Lancer la vérification démo',
      demoNotice: 'Mode démo : aucun e-mail n’est envoyé, l’adresse n’est pas enregistrée et sa propriété n’est pas vérifiée.',
      modalTitle: 'Code de vérification démo', modalDescription: 'Cette interface est une simulation. Saisissez le code affiché ici pour continuer.',
      codeLabel: 'Code à 6 chiffres', codeHint: 'Code démo : {code}', verify: 'Vérifier et voir les avantages',
      close: 'Fermer', invalidEmail: 'Saisissez une adresse Gmail valide se terminant par @gmail.com.', invalidCode: 'Code incorrect. Utilisez le code affiché dans cette fenêtre.',
      perksTitle: 'Aperçu des avantages', perks: ['Une liste de préparation de projet', 'Un aperçu anticipé des nouveaux projets', 'Un accès direct pour parler de votre projet'],
      success: 'Simulation terminée. Aucun e-mail n’a été envoyé et l’adresse n’a pas été enregistrée.',
    },
    studio: {
      eyebrow: 'À propos du studio / 04', first: 'Une petite équipe.', second: 'Une curiosité sans fin.',
      paragraphOne: 'Elite Pro Services est un studio numérique indépendant dirigé par Imran Chetouane à Mesnana, Tanger. À la croisée du design et de la technologie, nous transformons les idées ambitieuses en expériences claires et utiles.',
      paragraphTwo: 'Nous accompagnons les entreprises et les marques qui souhaitent une présence numérique singulière, de la première ligne du site au dernier détail du produit.',
      founder: 'Imran Chetouane', role: 'Fondateur et directeur créatif · The Lone Don', imageLabel: 'Œuvre 3D',
    },
    process: {
      eyebrow: 'Notre méthode / 05', first: 'Un parcours clair.', second: 'Un résultat utile.',
      description: 'Un bon projet commence par un échange sincère. Voici les étapes qui transforment une idée en expérience numérique.',
      steps: [
        { title: 'Écouter', description: 'Nous découvrons votre activité, votre public et vos objectifs.' },
        { title: 'Définir le cap', description: 'Nous établissons la structure, le langage visuel et les priorités.' },
        { title: 'Concevoir et réaliser', description: 'Nous donnons forme à l’expérience et examinons chaque détail ensemble.' },
        { title: 'Lancer et développer', description: 'Nous préparons le lancement et restons présents pour la suite.' },
      ],
    },
    contact: {
      eyebrow: 'La suite commence ici / 06', first: 'Une idée ?', second: 'Nous vous écoutons.',
      description: 'Parlez-nous de votre projet. Un message WhatsApp prérempli s’ouvrira afin que vous puissiez le vérifier et l’envoyer.',
      formTitle: 'Parlez-nous de votre projet', formNote: 'Ajoutez quelques détails et nous préparerons un message WhatsApp.',
      name: 'Nom complet', namePlaceholder: 'Comment vous appeler ?', email: 'Adresse e-mail', emailPlaceholder: 'name@example.com',
      service: 'Service souhaité', servicePlaceholder: 'Choisissez ce qui convient à votre idée', details: 'Détails du projet',
      detailsPlaceholder: 'Que souhaitez-vous créer avec nous ?', submit: 'Préparer le message WhatsApp',
      submitted: 'Votre message WhatsApp est prêt', success: 'Votre message est prêt dans WhatsApp. Vérifiez-le puis envoyez-le à Imran.',
      whatsappIntro: 'Bonjour, je souhaite discuter d’un projet numérique avec Elite Pro Services.',
      detailsFallback: 'Je souhaite en discuter avec vous.', location: 'Mesnana, Tanger · Maroc',
      options: [
        { value: 'web', label: 'Création de sites web' }, { value: 'app', label: 'Développement d’applications' },
        { value: 'motion', label: 'Animation et motion design' }, { value: 'content', label: 'Marketing de contenu' },
        { value: 'email', label: 'Marketing par e-mail' }, { value: 'reputation', label: 'Gestion de réputation' },
        { value: 'seo', label: 'Référencement naturel' }, { value: 'ppc', label: 'Publicité payante' },
      ],
    },
    footer: { studio: 'Studio numérique indépendant à Tanger, Maroc', backToTop: 'Retour en haut' },
    categories: { website: 'Site web', webApp: 'Application web', ecommerce: 'E-commerce', mobileApp: 'Application mobile', branding: 'Identité de marque', threeD: 'Expérience 3D', photo: 'Référence photo', reference: 'Référence web', trust: 'Badge de plateforme' },
    locations: { tangier: 'Tanger, Maroc', global: 'International' },
    galleryDescriptions: {
      productVisual: 'Visuel produit ou commerce issu des fichiers fournis, présenté comme référence.',
      appVisual: 'Interface ou concept numérique issu des images fournies, présenté comme référence visuelle.',
      brandVisual: 'Visuel de marque ou logo fourni ; il ne confirme pas à lui seul une relation client.',
      threeDVisual: 'Création 3D ou IA incluse dans la collection visuelle fournie.',
      photoVisual: 'Référence photo incluse dans les ressources visuelles fournies.',
      siteReference: 'Capture de site fournie comme inspiration ; pas une étude de cas confirmée du studio.',
      trustVisual: 'Badge Trustpilot fourni comme visuel ; il ne constitue pas une note vérifiée du studio.',
    },
  },
  es: {
    language: 'Idioma',
    nav: { home: 'Inicio', services: 'Servicios', work: 'Proyectos', studio: 'Estudio', contact: 'Contacto', start: 'Empezar un proyecto', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú' },
    hero: { location: 'Estudio digital independiente · Tánger, Marruecos', first: 'Tu idea,', second: 'con voz digital.', description: 'Creamos sitios web, aplicaciones y experiencias digitales con identidad propia. Diseño pensado, tecnología cuidada y una mirada creativa desde Tánger hacia el mundo.', contact: 'Hablemos de tu proyecto', work: 'Explorar proyectos', scroll: 'Desliza para descubrir', index: '01 — 05 / ELITE PRO SERVICES' },
    ticker: ['Diseño web', 'Desarrollo de apps', 'Experiencias 3D', 'Inteligencia artificial', 'Marketing digital', 'Tánger · Marruecos'],
    services: {
      eyebrow: 'Lo que creamos / 01', first: 'De la primera idea,', second: 'a una experiencia completa.',
      description: 'No empezamos con una plantilla. Primero entendemos tu proyecto y después diseñamos y creamos lo que necesita, con claridad y atención al detalle.',
      items: [
        { name: 'Sitios web y plataformas digitales', english: 'Web design & development', description: 'Webs de marca, tiendas y plataformas con diseño adaptable y recorridos claros.' },
        { name: 'Aplicaciones móviles', english: 'App development', description: 'Interfaces y aplicaciones móviles útiles, desde la idea hasta el producto.' },
        { name: 'Experiencias 3D e IA', english: '3D, motion & AI', description: 'Visuales interactivos, animación y soluciones inteligentes para dar otra dimensión a tu marca.' },
        { name: 'Marketing digital y crecimiento', english: 'Digital marketing', description: 'SEO, contenido y email marketing, campañas de pago y gestión de reputación.' },
      ],
    },
    gallery: {
      eyebrow: 'Galería de imágenes / 02', first: 'Las ideas toman forma', second: 'en pantalla.',
      description: 'Una galería completa de las imágenes y materiales adjuntos al proyecto. Las capturas web y los logotipos están identificados como referencias, no como casos confirmados del estudio.',
      archive: 'Ver el archivo de proyectos en Google Drive', archiveNote: 'Más de 163 elementos en el archivo', open: 'Abrir imagen', count: 'imágenes',
      titleLabel: 'Título del proyecto', categoryLabel: 'Categoría', descriptionLabel: 'Sobre esta imagen', locationLabel: 'Ubicación',
      close: 'Cerrar imagen', previous: 'Imagen anterior', next: 'Imagen siguiente',
      referenceNote: 'Material de referencia enviado; no es un caso de cliente confirmado.',
    },
    newsletter: {
      eyebrow: 'Verificación de Gmail y boletín / 03', first: 'Ideas nuevas,', second: 'en tu correo.',
      description: 'Recibe novedades del estudio e ideas de diseño digital. La verificación siguiente es solo una simulación.',
      email: 'Dirección de Gmail', placeholder: 'name@gmail.com', submit: 'Iniciar verificación demo',
      demoNotice: 'Modo demo: no se envía ningún correo, la dirección no se guarda ni se verifica su titularidad.',
      modalTitle: 'Código de verificación demo', modalDescription: 'Esta interfaz es una simulación. Introduce el código que aparece aquí para continuar.',
      codeLabel: 'Código de 6 dígitos', codeHint: 'Código demo: {code}', verify: 'Verificar y ver ventajas',
      close: 'Cerrar', invalidEmail: 'Introduce una dirección Gmail válida que termine en @gmail.com.', invalidCode: 'El código no es correcto. Usa el que aparece en este cuadro.',
      perksTitle: 'Vista previa de ventajas', perks: ['Lista breve para preparar tu proyecto', 'Avance de nuevos trabajos', 'Una vía directa para iniciar una conversación'],
      success: 'Simulación completada. No se envió ningún correo y la dirección no se guardó.',
    },
    studio: {
      eyebrow: 'Sobre el estudio / 04', first: 'Un equipo pequeño.', second: 'Curiosidad sin límites.',
      paragraphOne: 'Elite Pro Services es un estudio digital independiente dirigido por Imran Chetouane en Mesnana, Tánger. Trabajamos entre diseño y tecnología para convertir ideas ambiciosas en experiencias claras y útiles.',
      paragraphTwo: 'Colaboramos con empresas y marcas que buscan una presencia digital propia, desde la primera línea de una web hasta el último detalle de un producto.',
      founder: 'Imran Chetouane', role: 'Fundador y director creativo · The Lone Don', imageLabel: 'Obra 3D',
    },
    process: {
      eyebrow: 'Cómo trabajamos / 05', first: 'Un camino claro.', second: 'Un resultado con sentido.',
      description: 'El buen trabajo empieza con una conversación honesta. Estos pasos convierten una idea en una experiencia digital real.',
      steps: [
        { title: 'Escuchamos', description: 'Conocemos tu negocio, tu público y lo que quieres conseguir.' },
        { title: 'Definimos el rumbo', description: 'Acordamos estructura, lenguaje visual y prioridades de experiencia.' },
        { title: 'Diseñamos y creamos', description: 'Convertimos la dirección en una experiencia real y revisamos cada detalle contigo.' },
        { title: 'Lanzamos y mejoramos', description: 'Preparamos el lanzamiento y seguimos cerca para el siguiente paso.' },
      ],
    },
    contact: {
      eyebrow: 'Tu siguiente etapa empieza aquí / 06', first: '¿Tienes una idea?', second: 'Te escuchamos.',
      description: 'Cuéntanos un poco sobre tu proyecto. Prepararemos un mensaje de WhatsApp para que lo revises y lo envíes.',
      formTitle: 'Cuéntanos tu proyecto', formNote: 'Añade algunos detalles y prepararemos un mensaje de WhatsApp.',
      name: 'Nombre completo', namePlaceholder: '¿Cómo te llamamos?', email: 'Correo electrónico', emailPlaceholder: 'name@example.com',
      service: 'Servicio', servicePlaceholder: 'Elige lo que mejor encaja con tu idea', details: 'Detalles del proyecto',
      detailsPlaceholder: '¿Qué te gustaría crear con nosotros?', submit: 'Preparar mensaje de WhatsApp',
      submitted: 'Tu mensaje de WhatsApp está listo', success: 'Tu mensaje está listo en WhatsApp. Revísalo y envíalo para contactar con Imran.',
      whatsappIntro: 'Hola, me gustaría hablar sobre un proyecto digital con Elite Pro Services.',
      detailsFallback: 'Me gustaría hablar sobre la idea con vosotros.', location: 'Mesnana, Tánger · Marruecos',
      options: [
        { value: 'web', label: 'Desarrollo web' }, { value: 'app', label: 'Desarrollo de aplicaciones' },
        { value: 'motion', label: 'Animación y motion graphics' }, { value: 'content', label: 'Marketing de contenidos' },
        { value: 'email', label: 'Email marketing' }, { value: 'reputation', label: 'Gestión de reputación' },
        { value: 'seo', label: 'Optimización para buscadores' }, { value: 'ppc', label: 'Publicidad de pago' },
      ],
    },
    footer: { studio: 'Estudio digital independiente en Tánger, Marruecos', backToTop: 'Volver arriba' },
    categories: { website: 'Sitio web', webApp: 'Aplicación web', ecommerce: 'Comercio electrónico', mobileApp: 'Aplicación móvil', branding: 'Identidad de marca', threeD: 'Experiencia 3D', photo: 'Referencia fotográfica', reference: 'Referencia web', trust: 'Insignia de plataforma' },
    locations: { tangier: 'Tánger, Marruecos', global: 'Global' },
    galleryDescriptions: {
      productVisual: 'Visual de producto o comercio de los archivos enviados, presentado como referencia.',
      appVisual: 'Interfaz o concepto digital de las imágenes enviadas, presentado como referencia visual.',
      brandVisual: 'Imagen de marca o logotipo proporcionado; por sí solo no confirma una relación con un cliente.',
      threeDVisual: 'Obra 3D o de IA incluida en la colección visual enviada.',
      photoVisual: 'Referencia fotográfica incluida entre los materiales visuales enviados.',
      siteReference: 'Captura web enviada como inspiración; no se presenta como caso confirmado del estudio.',
      trustVisual: 'Insignia de Trustpilot proporcionada como imagen; no es una valoración verificada del estudio.',
    },
  },
  de: {
    language: 'Sprache',
    nav: { home: 'Start', services: 'Leistungen', work: 'Arbeiten', studio: 'Studio', contact: 'Kontakt', start: 'Projekt starten', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' },
    hero: { location: 'Unabhängiges Digitalstudio · Tanger, Marokko', first: 'Deine Idee,', second: 'mit digitaler Stimme.', description: 'Wir entwickeln Websites, Apps und digitale Erlebnisse mit eigenem Charakter. Durchdachtes Design, zuverlässige Technik und kreative Perspektive aus Tanger für die Welt.', contact: 'Projekt besprechen', work: 'Arbeiten entdecken', scroll: 'Weiter entdecken', index: '01 — 05 / ELITE PRO SERVICES' },
    ticker: ['Webdesign', 'App-Entwicklung', '3D-Erlebnisse', 'Künstliche Intelligenz', 'Digitales Marketing', 'Tanger · Marokko'],
    services: {
      eyebrow: 'Was wir gestalten / 01', first: 'Von der ersten Idee,', second: 'zum fertigen Erlebnis.',
      description: 'Wir starten nicht mit einer Vorlage. Zuerst verstehen wir dein Projekt, dann gestalten und entwickeln wir genau das, was es braucht – klar und mit Liebe zum Detail.',
      items: [
        { name: 'Websites & digitale Plattformen', english: 'Web design & development', description: 'Markenwebsites, Shops und Plattformen mit responsivem Design und klarer Nutzerführung.' },
        { name: 'Mobile Anwendungen', english: 'App development', description: 'Nützliche mobile Oberflächen und Apps – vom Erlebnis-Konzept bis zum Produkt.' },
        { name: '3D- & KI-Erlebnisse', english: '3D, motion & AI', description: 'Interaktive Visuals, Motion Design und sinnvolle Lösungen für eine neue Markendimension.' },
        { name: 'Digitales Marketing & Wachstum', english: 'Digital marketing', description: 'Suchmaschinenoptimierung, Content- und E-Mail-Marketing, Anzeigen und Reputationspflege.' },
      ],
    },
    gallery: {
      eyebrow: 'Bildergalerie / 02', first: 'Ideen nehmen Gestalt an', second: 'auf dem Bildschirm.',
      description: 'Eine vollständige Galerie der angehängten Bilder und Materialien. Website-Aufnahmen und Logos sind als Referenzen gekennzeichnet, nicht als bestätigte Studio-Fallstudien.',
      archive: 'Projektarchiv auf Google Drive ansehen', archiveNote: 'Mehr als 163 Einträge im Archiv', open: 'Bild öffnen', count: 'Bilder',
      titleLabel: 'Projekttitel', categoryLabel: 'Kategorie', descriptionLabel: 'Über dieses Motiv', locationLabel: 'Standort',
      close: 'Bild schließen', previous: 'Vorheriges Bild', next: 'Nächstes Bild',
      referenceNote: 'Bereitgestelltes Referenzmaterial – keine bestätigte Kunden-Fallstudie.',
    },
    newsletter: {
      eyebrow: 'Gmail-Verifizierung & Newsletter / 03', first: 'Neue Ideen,', second: 'direkt in dein Postfach.',
      description: 'Erhalte Neuigkeiten aus dem Studio und Impulse für digitales Design. Der folgende Verifizierungsablauf ist nur eine Simulation.',
      email: 'Gmail-Adresse', placeholder: 'name@gmail.com', submit: 'Demo-Verifizierung starten',
      demoNotice: 'Demo-Modus: Es wird keine E-Mail gesendet, die Adresse nicht gespeichert und der Besitz nicht verifiziert.',
      modalTitle: 'Demo-Verifizierungscode', modalDescription: 'Dies ist nur eine UI-Simulation. Gib den hier angezeigten Code ein, um fortzufahren.',
      codeLabel: '6-stelliger Code', codeHint: 'Demo-Code: {code}', verify: 'Prüfen & Vorteile ansehen',
      close: 'Schließen', invalidEmail: 'Gib eine gültige Gmail-Adresse ein, die auf @gmail.com endet.', invalidCode: 'Der Code stimmt nicht. Verwende den Code in diesem Dialog.',
      perksTitle: 'Vorschau auf Kundenvorteile', perks: ['Kurze Checkliste zur Projektvorbereitung', 'Frühe Einblicke in neue Arbeiten', 'Direkter Einstieg in ein Projektgespräch'],
      success: 'Demo abgeschlossen. Es wurde keine E-Mail gesendet und die Adresse nicht gespeichert.',
    },
    studio: {
      eyebrow: 'Über das Studio / 04', first: 'Ein kleines Team.', second: 'Neugier ohne Ende.',
      paragraphOne: 'Elite Pro Services ist ein unabhängiges Digitalstudio unter der Leitung von Imran Chetouane in Mesnana, Tanger. An der Schnittstelle von Design und Technik machen wir aus ambitionierten Ideen klare und nützliche Erlebnisse.',
      paragraphTwo: 'Wir arbeiten mit Unternehmen und Marken an einem unverwechselbaren digitalen Auftritt – von der ersten Website-Zeile bis zum letzten Produktdetail.',
      founder: 'Imran Chetouane', role: 'Gründer & Creative Director · The Lone Don', imageLabel: '3D-Kunstwerk',
    },
    process: {
      eyebrow: 'Unser Ablauf / 05', first: 'Ein klarer Weg.', second: 'Ein Ergebnis mit Sinn.',
      description: 'Gute Arbeit beginnt mit einem offenen Gespräch. Diese Schritte machen aus einer Idee ein digitales Erlebnis.',
      steps: [
        { title: 'Zuhören', description: 'Wir lernen dein Unternehmen, deine Zielgruppe und deine Ziele kennen.' },
        { title: 'Richtung finden', description: 'Wir legen Struktur, visuelle Sprache und Erlebnisprioritäten fest.' },
        { title: 'Gestalten & bauen', description: 'Wir machen daraus ein echtes Erlebnis und prüfen jedes Detail gemeinsam.' },
        { title: 'Starten & wachsen', description: 'Wir bereiten den Start vor und begleiten den nächsten Schritt.' },
      ],
    },
    contact: {
      eyebrow: 'Dein nächstes Kapitel beginnt hier / 06', first: 'Eine Idee?', second: 'Wir hören zu.',
      description: 'Erzähl uns etwas über dein Projekt. Wir bereiten eine WhatsApp-Nachricht vor, die du prüfen und selbst senden kannst.',
      formTitle: 'Erzähl uns von deinem Projekt', formNote: 'Füge ein paar Details hinzu; wir bereiten eine WhatsApp-Nachricht vor.',
      name: 'Vollständiger Name', namePlaceholder: 'Wie dürfen wir dich nennen?', email: 'E-Mail-Adresse', emailPlaceholder: 'name@example.com',
      service: 'Leistung', servicePlaceholder: 'Wähle, was zu deiner Idee passt', details: 'Projektdetails',
      detailsPlaceholder: 'Was möchtest du mit uns entwickeln?', submit: 'WhatsApp-Nachricht vorbereiten',
      submitted: 'Deine WhatsApp-Nachricht ist bereit', success: 'Deine Nachricht ist in WhatsApp bereit. Prüfe und sende sie an Imran.',
      whatsappIntro: 'Hallo, ich möchte ein digitales Projekt mit Elite Pro Services besprechen.',
      detailsFallback: 'Ich würde die Idee gern mit euch besprechen.', location: 'Mesnana, Tanger · Marokko',
      options: [
        { value: 'web', label: 'Webentwicklung' }, { value: 'app', label: 'App-Entwicklung' },
        { value: 'motion', label: 'Motion Design & Animation' }, { value: 'content', label: 'Content-Marketing' },
        { value: 'email', label: 'E-Mail-Marketing' }, { value: 'reputation', label: 'Reputationsmanagement' },
        { value: 'seo', label: 'Suchmaschinenoptimierung' }, { value: 'ppc', label: 'Bezahlte Werbung' },
      ],
    },
    footer: { studio: 'Unabhängiges Digitalstudio in Tanger, Marokko', backToTop: 'Nach oben' },
    categories: { website: 'Website', webApp: 'Web-App', ecommerce: 'E-Commerce', mobileApp: 'Mobile App', branding: 'Markenidentität', threeD: '3D-Erlebnis', photo: 'Fotoreferenz', reference: 'Website-Referenz', trust: 'Plattform-Badge' },
    locations: { tangier: 'Tanger, Marokko', global: 'Global' },
    galleryDescriptions: {
      productVisual: 'Produkt- oder Commerce-Motiv aus den bereitgestellten Bildern, als Referenz gezeigt.',
      appVisual: 'Digitale Oberfläche oder Konzept aus den bereitgestellten Bildern, als visuelle Referenz gezeigt.',
      brandVisual: 'Bereitgestelltes Marken- oder Logo-Motiv; allein daraus folgt keine bestätigte Kundenbeziehung.',
      threeDVisual: '3D- oder KI-Kunst aus der bereitgestellten Bildsammlung.',
      photoVisual: 'Fotoreferenz aus den bereitgestellten visuellen Materialien.',
      siteReference: 'Website-Aufnahme als Inspiration; keine bestätigte Studio-Fallstudie.',
      trustVisual: 'Trustpilot-Badge aus den Uploads; keine verifizierte Bewertung des Studios.',
    },
  },
};
