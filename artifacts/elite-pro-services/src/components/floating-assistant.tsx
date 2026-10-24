import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import type { Locale } from '@/data/translations';

type ChatMessage = { id: number; sender: 'assistant' | 'user'; text: string; whatsappUrl?: string };

const ui: Record<Locale, {
  title: string; subtitle: string; placeholder: string; send: string; close: string;
  whatsapp: string; quickReplies: string[]; requestError: string;
}> = {
  ar: {
    title: 'مساعد Elite Pro', subtitle: 'الدارجة والإنجليزية · طنجة',
    placeholder: 'اكتب سؤالك هنا…', send: 'إرسال', close: 'إغلاق المحادثة',
    whatsapp: 'تواصل عبر واتساب',
    quickReplies: ['شنو الخدمات اللي كتقدمو؟', 'شحال كيكلف المشروع؟', 'شكون هو المؤسس؟'],
    requestError: 'نقدر نعاونك مباشرة. وضّح ليا السؤال أكثر أو تواصل معنا عبر واتساب.',
  },
  en: {
    title: 'Elite Pro Assistant', subtitle: 'Darija & English · Tangier',
    placeholder: 'Ask about a project…', send: 'Send', close: 'Close chat',
    whatsapp: 'Talk on WhatsApp',
    quickReplies: ['What services do you offer?', 'How much does a project cost?', 'Who is the founder?'],
    requestError: 'I can still help. Add a little more detail, or reach us on WhatsApp.'
  },
  fr: {
    title: 'Assistant Elite Pro', subtitle: 'Darija & anglais · Tanger',
    placeholder: 'Posez votre question…', send: 'Envoyer', close: 'Fermer le chat',
    whatsapp: 'Contacter sur WhatsApp',
    quickReplies: ['Quels services proposez-vous ?', 'Combien coûte un projet ?', 'Qui est le fondateur ?'],
    requestError: 'Je peux vous aider. Ajoutez un peu de contexte ou contactez-nous sur WhatsApp.'
  },
  es: {
    title: 'Asistente Elite Pro', subtitle: 'Darija e inglés · Tánger',
    placeholder: 'Escribe tu pregunta…', send: 'Enviar', close: 'Cerrar chat',
    whatsapp: 'Hablar por WhatsApp',
    quickReplies: ['¿Qué servicios ofrecen?', '¿Cuánto cuesta un proyecto?', '¿Quién es el fundador?'],
    requestError: 'Puedo ayudarte. Añade un poco de contexto o escríbenos por WhatsApp.'
  },
  de: {
    title: 'Elite Pro Assistent', subtitle: 'Darija & Englisch · Tanger',
    placeholder: 'Frage zu einem Projekt…', send: 'Senden', close: 'Chat schließen',
    whatsapp: 'Über WhatsApp schreiben',
    quickReplies: ['Welche Services bieten Sie an?', 'Was kostet ein Projekt?', 'Wer ist der Gründer?'],
    requestError: 'Ich helfe gern weiter. Ergänzen Sie etwas Kontext oder schreiben Sie uns über WhatsApp.'
  },
};

function isArabic(text: string) {
  return /[\u0600-\u06ff]/u.test(text);
}

function greeting(locale: Locale) {
  return locale === 'ar'
    ? 'مرحبا! سولني على أي موضوع، وأنا هنا باش نعاونك. تقدر حتى تسولني على خدمات Elite Pro Services.'
    : 'Hi! Ask me anything and I’ll do my best to help. You can also ask about Elite Pro Services.';
}

