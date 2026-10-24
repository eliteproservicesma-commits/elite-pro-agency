type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};
type ClientMessage = { role: 'user' | 'assistant'; content: string };
type AssistantReply = { reply: string; whatsappUrl?: string };

const maxMessages = 12;
const maxMessageLength = 4_000;
const agencyWhatsapp = 'https://wa.me/212722016229';

function parseBody(body: unknown): unknown {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
}

function readMessages(body: unknown): ClientMessage[] {
  if (!body || typeof body !== 'object' || !('messages' in body) || !Array.isArray(body.messages)) return [];
  return body.messages
    .slice(-maxMessages)
    .filter((item): item is { role: 'user' | 'assistant'; content: string } => Boolean(
      item &&
      typeof item === 'object' &&
      'role' in item &&
      (item.role === 'user' || item.role === 'assistant') &&
      'content' in item &&
      typeof item.content === 'string',
    ))
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, maxMessageLength) }))
    .filter((item) => item.content.length > 0);
}

function replyTo(query: string): AssistantReply {
  const normalized = query.toLocaleLowerCase('ar').normalize('NFKC');
  const has = (...terms: string[]) => terms.some((term) => normalized.includes(term));

  if (has('السلام', 'سلام', 'مرحبا', 'أهلا', 'اهلا', 'salam', 'bonjour', 'hello', 'hi ')) {
    return { reply: 'وعليكم السلام! مرحبا بك. نقدر نعاونك بمعلومات عامة، أو نشرح خدمات Elite Pro Services والأسعار التقديرية. شنو بغيتي تعرف؟' };
  }

  if (has('شكون', 'المؤسس', 'founder', 'who founded', 'who is imran', 'عمران', 'imran')) {
    return { reply: 'عمران شتوان هو مؤسس Elite Pro Services والمطور الرئيسي للمواقع، وكيقود الاستوديو من طنجة. كيجمع بين فهم احتياج المشروع والتصميم والتطوير باش يخرج بتجربة رقمية عملية وواضحة.' };
  }

  if (
    has('الخدمات', 'كتقدمو', 'كتقدم', 'شنو كتدير', 'خدماتكم', 'services', 'what do you offer') ||
    (has('website', 'موقع', 'متجر', 'تطبيق') && !has('السعر', 'الأسعار', 'الثمن', 'بشحال', 'شحال', 'تكلف', 'cost', 'price', 'pricing', 'budget'))
  ) {
    return {
      reply: 'Elite Pro Services كتقدم تطوير المواقع والمنصات، التجارة الإلكترونية، التصميم والهوية البصرية، والكتالوجات الرقمية، إضافة لتطبيقات الهاتف وتجارب 3D والموشن والتسويق الرقمي. كنطاقات إرشادية: موقع ويب 8,000–20,000 درهم، متجر إلكتروني 12,000–28,000، تصميم أو SEO ‏4,000–12,000، وتطبيق هاتف 18,000–45,000. الكتالوج الرقمي كيتحدد حسب عدد الصفحات والخصائص. هاد الأسعار للتخطيط فقط وماشي عرض نهائي؛ كيتحدد الثمن بعد مراجعة النطاق. تواصل معنا عبر واتساب باش نناقشو مشروعك.',
      whatsappUrl: `${agencyWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود مناقشة مشروع رقمي مع Elite Pro Services.')}`,
    };
  }

  if (has('السعر', 'الأسعار', 'الثمن', 'بشحال', 'شحال', 'تكلف', 'cost', 'price', 'pricing', 'budget')) {
    if (has('متجر', 'e-commerce', 'ecommerce', 'store')) {
      return {
        reply: 'حسب حاسبة التقدير بالموقع، المتجر الإلكتروني عندو نطاق إرشادي بين 12,000 و28,000 درهم مغربي، والمدة المتوقعة 6–10 أسابيع. هادشي تقدير للتخطيط ماشي عرض نهائي؛ الثمن كيتحدد من بعد مراجعة النطاق والخصائص.',
        whatsappUrl: `${agencyWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود مناقشة ميزانية متجر إلكتروني مع Elite Pro Services.')}`,
      };
    }
    if (has('تطبيق هاتف', 'تطبيق موبايل', 'mobile app', 'phone app')) {
      return {
        reply: 'النطاق الإرشادي لتطبيق الهاتف فالحاسبة هو 18,000–45,000 درهم مغربي، والمدة 8–16 أسبوع. هاد الأرقام للتخطيط فقط وكتتبدل حسب الخصائص والمنصات المطلوبة.',
        whatsappUrl: `${agencyWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود مناقشة تطبيق هاتف مع Elite Pro Services.')}`,
      };
    }
    if (has('هوية', 'branding', 'seo', 'تحسين محركات')) {
      return {
        reply: 'النطاق الإرشادي للهوية البصرية أو SEO هو 4,000–12,000 درهم مغربي، والمدة 2–6 أسابيع. السعر النهائي كيعتمد على حجم المحتوى والتسليمات المطلوبة.',
        whatsappUrl: `${agencyWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود مناقشة الهوية البصرية أو SEO مع Elite Pro Services.')}`,
      };
    }
    return {
      reply: 'النطاقات الإرشادية فالحاسبة هي: موقع أو تطبيق ويب 8,000–20,000 درهم؛ متجر إلكتروني 12,000–28,000؛ تطبيق هاتف 18,000–45,000؛ تجربة 3D ‏9,000–30,000؛ هوية بصرية أو SEO ‏4,000–12,000. هاد الأرقام للتخطيط فقط وماشي تعريفة نهائية، والمدة كتختلف حسب المشروع.',
      whatsappUrl: `${agencyWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود مناقشة تقدير مشروع مع Elite Pro Services.')}`,
    };
  }

  if (has('واتساب', 'whatsapp', 'تواصل', 'contact', 'رقمكم', 'رقم الهاتف')) {
    return { reply: 'تقدر تتواصل مع Elite Pro Services مباشرة عبر واتساب على الرقم +212 722 016 229. قل لينا نوع المشروع والهدف ديالو باش نوجهوك مزيان.', whatsappUrl: agencyWhatsapp };
  }

  if (has('جاذبية', 'gravity', 'الجاذبية', 'نيوتن', 'newton')) {
    return { reply: 'الجاذبية هي القوة اللي كتجذب الأجسام لبعضها. فالحياة اليومية كنحسو بها حيث كتشدّنا الأرض نحو مركزها، وهي كذلك اللي كتخلي الكواكب تدور حول الشمس. حسب النسبية العامة، الجاذبية كتتفسر بانحناء الزمكان بسبب الكتلة والطاقة.' };
  }

  if (has('تمثيل ضوئي', 'photosynthesis', 'النبات', 'الكلوروفيل')) {
    return { reply: 'التمثيل الضوئي هو العملية اللي كيحوّل بها النبات ضوء الشمس والماء وثاني أكسيد الكربون إلى سكريات يستعملها للطاقة، وكيطلق الأكسجين. الكلوروفيل فالأوراق كيلتقط الضوء، والمعادلة المبسطة هي: ماء + ثاني أكسيد الكربون + ضوء → سكر + أكسجين.' };
  }

  if (has('ذكاء اصطناعي', 'الذكاء الاصطناعي', 'machine learning', 'artificial intelligence', 'ai ')) {
    return { reply: 'الذكاء الاصطناعي مجال كيبني أنظمة كتتعلم الأنماط من البيانات أو كتتبع قواعد باش تنجز مهام بحال الترجمة، التصنيف، التوليد والتعرف على الصور. النتيجة كتختلف حسب البيانات والتصميم، وما خاصش نعتابروها صحيحة بلا تحقق فالمواضيع الحسا��ة.' };
  }

  if (has('javascript', 'react', 'typescript', 'python', 'برمجة', 'كود', 'api', 'html', 'css', 'bug', 'خطأ برمجي')) {
    return { reply: 'نقدر نعاونك فالبرمجة ونشرح المفاهيم ولا نراجع كود. باش يكون الجواب دقيق، صيفط المقطع المرتبط بالمشكل، رسالة الخطأ كاملة، وشنو النتيجة اللي كنتي متوقع. ما تشاركش كلمات السر ولا مفاتيح API فالمحادثة.' };
  }

  if (has('صحة', 'طبي', 'دواء', 'ألم', 'symptom', 'medical', 'medicine')) {
    return { reply: 'نقدر نعطيك معلومات صحية عامة، ولكن ما نقدرش نشخّص الحالة أو نعوّض الطبيب. إلا كانت الأعراض قوية أو مستعجلة، تاصل بخدمات الطوارئ أو مختص صحي. شنو المعلومة العامة اللي كتقلب عليها؟' };
  }

  if (has('الطقس', 'weather', 'اليوم', 'دابا', 'الآن', 'live', 'حالياً')) {
    return { reply: 'ما عنديش اتصال مباشر بالطقس أو الأخبار الحية. إلا عطيتيني المدينة والمعطيات اللي عندك، نقدر نعاونك تفسرها أو نخطط بناءً عليها.' };
  }

  if (/[؟?]$/.test(query.trim()) || has('كيفاش', 'علاش', 'شنو', 'واش', 'كيف', 'لماذا', 'what', 'how', 'why', 'when', 'where')) {
    return { reply: 'نقدر نعاونك فالمواضيع العامة ونشرح خطوة بخطوة. باش نعطيك جواب أدق، زيدني شوية ديال السياق أو حدّد الجانب اللي بغيتي نركز عليه. ما عنديش تصفح مباشر للمعلومات الحية، وغادي نوضح ليك إلا كانت المعلومة كتحتاج تحقق.' };
  }

  return { reply: 'وصلني سؤالك. نقدر نعاونك بشرح مبسّط، أفكار عملية، أو بمعلومات على خدمات Elite Pro Services. عطيني سياق أكثر أو قل لي شنو بالضبط باغي تعرف، وغادي نجاوبك بالدارجة على قد ما نقدر.' };
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ reply: 'استعمل نموذج المحادثة لإرسال سؤالك.' } satisfies AssistantReply));
    return;
  }

  try {
    const messages = readMessages(parseBody(request.body));
    const query = messages.filter(({ role }) => role === 'user').at(-1)?.content ?? '';
    const result = replyTo(query);
    response.statusCode = 200;
    response.end(JSON.stringify(result satisfies AssistantReply));
  } catch {
    response.statusCode = 200;
    response.end(JSON.stringify({
      reply: 'نقدر نعاونك مباشرة. وضّح ليا السؤال أو تواصل معنا عبر واتساب إلى كان الموضوع على مشروعك.',
      whatsappUrl: agencyWhatsapp,
    } satisfies AssistantReply));
  }
}
