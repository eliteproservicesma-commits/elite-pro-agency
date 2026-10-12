import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import type { Locale } from '@/data/translations';

type ChatMessage = { id: number; sender: 'assistant' | 'user'; text: string };

const ui: Record<Locale, {
  title: string; subtitle: string; placeholder: string; send: string; close: string;
  whatsapp: string; quickReplies: string[];
}> = {
  ar: {
    title: 'مساعد Elite Pro', subtitle: 'الدارجة والإنجليزية · طنجة',
    placeholder: 'اكتب سؤالك هنا…', send: 'إرسال', close: 'إغلاق المحادثة',
    whatsapp: 'تواصل عبر واتساب',
    quickReplies: ['شنو الخدمات اللي كتقدمو؟', 'شحال كيكلف المشروع؟', 'شكون هو المؤسس؟'],
  },
  en: {
    title: 'Elite Pro Assistant', subtitle: 'Darija & English · Tangier',
    placeholder: 'Ask about a project…', send: 'Send', close: 'Close chat',
    whatsapp: 'Talk on WhatsApp',
    quickReplies: ['What services do you offer?', 'How much does a project cost?', 'Who is the founder?'],
  },
  fr: {
    title: 'Assistant Elite Pro', subtitle: 'Darija & anglais · Tanger',
    placeholder: 'Posez votre question…', send: 'Envoyer', close: 'Fermer le chat',
    whatsapp: 'Contacter sur WhatsApp',
    quickReplies: ['Quels services proposez-vous ?', 'Combien coûte un projet ?', 'Qui est le fondateur ?'],
  },
  es: {
    title: 'Asistente Elite Pro', subtitle: 'Darija e inglés · Tánger',
    placeholder: 'Escribe tu pregunta…', send: 'Enviar', close: 'Cerrar chat',
    whatsapp: 'Hablar por WhatsApp',
    quickReplies: ['¿Qué servicios ofrecen?', '¿Cuánto cuesta un proyecto?', '¿Quién es el fundador?'],
  },
  de: {
    title: 'Elite Pro Assistent', subtitle: 'Darija & Englisch · Tanger',
    placeholder: 'Frage zu einem Projekt…', send: 'Senden', close: 'Chat schließen',
    whatsapp: 'Über WhatsApp schreiben',
    quickReplies: ['Welche Services bieten Sie an?', 'Was kostet ein Projekt?', 'Wer ist der Gründer?'],
  },
};

function isArabic(text: string) {
  return /[\u0600-\u06ff]/u.test(text);
}

