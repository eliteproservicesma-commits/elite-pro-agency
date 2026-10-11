export type GalleryCategory =
  | 'website'
  | 'webApp'
  | 'ecommerce'
  | 'mobileApp'
  | 'branding'
  | 'threeD'
  | 'photo'
  | 'reference'
  | 'trust';

export type GalleryDescription =
  | 'productVisual'
  | 'appVisual'
  | 'brandVisual'
  | 'threeDVisual'
  | 'photoVisual'
  | 'siteReference'
  | 'trustVisual';

export type GalleryLocation = 'tangier' | 'global';

export type GalleryMetadata = {
  fileName: string;
  title: string;
  category: GalleryCategory;
  description: GalleryDescription;
  location: GalleryLocation;
};

export const galleryMetadata: GalleryMetadata[] = [
  { fileName: '01-10-300x223.png', title: 'Charlies', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '02-11.png', title: 'Mapuche Maqui', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '03-1-300x223.png', title: 'Cold Brew', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '04-145121992b922564ffab49bdc232f21e.webp', title: 'Pypo Finance 3D App', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '05-2.png', title: 'Iciles', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '06-2437aba817a1bb3f4136f96e47abffcc-1024x768.webp', title: 'Pointgroup', category: 'webApp', description: 'appVisual', location: 'global' },
  { fileName: '07-5.png', title: 'Pebble', category: 'website', description: 'productVisual', location: 'global' },
  { fileName: '08-6.png', title: 'Dealprom', category: 'webApp', description: 'appVisual', location: 'global' },
  { fileName: '09-7.png', title: 'Kinder Bueno', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '10-8.png', title: 'Frosty', category: 'ecommerce', description: 'productVisual', location: 'global' },
  { fileName: '11-AB-Digital-Marketing-Solutions-02-2048x1638.jpg', title: 'AB Digital Marketing Solutions', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '12-Bruce-Pflueger_LOGO-01-1-300x300.jpg', title: 'Bruce Pflueger', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '13-Casa-Fresca-Mercado-03-2048x1638.jpg', title: 'Casa Fresca Mercado', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '14-DoctorKolleenGregoryPasadenaChiropractor-scaled.webp', title: 'Dr. Kolleen Gregory · Pasadena Chiropractor', category: 'photo', description: 'photoVisual', location: 'global' },
  { fileName: '15-download-2.png', title: 'Trustpilot', category: 'trust', description: 'trustVisual', location: 'global' },
  { fileName: '16-join-our-team-1707938876.webp', title: 'Workplace Portrait', category: 'photo', description: 'photoVisual', location: 'global' },
  { fileName: '17-logo-03-1536x1536.jpg', title: 'Twin City Overhead Doors', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '18-ReKindle-Your-Heart-03-768x614.jpg', title: 'ReKindle Your Heart', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '19-Tracey-Light-of-Hope-Healthcare-LLC-02-1-scaled.jpg', title: 'Tracey · Light of Hope Healthcare', category: 'branding', description: 'brandVisual', location: 'global' },
  { fileName: '20-image-18-1.png', title: 'Chromatic Liquid Form', category: 'threeD', description: 'threeDVisual', location: 'global' },
  { fileName: '21-image-28-768x848.webp', title: 'Chromatic Portrait', category: 'threeD', description: 'threeDVisual', location: 'global' },
  { fileName: '22-image-31-2-289x300.png', title: 'AI Persona Study', category: 'threeD', description: 'threeDVisual', location: 'global' },
  { fileName: '23-IMG_20260401_210629_331.webp', title: 'Elite Pro Services · Brand Emblem', category: 'branding', description: 'brandVisual', location: 'tangier' },
  { fileName: '24-IMG_20260708_184313.jpg', title: 'Elite Pro Services · Logo Photograph', category: 'branding', description: 'brandVisual', location: 'tangier' },
  { fileName: '25-original-54076e4942787dc397ab3867372f53c0.webp', title: 'Fashion Discovery App', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '26-original-703a210ccc4fa52dc7500134f7f19b65-300x225.webp', title: 'Mobile Product Interface', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '27-original-70dfcda67ef501367608b2008db66325.webp', title: 'Creative Portfolio Experience', category: 'website', description: 'appVisual', location: 'global' },
  { fileName: '28-original-adf9859c0e8a3a0cf8f35c986056a9a9-300x225.webp', title: 'Digital Product Interface', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '29-original-da0a07d31eabd9b48b5647659ae6685a.webp', title: 'Portfolio Builder App', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '30-original-ef4b94a25755f759aac7e4a233eca1bc-300x225.webp', title: 'Mobile Finance Interface', category: 'mobileApp', description: 'appVisual', location: 'global' },
  { fileName: '31-screencapture-lamaisonvalmont-en-2026-03-31-05_40_55-768x2850.png', title: 'La Maison Valmont', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '32-screencapture-magnaprocnst-2026-03-31-05_28_20-scaled.png', title: 'Magna Pro Construction', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '33-screencapture-ogroup-2026-03-31-05_44_19-scaled.png', title: 'O Group', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '34-screencapture-realcar-nyc-2026-03-31-05_46_51-290x1536.png', title: 'RealCar NYC', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '35-screencapture-stewartcorealty-2026-03-31-02_03_59-scaled.png', title: 'StewartCo Realty', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '36-screencapture-supersnouts-2026-03-31-05_32_42-scaled.png', title: 'Super Snouts', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '37-screencapture-telhaclarke-au-2026-03-31-05_36_35-150x1024.png', title: 'Telha Clarke', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '38-screencapture-velasmeetingsmexico-2026-03-31-02_09_45-768x3518.png', title: 'Velas Meetings Mexico', category: 'reference', description: 'siteReference', location: 'global' },
  { fileName: '39-screencapture-westsideprolandscape-2026-03-31-05_38_47-scaled.png', title: 'Westside Pro Landscaping', category: 'reference', description: 'siteReference', location: 'global' },
];
