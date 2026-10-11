import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowUpLeft, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { galleryMetadata, type GalleryMetadata } from '@/data/gallery';
import type { SiteCopy } from '@/data/translations';

const galleryUrls = import.meta.glob<string>('../assets/gallery/*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
});

type GalleryItem = GalleryMetadata & { src: string };

const galleryItems: GalleryItem[] = galleryMetadata.map((metadata) => {
  const src = galleryUrls[`../assets/gallery/${metadata.fileName}`];
  if (!src) {
    throw new Error(`Uploaded gallery image is missing: ${metadata.fileName}`);
  }
  return { ...metadata, src };
});

type PortfolioGalleryProps = { copy: SiteCopy };

export function PortfolioGallery({ copy }: PortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const galleryCopy = copy.gallery;

  useEffect(() => {
    if (activeIndex === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') setActiveIndex((index) => index === null ? null : (index + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setActiveIndex((index) => index === null ? null : (index - 1 + galleryItems.length) % galleryItems.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex]);

  const updateTilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
  };

  const clearTilt = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const activeItem = activeIndex === null ? null : galleryItems[activeIndex];
  const moveLightbox = (change: number) => {
    setActiveIndex((index) => index === null ? null : (index + change + galleryItems.length) % galleryItems.length);
  };

  return (
    <section className="work-section" id="work">
      <div className="wrap">
        <div className="section-head work-head">
          <div>
            <div className="eyebrow section-kicker">{galleryCopy.eyebrow}</div>
            <h2>{galleryCopy.first}<br />{galleryCopy.second}</h2>
          </div>
          <p className="section-intro">{galleryCopy.description}</p>
        </div>
        <div className="gallery-count" aria-live="polite">
          <span className="live-dot" />
          <span>{galleryItems.length} {galleryCopy.count}</span>
        </div>
        <div className="project-grid">
          {galleryItems.map((item, index) => (
            <button
              className="project-card"
              key={item.fileName}
              type="button"
              onClick={() => setActiveIndex(index)}
              onPointerMove={updateTilt}
              onPointerLeave={clearTilt}
              aria-label={`${galleryCopy.open}: ${item.title}`}
              data-testid={`gallery-card-${index + 1}`}
            >
              <span className="project-image-wrap">
                <img className="project-image" src={item.src} alt={item.title} loading="lazy" />
                <span className="project-open">{galleryCopy.open}</span>
              </span>
              <span className="project-meta">
                <span className="project-meta-top">
                  <span className="project-title-block">
                    <span className="meta-label">{galleryCopy.titleLabel}</span>
                    <span className="project-title">{item.title}</span>
                  </span>
                  <span className="project-category">{copy.categories[item.category]}</span>
                </span>
                <span className="project-description">
                  <span className="meta-label">{galleryCopy.descriptionLabel}</span>
                  <span>{copy.galleryDescriptions[item.description]}</span>
                </span>
                <span className="project-location">
                  <MapPin size={13} aria-hidden="true" />
                  <span className="meta-label">{galleryCopy.locationLabel}:</span>
                  <span>{copy.locations[item.location]}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <a
          className="archive-cta"
          href="https://drive.google.com/drive/folders/1sQWOJKDH3xDaEO2dSw3IcrQ_Flxa-R1_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="archive-cta-copy">
            <strong>{galleryCopy.archive}</strong>
            <small>{galleryCopy.archiveNote}</small>
          </span>
          <ArrowUpLeft size={21} aria-hidden="true" />
        </a>
      </div>

      {activeItem && (
        <div
          className="lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
            <div className="lightbox-toolbar">
              <span className="lightbox-counter">{String((activeIndex ?? 0) + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span>
              <button className="lightbox-icon" type="button" aria-label={galleryCopy.close} onClick={() => setActiveIndex(null)} ref={closeButtonRef}>
                <X size={21} />
              </button>
            </div>
            <div className="lightbox-content">
              <div className="lightbox-image-stage">
                <button className="lightbox-icon lightbox-previous" type="button" aria-label={galleryCopy.previous} onClick={() => moveLightbox(-1)}>
                  <ChevronLeft size={22} />
                </button>
                <img src={activeItem.src} alt={activeItem.title} />
                <button className="lightbox-icon lightbox-next" type="button" aria-label={galleryCopy.next} onClick={() => moveLightbox(1)}>
                  <ChevronRight size={22} />
                </button>
              </div>
              <aside className="lightbox-details">
                <span className="meta-label">{galleryCopy.titleLabel}</span>
                <h2 id="lightbox-title">{activeItem.title}</h2>
                <span className="project-category">{copy.categories[activeItem.category]}</span>
                <div className="lightbox-description">
                  <span className="meta-label">{galleryCopy.descriptionLabel}</span>
                  <p>{copy.galleryDescriptions[activeItem.description]}</p>
                </div>
                <div className="project-location">
                  <MapPin size={14} aria-hidden="true" />
                  <span className="meta-label">{galleryCopy.locationLabel}:</span>
                  <span>{copy.locations[activeItem.location]}</span>
                </div>
                {activeItem.category === 'reference' && <p className="reference-note">{galleryCopy.referenceNote}</p>}
              </aside>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