function getReply(question: string) {
  const q = question.toLocaleLowerCase();
  const darija = isArabic(question) || /\b(salam|slm|chhal|bchhal|bch7al|ch7al|chno|chnou|wach|bghit|kifach|kidayr|labas|3afak|khoya|dyal|chkoun|chkon)\b/u.test(q);
  const pricing = /price|cost|budget|quote|mad|dirham|how much|price range|costs|chhal|bchhal|bch7al|ch7al|thaman|taman|prix|ثمن|شحال|السعر|درهم|دراهم|كلفة|بشحال|التكلفة/u.test(q);
  const founder = /founder|who is|imran|chetouan|tangier|tanger|found|chkoun|chkon|عمران|شتوان|المؤسس|شكون|طنجة/u.test(q);
  const services = /service|website|web app|web|site|e-?commerce|shop|app|application|platform|3d|ai|seo|design|khadma|khedma|خدمة|موقع|متجر|تطبيق|منصة|تصميم|ثلاثي|ذكاء|خدمات/u.test(q);
  const greeting = /^(hi|hello|hey|salam|bonjour|hola|hallo|سلام|السلام عليكم|مرحبا|أهلا)[\s!?.،]*$/u.test(q.trim());

  if (greeting) {
    return darija
      ? 'وعليكم السلام! نقدر نعاونك بمعلومات على خدمات Elite Pro Services، أثمنة المشاريع بالدرهم، أو المؤسس عمران شتوان في طنجة. شنو بغيتي تعرف؟'
      : 'Hello! I can help with Elite Pro Services, project estimates in MAD, or founder Imran Chetouan in Tangier. What would you like to know?';
  }
  if (pricing) {
    return darija
      ? 'الثمن كيتحسب بالدرهم المغربي (MAD) حسب حجم المشروع والخصائص والمدة. ما كايناش تعريفة ثابتة منشورة؛ صيفط لينا التفاصيل ونعطيوك عرض مخصص. تقدر تراسلنا مباشرة عبر واتساب.'
      : 'Project pricing is quoted in Moroccan dirhams (MAD) and depends on scope, features, and timeline. There is no published fixed rate; share your brief for a tailored quote. You can also reach us on WhatsApp.';
  }
  if (founder) {
    return darija
      ? 'المؤسس هو Imran Chetouan، مؤسس Elite Pro Services في طنجة، المغرب. تواصل معنا عبر واتساب لمناقشة مشروعك مباشرة.'
      : 'Elite Pro Services was founded by Imran Chetouan in Tangier, Morocco. Use the WhatsApp button to discuss your project directly.';
  }
  if (services) {
    return darija
      ? 'كنقدمو تصميم وتطوير مواقع الويب والمتاجر الإلكترونية، تطبيقات الهاتف، تجارب 3D والذكاء الاصطناعي، إضافة إلى SEO وتسويق المحتوى. إلا عطيتيني فكرة مشروعك نوجهك للخدمة المناسبة.'
      : 'Elite Pro Services works on websites and e-commerce, mobile apps, 3D and AI experiences, plus SEO and content marketing. Share your idea and I can point you toward a suitable service.';
  }
  return darija
    ? 'نقدر نجاوبك على خدمات الويب والتطبيقات و3D/AI، تقدير المشروع بالدرهم (MAD)، أو المؤسس Imran Chetouan في طنجة. للمساعدة المباشرة، استعمل زر واتساب.'
    : 'Ask me about web and app services, 3D/AI work, project estimates in MAD, or founder Imran Chetouan in Tangier. For a direct conversation, use the WhatsApp button.';
}

function greeting(locale: Locale) {
  return locale === 'ar'
    ? 'مرحبا! أنا هنا باش نجاوبك على خدماتنا، الأثمنة بالدرهم، أو نوجّهك للتواصل عبر واتساب.'
    : 'Hi! Ask me about our services, estimates in MAD, or how to reach us on WhatsApp.';
}

export function FloatingAssistant({ locale }: { locale: Locale }) {
  const labels = ui[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const sendMessage = (value: string) => {
    const message = value.trim();
    if (!message) return;
    const userMessage: ChatMessage = { id: messageId.current++, sender: 'user', text: message };
    const response: ChatMessage = { id: messageId.current++, sender: 'assistant', text: getReply(message) };
    setMessages((current) => [...current, userMessage, response]);
    setInput('');
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
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
          <div className="assistant-messages" aria-live="polite">
            {messages.map((message) => (
              <p className={`assistant-message assistant-message-${message.sender}`} dir={isArabic(message.text) ? 'rtl' : 'ltr'} key={message.id}>
                {message.text}
              </p>
            ))}
            <div ref={endRef} />
          </div>
          {messages.length <= 1 && (
            <div className="assistant-quick-replies">
              {labels.quickReplies.map((prompt) => (
                <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          )}
          <a className="assistant-whatsapp-cta" href="https://wa.me/212722016229" target="_blank" rel="noreferrer">
            <MessageCircle size={16} aria-hidden="true" />{labels.whatsapp}
          </a>
          <form className="assistant-composer" onSubmit={submit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={labels.placeholder} aria-label={labels.placeholder} />
            <button type="submit" aria-label={labels.send} disabled={!input.trim()}><Send size={16} /></button>
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
