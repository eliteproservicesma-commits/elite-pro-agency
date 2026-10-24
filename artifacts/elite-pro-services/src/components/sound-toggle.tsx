import { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Locale } from '@/data/translations';

const labels: Record<Locale, { enable: string; disable: string }> = {
  ar: { enable: 'تشغيل أصوات الواجهة', disable: 'كتم أصوات الواجهة' },
  en: { enable: 'Enable interface sounds', disable: 'Mute interface sounds' },
  fr: { enable: 'Activer les sons', disable: 'Couper les sons' },
  es: { enable: 'Activar sonidos', disable: 'Silenciar sonidos' },
  de: { enable: 'Oberflächenklänge aktivieren', disable: 'Oberflächenklänge stummschalten' },
};

export function SoundToggle({
  locale,
  enabled,
  onEnabledChange,
  playFeedback = true,
}: {
  locale: Locale;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  playFeedback?: boolean;
}) {
  useEffect(() => {
    if (!playFeedback) return;
    if (!enabled) return;
    const playOnControlClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('button,a,[role="button"]')) return;
      if (typeof window.AudioContext === 'undefined') return;
      try {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(620, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(840, context.currentTime + 0.045);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.095);
        oscillator.onended = () => void context.close();
      } catch {
        // Audio is an optional enhancement; controls still work without it.
      }
    };
    document.addEventListener('click', playOnControlClick);
    return () => document.removeEventListener('click', playOnControlClick);
  }, [enabled, playFeedback]);

  const title = enabled ? labels[locale].disable : labels[locale].enable;
  return (
    <button className="sound-toggle" type="button" aria-label={title} title={title} aria-pressed={enabled} onClick={() => onEnabledChange(!enabled)}>
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