export function FloatingAssistant({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messageId = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const sendMessage = async (value: string) => {
    const message = value.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = { id: messageId.current++, sender: 'user', text: message };
    const responseMessage: ChatMessage = { id: messageId.current++, sender: 'assistant', text: '' };
    const conversation = [
      ...messages
        .filter((item) => item.text.trim())
        .map((item) => ({ role: item.sender, content: item.text })),
      { role: 'user' as const, content: message },
    ].slice(-12);

    setMessages((current) => [...current, userMessage, responseMessage]);
    setInput('');
    setIsSending(true);

    let answer = '';
    try {
      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
      });
      const result = await response.json().catch(() => null) as { reply?: unknown; whatsappUrl?: unknown } | null;
      if (!response.ok || typeof result?.reply !== 'string') throw new Error('Assistant request failed');

      answer = result.reply.trim() || labels.requestError;
      let whatsappUrl: string | undefined;
      if (typeof result.whatsappUrl === 'string') {
        try {
          const candidate = new URL(result.whatsappUrl);
          if (candidate.protocol === 'https:' && candidate.hostname === 'wa.me') whatsappUrl = candidate.href;
        } catch {
          whatsappUrl = undefined;
        }
      }
      setMessages((current) => current.map((item) => (
        item.id === responseMessage.id ? { ...item, text: answer, whatsappUrl } : item
      )));
    } catch {
      setMessages((current) => current.map((item) => (
        item.id === responseMessage.id
          ? { ...item, text: answer || labels.requestError }
          : item
      )));
    } finally {
      setIsSending(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const showAssistant = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{ id: messageId.current++, sender: 'assistant', text: greeting(locale) }]);
    }
  };

  return (
    <div className="floating-contact-widget" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      {isOpen && (
        <section className="assistant-panel" role="dialog" aria-modal="false" aria-label={labels.title}>
          <header className="assistant-header">
            <span className="assistant-avatar"><Sparkles size={17} aria-hidden="true" /></span>
            <span className="assistant-header-copy"><strong>{labels.title}</strong><small>{labels.subtitle}</small></span>
            <button className="assistant-close" type="button" aria-label={labels.close} onClick={() => setIsOpen(false)}>
              <X size={17} />
            </button>
          </header>
          <div className="assistant-messages" aria-live="polite" aria-busy={isSending}>
            {messages.map((message) => (
              <div className={`assistant-message-row assistant-message-row-${message.sender}`} key={message.id}>
                <p className={`assistant-message assistant-message-${message.sender}${!message.text && isSending ? ' assistant-typing' : ''}`} dir={isArabic(message.text) ? 'rtl' : 'ltr'}>
                  {message.text || (isSending && message.sender === 'assistant' ? <><span /><span /><span /></> : null)}
                </p>
                {message.whatsappUrl && <a className="assistant-message-action" href={message.whatsappUrl} target="_blank" rel="noreferrer">{labels.whatsapp}</a>}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {messages.length <= 1 && (
            <div className="assistant-quick-replies">
              {labels.quickReplies.map((prompt) => (
                <button type="button" key={prompt} onClick={() => void sendMessage(prompt)} disabled={isSending}>{prompt}</button>
              ))}
            </div>
          )}
          <a className="assistant-whatsapp-cta" href="https://wa.me/212722016229" target="_blank" rel="noreferrer">
            <MessageCircle size={16} aria-hidden="true" />{labels.whatsapp}
          </a>
          <form className="assistant-composer" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
              }}
              placeholder={labels.placeholder}
              aria-label={labels.placeholder}
              disabled={isSending}
            />
            <button type="submit" aria-label={labels.send} disabled={!input.trim() || isSending}><Send size={16} /></button>
          </form>
        </section>
      )}
      <button className="assistant-launcher" type="button" onClick={isOpen ? () => setIsOpen(false) : showAssistant} aria-expanded={isOpen} aria-label={isOpen ? labels.close : labels.title}>
        {isOpen ? <X size={21} /> : <Sparkles size={22} />}
      </button>
      <a className="floating-whatsapp" href="https://wa.me/212722016229" target="_blank" rel="noreferrer" aria-label={labels.whatsapp}>
        <MessageCircle size={21} fill="currentColor" />
      </a>
    </div>
  );
}
