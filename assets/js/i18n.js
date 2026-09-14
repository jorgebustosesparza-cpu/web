/* Alphamilz · capa de contenido (ES por defecto, EN alterno) */
window.ALPHA_I18N = (function () {
  const es = {
    'loader.label': 'Cargando',

    'nav.services': 'Servicios', 'nav.work': 'Clientes', 'nav.process': 'Proceso',
    'nav.approach': 'Enfoque', 'nav.contact': 'Contacto', 'nav.cta': 'Auditoría gratis',

    'hero.eyebrow': 'Agencia de IA aplicada',
    'hero.t1': 'IA que trabaja', 'hero.t2': 'para', 'hero.t3': 'tu empresa',
    'hero.lede': 'Automatizamos lo repetitivo, conectamos tu información y construimos las herramientas que a tu equipo le hacen falta.',
    'hero.cta1': 'Auditoría gratis', 'hero.cta2': 'Ver servicios',
    'hero.scroll': 'Desplaza',

    'services.eyebrow': 'Servicios', 'services.title': 'Qué hacemos',
    'services.lede': 'Ponemos la IA dentro de tu operación, no al lado. Donde ya trabaja tu equipo.',
    's1.t': 'Implementación de IA', 's1.d': 'Agentes que hacen el trabajo repetitivo de tu equipo.',
    's1.a': 'Agentes', 's1.b': 'Conocimiento', 's1.c': 'Integraciones',
    's2.t': 'Automatizaciones', 's2.d': 'WhatsApp, correo, llamadas y procesos corriendo solos 24/7.',
    's2.a': 'WhatsApp', 's2.b': 'Correo', 's2.c': 'Llamadas',
    's3.t': 'Desarrollo de aplicaciones', 's3.d': 'Apps web y móviles a la medida, conectadas a tu operación.',
    's3.a': 'Web', 's3.b': 'Móvil', 's3.c': 'Dashboards',
    's4.t': 'Webs para búsqueda en LLM', 's4.d': 'Sitios que ChatGPT, Gemini y Claude entienden y recomiendan.',
    's4.a': 'GEO', 's4.b': 'Datos estructurados', 's4.c': 'llms.txt',
    's5.t': 'Video con IA', 's5.d': 'Producción generativa para campañas y contenido a escala.',
    's5.a': 'Campañas', 's5.b': 'Producto', 's5.c': 'Social',
    'svc.cta.t': '¿No sabes por dónde empezar?', 'svc.cta.d': 'Te lo decimos en 15 minutos, sin costo.',

    'need.eyebrow': 'A la medida', 'need.t1': 'Hacemos lo que', 'need.t2': 'necesitas',
    'need.hint': 'Dinos por dónde empezamos',
    'need.cta': 'Hablar de esto por WhatsApp',
    'need.ia': 'La IA entra donde más duele: identificamos el proceso, lo automatizamos y lo dejamos corriendo.',
    'need.auto': 'Tus mensajes, correos y llamadas atendidos al instante, sin que nadie esté encima.',
    'need.apps': 'La herramienta que te falta, construida sobre los datos que ya tienes.',
    'need.web': 'Un sitio que los buscadores y los modelos de lenguaje citan cuando preguntan por tu categoría.',
    'need.video': 'Piezas de video listas para campaña, en días y no en meses.',
    'need.mkt': 'Contenido, segmentación y reportes automáticos alrededor de tu cliente real.',

    'process.eyebrow': 'Proceso',
    'process.title': 'Cómo entramos',
    'p1.t': 'Diagnóstico', 'p1.d': 'Una sesión. Salimos con el mapa de lo que sí conviene automatizar.',
    'p2.t': 'Diseño e integración', 'p2.d': 'Construimos sobre las herramientas que tu equipo ya usa.',
    'p3.t': 'Producción', 'p3.d': 'Lo dejamos corriendo, medido y con tu gente capacitada.',

    'price.eyebrow': 'Precios', 'price.title': 'Lo que cuesta empezar',
    'price.lede': 'Estos son los pisos. El número final lo define el alcance, y eso lo vemos en el diagnóstico.',
    'price.from': 'desde',
    'price.1.t': 'Páginas web', 'price.1.v': '$5,000', 'price.1.d': 'Sitio a la medida, listo para buscadores y para LLM.',
    'price.2.t': 'Automatización de WhatsApp', 'price.2.v': '$2,000', 'price.2.d': 'Responde, da seguimiento y registra sin que nadie esté encima.',
    'price.3.t': 'Aplicaciones', 'price.3.v': '$9,000', 'price.3.d': 'Web o móvil, conectada a la operación que ya tienes.',
    'price.note': 'Pesos mexicanos. IVA no incluido.',
    'price.cta': 'Cotizar por WhatsApp',

    'phil.eyebrow': 'Enfoque', 'phil.t1': 'La IA debe resolver problemas,', 'phil.t2': 'no crear nuevos.',
    'phil.lede': 'Empezamos por el proceso que duele y por el número que quieres mover. Nada de tecnología suelta.',

    'faq.eyebrow': 'Dudas', 'faq.title': 'Lo que nos preguntan',
    'faq.q1': '¿Por dónde empezamos?', 'faq.a1': 'Por una auditoría gratis de 15 minutos. Revisamos tu operación y te decimos qué conviene automatizar primero.',
    'faq.q2': '¿Necesito ordenar mis datos antes?', 'faq.a2': 'No. Parte del trabajo es conectar lo que hoy está disperso en documentos, chats y sistemas.',
    'faq.q3': '¿Cuánto cuesta?', 'faq.a3': 'Páginas web desde $5,000, automatización de WhatsApp desde $2,000 y aplicaciones desde $9,000 pesos. El precio final depende del alcance.',
    'faq.q4': '¿Trabajan con mis herramientas?', 'faq.a4': 'Sí. La IA vive dentro de tu stack actual: CRM, correo, WhatsApp, hojas de cálculo y ERP.',

    'cta.t1': 'Listo para tomar', 'cta.t2': 'el paso alpha',
    'cta.copy': 'Auditoría gratis de 15 minutos. Sin presentación de ventas.',
    'cta.wa': 'Escríbenos por WhatsApp', 'cta.mail': 'Mándanos un correo',

    'pop.title': '¿Quieres una auditoría gratis de tu negocio?',
    'pop.copy': '15 minutos por WhatsApp. Te decimos qué se puede automatizar primero y cuánto tiempo recupera tu equipo.',
    'pop.cta': 'Agendar por WhatsApp', 'pop.no': 'Ahora no', 'pop.badge': 'Sin costo',

    'wa.float': 'Escríbenos por WhatsApp',
    'wa.default': 'Hola Alphamilz, quiero una auditoría gratis de mi negocio.',
    'wa.topic': 'Hola Alphamilz, me interesa',

    'footer.tag': 'IA aplicada a negocios.', 'footer.nav': 'Sitio', 'footer.contact': 'Contacto',
    'footer.machines': 'Para máquinas', 'footer.rights': 'Todos los derechos reservados.'
  };

  const en = {
    'loader.label': 'Loading',

    'nav.services': 'Services', 'nav.work': 'Clients', 'nav.process': 'Process',
    'nav.approach': 'Approach', 'nav.contact': 'Contact', 'nav.cta': 'Free audit',

    'hero.eyebrow': 'Applied AI agency',
    'hero.t1': 'AI that works', 'hero.t2': 'for', 'hero.t3': 'your business',
    'hero.lede': 'We automate the repetitive work, connect your information and build the tools your team is missing.',
    'hero.cta1': 'Free audit', 'hero.cta2': 'See services',
    'hero.scroll': 'Scroll',

    'services.eyebrow': 'Services', 'services.title': 'What we do',
    'services.lede': 'We put AI inside your operation, not beside it. Where your team already works.',
    's1.t': 'AI implementation', 's1.d': 'Agents that take the repetitive work off your team.',
    's1.a': 'Agents', 's1.b': 'Knowledge', 's1.c': 'Integrations',
    's2.t': 'Automation', 's2.d': 'WhatsApp, email, calls and processes running on their own 24/7.',
    's2.a': 'WhatsApp', 's2.b': 'Email', 's2.c': 'Calls',
    's3.t': 'App development', 's3.d': 'Custom web and mobile apps wired into your operation.',
    's3.a': 'Web', 's3.b': 'Mobile', 's3.c': 'Dashboards',
    's4.t': 'Websites for LLM search', 's4.d': 'Sites ChatGPT, Gemini and Claude understand and recommend.',
    's4.a': 'GEO', 's4.b': 'Structured data', 's4.c': 'llms.txt',
    's5.t': 'AI video', 's5.d': 'Generative production for campaigns and content at scale.',
    's5.a': 'Campaigns', 's5.b': 'Product', 's5.c': 'Social',
    'svc.cta.t': 'Not sure where to start?', 'svc.cta.d': 'We tell you in 15 minutes, at no cost.',

    'need.eyebrow': 'Tailored', 'need.t1': 'We do what', 'need.t2': 'you need',
    'need.hint': 'Tell us where we start',
    'need.cta': 'Talk about this on WhatsApp',
    'need.ia': 'AI goes where it hurts: we find the process, automate it and leave it running.',
    'need.auto': 'Messages, email and calls answered instantly, with nobody chasing them.',
    'need.apps': 'The tool you are missing, built on the data you already have.',
    'need.web': 'A site that search engines and language models cite for your category.',
    'need.video': 'Campaign-ready video in days instead of months.',
    'need.mkt': 'Content, targeting and automatic reports built around your real customer.',

    'process.eyebrow': 'Process', 'process.title': 'How we start',
    'p1.t': 'Diagnosis', 'p1.d': 'One session. We leave with a map of what is worth automating.',
    'p2.t': 'Design and integration', 'p2.d': 'We build on the tools your team already uses.',
    'p3.t': 'Production', 'p3.d': 'We leave it running, measured, with your people trained.',

    'price.eyebrow': 'Pricing', 'price.title': 'What it costs to start',
    'price.lede': 'These are the floors. The final number comes from the scope, and that comes out of the diagnosis.',
    'price.from': 'from',
    'price.1.t': 'Websites', 'price.1.v': '$5,000', 'price.1.d': 'A custom site, ready for search engines and for LLMs.',
    'price.2.t': 'WhatsApp automation', 'price.2.v': '$2,000', 'price.2.d': 'Answers, follows up and logs without anyone chasing it.',
    'price.3.t': 'Applications', 'price.3.v': '$9,000', 'price.3.d': 'Web or mobile, wired into the operation you already have.',
    'price.note': 'Mexican pesos. Tax not included.',
    'price.cta': 'Get a quote on WhatsApp',

    'phil.eyebrow': 'Approach', 'phil.t1': 'AI should solve problems,', 'phil.t2': 'not create new ones.',
    'phil.lede': 'We start from the process that hurts and the number you want to move. No loose technology.',

    'faq.eyebrow': 'Questions', 'faq.title': 'What people ask us',
    'faq.q1': 'Where do we start?', 'faq.a1': 'With a free 15 minute audit. We review your operation and tell you what to automate first.',
    'faq.q2': 'Do I need clean data first?', 'faq.a2': 'No. Part of the job is connecting what is scattered across documents, chats and systems.',
    'faq.q3': 'How much does it cost?', 'faq.a3': 'Websites from $5,000, WhatsApp automation from $2,000 and applications from $9,000 Mexican pesos. The final price depends on scope.',
    'faq.q4': 'Do you work with my tools?', 'faq.a4': 'Yes. AI lives inside your current stack: CRM, email, WhatsApp, spreadsheets and ERP.',

    'cta.t1': 'Ready to take', 'cta.t2': 'the alpha step',
    'cta.copy': 'Free 15 minute audit. No sales deck.',
    'cta.wa': 'Message us on WhatsApp', 'cta.mail': 'Send us an email',

    'pop.title': 'Want a free audit of your business?',
    'pop.copy': '15 minutes on WhatsApp. We tell you what to automate first and how much time your team gets back.',
    'pop.cta': 'Book on WhatsApp', 'pop.no': 'Not now', 'pop.badge': 'No cost',

    'wa.float': 'Message us on WhatsApp',
    'wa.default': 'Hi Alphamilz, I want a free audit of my business.',
    'wa.topic': 'Hi Alphamilz, I am interested in',

    'footer.tag': 'Applied AI for business.', 'footer.nav': 'Site', 'footer.contact': 'Contact',
    'footer.machines': 'For machines', 'footer.rights': 'All rights reserved.'
  };

  return { es, en };
})();
