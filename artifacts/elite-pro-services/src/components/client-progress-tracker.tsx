import { useEffect, useState, type FormEvent } from 'react';
import { Check, ChevronRight, CircleDot, X } from 'lucide-react';
import type { Locale } from '@/data/translations';

const text: Record<Locale, {
  trigger: string; title: string; label: string; placeholder: string; sample: string; view: string;
  note: string; close: string; stages: { title: string; description: string }[]; completed: string; active: string; upcoming: string;
}> = {
  ar: {
    trigger: 'تتبع المشروع', title: 'بوابة تقدم المشروع', label: 'رمز المشروع التجريبي', placeholder: 'أدخل الرمز', sample: 'جرّب DEMO-2026',
    view: 'عرض المراحل', note: 'معاينة تفاعلية فقط — لا تعرض بيانات مشروع حقيقي.',
    close: 'إغلاق', stages: [
      { title: 'المرحلة 1: التصميم', description: 'تحديد الاتجاه البصري واعتماد تجربة المستخدم.' },
      { title: 'المرحلة 2: التطوير', description: 'بناء الموقع أو التطبيق ومراجعة التفاصيل.' },
      { title: 'المرحلة 3: الإطلاق', description: 'التحقق النهائي والتجهيز للنشر.' },
    ], completed: 'مكتملة', active: 'قيد التنفيذ', upcoming: 'قريباً',
  },
  en: {
    trigger: 'Project tracker', title: 'Project progress portal', label: 'Sample project code', placeholder: 'Enter a code', sample: 'Try DEMO-2026',
    view: 'View milestones', note: 'Interactive sample only — no live project data is shown.',
    close: 'Close', stages: [
      { title: 'Phase 1: Design', description: 'Set the visual direction and approve the user experience.' },
      { title: 'Phase 2: Development', description: 'Build the website or app and review the details.' },
      { title: 'Phase 3: Deployment', description: 'Run final checks and prepare for launch.' },
    ], completed: 'Completed', active: 'In progress', upcoming: 'Upcoming',
  },
  fr: {
    trigger: 'Suivi du projet', title: 'Portail de suivi du projet', label: 'Code de projet exemple', placeholder: 'Saisir un code', sample: 'Essayez DEMO-2026',
    view: 'Voir les étapes', note: 'Démonstration interactive — aucune donnée réelle de projet.',
    close: 'Fermer', stages: [
      { title: 'Phase 1 : Design', description: 'Définir la direction visuelle et valider l’expérience.' },
      { title: 'Phase 2 : Développement', description: 'Créer le site ou l’application et revoir les détails.' },
      { title: 'Phase 3 : Déploiement', description: 'Effectuer les vérifications et préparer le lancement.' },
    ], completed: 'Terminé', active: 'En cours', upcoming: 'À venir',
  },
  es: {
    trigger: 'Seguimiento', title: 'Portal de progreso del proyecto', label: 'Código de proyecto de ejemplo', placeholder: 'Introduce un código', sample: 'Prueba DEMO-2026',
    view: 'Ver etapas', note: 'Solo es una demostración interactiva; no muestra datos reales.',
    close: 'Cerrar', stages: [
      { title: 'Fase 1: Diseño', description: 'Definir la dirección visual y aprobar la experiencia.' },
      { title: 'Fase 2: Desarrollo', description: 'Crear la web o la aplicación y revisar los detalles.' },
      { title: 'Fase 3: Publicación', description: 'Realizar las comprobaciones y preparar el lanzamiento.' },
    ], completed: 'Completado', active: 'En curso', upcoming: 'Próximamente',
  },
  de: {
    trigger: 'Projektstatus', title: 'Projektfortschritt', label: 'Beispiel-Projektcode', placeholder: 'Code eingeben', sample: 'DEMO-2026 testen',
    view: 'Meilensteine ansehen', note: 'Interaktive Demo — es werden keine echten Projektdaten angezeigt.',
    close: 'Schließen', stages: [
      { title: 'Phase 1: Design', description: 'Visuelle Richtung festlegen und Nutzererlebnis abstimmen.' },
      { title: 'Phase 2: Entwicklung', description: 'Website oder App umsetzen und Details prüfen.' },
      { title: 'Phase 3: Bereitstellung', description: 'Abschlussprüfungen durchführen und Start vorbereiten.' },
    ], completed: 'Abgeschlossen', active: 'In Arbeit', upcoming: 'Bevorstehend',
  },
};

export function ClientProgressTracker({ locale, className = '' }: { locale: Locale; className?: string }) {
  const copy = text[locale];
  const [open, setOpen] = useState(false);
  const [projectCode, setProjectCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStage, setSelectedStage] = useState(0);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectCode.trim()) return;
    setHasSearched(true);
    setSelectedStage(0);
  };

  return (
    <>
      <button className={`portal-trigger ${className}`} type="button" onClick={() => setOpen(true)}>{copy.trigger}</button>
      {open && (
        <div className="tracker-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="tracker-dialog" role="dialog" aria-modal="true" aria-labelledby="tracker-title">
            <button className="tracker-close" type="button" aria-label={copy.close} onClick={() => setOpen(false)}><X size={19} /></button>
            <span className="eyebrow">{copy.note}</span>
            <h2 id="tracker-title">{copy.title}</h2>
            <form className="tracker-form" onSubmit={submit}>
              <label htmlFor="sample-project-code">{copy.label}</label>
              <input id="sample-project-code" value={projectCode} onChange={(event) => setProjectCode(event.target.value)} placeholder={copy.placeholder} dir="ltr" />
              <button type="button" className="tracker-sample" onClick={() => setProjectCode('DEMO-2026')}>{copy.sample}</button>
              <button type="submit" className="tracker-submit">{copy.view}<ChevronRight size={16} /></button>
            </form>
            {hasSearched && (
              <div className="tracker-milestones">
                <div className="tracker-code">DEMO · {projectCode.trim().toUpperCase()}</div>
                {copy.stages.map((stage, index) => (
                  <button
                    className={`tracker-stage ${index === 0 ? 'complete' : index === 1 ? 'current' : ''} ${selectedStage === index ? 'selected' : ''}`}
                    type="button"
                    key={stage.title}
                    onClick={() => setSelectedStage(index)}
                    aria-pressed={selectedStage === index}
                  >
                    <span className="tracker-stage-mark">{index === 0 ? <Check size={14} /> : index === 1 ? <CircleDot size={14} /> : <span>{index + 1}</span>}</span>
                    <span className="tracker-stage-copy"><strong>{stage.title}</strong><small>{index === 0 ? copy.completed : index === 1 ? copy.active : copy.upcoming}</small></span>
                  </button>
                ))}
                <p className="tracker-stage-description">{copy.stages[selectedStage].description}</p>
              </div>
            )}
            <p className="tracker-disclaimer">{copy.note}</p>
          </section>
        </div>
      )}
    </>
  );
}
