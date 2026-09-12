/* Alphamilz · content layer (ES default, EN alternate).
   Keys map 1:1 to [data-i18n] attributes in index.html. */
window.ALPHA_I18N = (function () {
  const es = {
    'loader.label': 'Inicializando red',

    'nav.services': 'Servicios', 'nav.story': 'Transformación', 'nav.agents': 'Agentes',
    'nav.approach': 'Enfoque', 'nav.lab': 'Diagnóstico', 'nav.outcomes': 'Resultados',
    'nav.cta': 'Agenda una llamada',

    'hero.eyebrow': 'Inteligencia artificial aplicada a negocios',
    'hero.title1': 'IA que trabaja', 'hero.title2': 'para', 'hero.title3': 'tu empresa',
    'hero.lede': 'Diseñamos e implementamos sistemas de IA prácticos que automatizan trabajo, conectan el conocimiento, mejoran decisiones y ayudan a tu equipo a avanzar más rápido.',
    'hero.cta1': 'Explora lo que la IA puede hacer',
    'hero.cta2': 'Habla con un experto en IA',
    'hero.explore': 'Explora la red por función de negocio',
    'hero.scroll': 'Desplaza',
    'hero.proof1': 'Automatizaciones en WhatsApp, correo y llamadas',
    'hero.proof2': 'Webs que los LLM entienden',
    'hero.proof3': 'Video con IA',

    'fn.sales.name': 'Ventas',
    'fn.sales.copy': 'Agentes de IA califican prospectos, resumen conversaciones, actualizan el CRM y sacan a la luz oportunidades que hoy se pierden.',
    'fn.marketing.name': 'Marketing',
    'fn.marketing.copy': 'La IA analiza el comportamiento de tus clientes, genera insights, personaliza la comunicación y automatiza los flujos repetitivos.',
    'fn.operations.name': 'Operaciones',
    'fn.operations.copy': 'Agentes conectados coordinan tareas, documentos, aprobaciones y procesos internos entre sistemas que antes no se hablaban.',
    'fn.support.name': 'Soporte',
    'fn.support.copy': 'La IA entiende el contexto del cliente, busca en el conocimiento de la empresa, sugiere respuestas y resuelve lo repetitivo.',
    'fn.knowledge.name': 'Conocimiento',
    'fn.knowledge.copy': 'Documentos, conversaciones, bases de datos y sistemas de negocio se conectan en una sola capa de conocimiento inteligente.',

    'services.eyebrow': 'Lo que hacemos',
    'services.title': 'Cuatro formas de poner la IA a trabajar.',
    'services.lede': 'No vendemos tecnología suelta. Instalamos sistemas que resuelven un problema medible dentro de tu operación.',
    'svc.1.title': 'Implementación de IA en tu empresa',
    'svc.1.copy': 'Diagnóstico, diseño e integración. Identificamos dónde la IA genera valor real, construimos el sistema y lo conectamos con las herramientas que tu equipo ya usa.',
    'svc.1.t1': 'Diagnóstico de oportunidades', 'svc.1.t2': 'Arquitectura e integración',
    'svc.1.t3': 'Puesta en producción', 'svc.1.t4': 'Adopción del equipo',
    'svc.2.title': 'Webs optimizadas para búsqueda en LLM',
    'svc.2.copy': 'Tus clientes ya preguntan en ChatGPT, Gemini, Claude y Perplexity. Construimos sitios estructurados para que esos modelos encuentren, entiendan y recomienden tu negocio.',
    'svc.2.t1': 'Datos estructurados', 'svc.2.t2': 'Arquitectura semántica',
    'svc.2.t3': 'Contenido citable', 'svc.2.t4': 'llms.txt y agentes',
    'svc.3.title': 'Automatizaciones que operan solas',
    'svc.3.copy': 'WhatsApp, correo, llamadas y procesos internos. Flujos que responden, clasifican, registran y dan seguimiento las 24 horas, con trazabilidad y control humano donde importa.',
    'svc.3.t1': 'WhatsApp', 'svc.3.t2': 'Correo', 'svc.3.t3': 'Llamadas', 'svc.3.t4': 'Procesos internos',
    'svc.4.title': 'Video con IA',
    'svc.4.copy': 'Producción generativa para campañas, producto y contenido a escala. Del guion a la pieza final, con consistencia de marca y volumen que antes era imposible.',
    'svc.4.t1': 'Campañas', 'svc.4.t2': 'Producto', 'svc.4.t3': 'Contenido a escala', 'svc.4.t4': 'Identidad consistente',

    'story.eyebrow': 'La transformación',
    'story.1.tag': 'Fragmentado', 'story.1.title': 'Tu operación, hoy.',
    'story.1.copy': 'Herramientas que no se hablan. Datos en hojas de cálculo, conversaciones en WhatsApp, documentos en tres nubes distintas y procesos que dependen de que alguien se acuerde. Todo funciona, pero nada está conectado.',
    'story.1.m1': 'Información dispersa', 'story.1.m2': 'Trabajo repetitivo', 'story.1.m3': 'Decisiones lentas',
    'story.2.tag': 'Conectado', 'story.2.title': 'La IA conecta lo que ya tienes.',
    'story.2.copy': 'Primero se tienden los puentes: sistemas que empiezan a hablar entre sí, información que viaja sola y tareas repetitivas que dejan de ocupar a tu gente. Sin reemplazar tu stack, integrándolo.',
    'story.2.m1': 'Integraciones', 'story.2.m2': 'Flujo de datos', 'story.2.m3': 'Automatización',
    'story.3.tag': 'Agentes', 'story.3.title': 'Agentes operando en toda la organización.',
    'story.3.copy': 'Unidades autónomas que reciben información, razonan sobre la tarea, actúan sobre tus sistemas y devuelven un resultado verificable. Trabajan en paralelo, sin horario, con supervisión humana.',
    'story.3.m1': 'Reciben contexto', 'story.3.m2': 'Razonan', 'story.3.m3': 'Ejecutan y reportan',
    'story.4.tag': 'Coordinado', 'story.4.title': 'Un sistema que aprende contigo.',
    'story.4.copy': 'Lo que era un conjunto de herramientas sueltas se vuelve una sola inteligencia operativa: coordinada, medible y capaz de mejorar con cada interacción de tu equipo.',
    'story.4.m1': 'Conocimiento vivo', 'story.4.m2': 'Operación medible', 'story.4.m3': 'Mejora continua',

    'outcomes.eyebrow': 'Resultados de negocio',
    'outcomes.title': 'Lo que cambia cuando la IA entra bien.',
    'outcomes.lede': 'Medimos el impacto donde se nota: horas recuperadas, procesos que ya no se caen y decisiones que se toman con datos en lugar de intuición.',
    'out.1.title': 'Automatiza el trabajo repetitivo', 'out.1.copy': 'Menos procesos manuales y menos carga operativa para tu equipo.',
    'out.2.title': 'Conecta tu conocimiento', 'out.2.copy': 'Convierte la información dispersa de la empresa en inteligencia accesible.',
    'out.3.title': 'Construye agentes de IA', 'out.3.copy': 'Sistemas que razonan, ejecutan acciones y colaboran con tu equipo.',
    'out.4.title': 'Toma mejores decisiones', 'out.4.copy': 'Transforma los datos del negocio en información accionable.',
    'out.5.title': 'Avanza más rápido', 'out.5.copy': 'Herramientas de IA diseñadas alrededor de cómo trabaja realmente tu gente.',

    'agents.eyebrow': 'Ecosistema de agentes',
    'agents.title': 'Agentes especializados, conectados a tus herramientas reales.',
    'agents.lede': 'Cada agente tiene un trabajo, un conjunto de permisos y un flujo verificable. Pasa el cursor para ver cómo opera.',
    'ag.1.title': 'Agente de Ventas', 'ag.1.copy': 'Califica prospectos, resume conversaciones y deja el CRM al día sin que nadie escriba una nota.',
    'ag.1.s1': 'CRM', 'ag.1.s2': 'Correo', 'ag.1.s3': 'Notas de reunión',
    'ag.2.title': 'Agente de Soporte', 'ag.2.copy': 'Entiende el contexto del cliente, busca en el conocimiento de la empresa y resuelve lo repetitivo.',
    'ag.2.s1': 'Base de conocimiento', 'ag.2.s2': 'Mensajes del cliente', 'ag.2.s3': 'Resolución',
    'ag.3.title': 'Agente de Operaciones', 'ag.3.copy': 'Coordina tareas, documentos y aprobaciones entre los sistemas internos del negocio.',
    'ag.3.s1': 'Documentos', 'ag.3.s2': 'Aprobaciones', 'ag.3.s3': 'Sistemas internos',
    'ag.4.title': 'Agente de Analítica', 'ag.4.copy': 'Convierte los datos del negocio en insights y reportes que llegan solos, cuando sirven.',
    'ag.4.s1': 'Datos del negocio', 'ag.4.s2': 'Insights', 'ag.4.s3': 'Reportes',

    'phil.eyebrow': 'Nuestro enfoque',
    'phil.title1': 'La IA debe resolver problemas de negocio,', 'phil.title2': 'no crear nuevos.',
    'phil.lede': 'Identificamos dónde la IA puede crear apalancamiento real, diseñamos los sistemas correctos, los integramos con tus herramientas actuales y ayudamos a tu equipo a ponerlos a trabajar.',
    'phil.p1.t': 'Primero el problema', 'phil.p1.c': 'Empezamos por el proceso que duele y por el número que queremos mover, no por el modelo de moda.',
    'phil.p2.t': 'Dentro de tu stack', 'phil.p2.c': 'La IA vive donde ya trabaja tu equipo. Sin migraciones innecesarias ni herramientas paralelas.',
    'phil.p3.t': 'Con humanos en control', 'phil.p3.c': 'Cada sistema es auditable: qué hizo, con qué información y dónde interviene una persona.',

    'lab.eyebrow': 'Diagnóstico interactivo',
    'lab.title': 'Cuéntale a la red tu problema.',
    'lab.lede': 'Escribe un reto concreto de tu operación. La red se reorganiza y te muestra qué tipo de sistema de IA lo resolvería.',
    'lab.label': 'Describe tu reto de negocio',
    'lab.placeholder': 'El soporte a clientes nos consume demasiado tiempo.',
    'lab.go': 'Analizar',
    'lab.ex1': 'El soporte a clientes nos consume demasiado tiempo.',
    'lab.ex2': 'Ventas pierde horas actualizando el CRM.',
    'lab.ex3': 'El conocimiento de la empresa está disperso.',
    'lab.ex4': 'Nuestros reportes son casi todos manuales.',
    'lab.resultLabel': 'Dónde la IA crea apalancamiento',
    'lab.note': 'Este diagnóstico es una lectura inicial generada en tu navegador. El mapa real lo construimos contigo, con acceso a tus procesos y datos.',

    'faq.eyebrow': 'Preguntas frecuentes', 'faq.title': 'Lo que suelen preguntarnos.',
    'faq.q1': '¿Qué hace exactamente Alphamilz?',
    'faq.a1': 'Implementamos inteligencia artificial aplicada a negocios: identificamos dónde la IA genera valor real, diseñamos el sistema, lo integramos con tus herramientas actuales y acompañamos al equipo hasta que está en producción.',
    'faq.q2': '¿Qué es una web optimizada para búsqueda en LLM?',
    'faq.a2': 'Es un sitio construido para ser entendido y citado por modelos como ChatGPT, Gemini, Claude o Perplexity: contenido claro y verificable, datos estructurados, arquitectura semántica, respuestas directas a preguntas reales y archivos como llms.txt que describen el negocio para agentes.',
    'faq.q3': '¿Qué procesos se pueden automatizar?',
    'faq.a3': 'Atención por WhatsApp, respuesta y clasificación de correo, llamadas de seguimiento, captura de datos en el CRM, generación de reportes, revisión de documentos, aprobaciones internas y cualquier flujo repetitivo con reglas claras.',
    'faq.q4': '¿Cuánto tarda una implementación?',
    'faq.a4': 'Un diagnóstico toma de una a dos semanas. El primer sistema en producción suele tomar entre cuatro y ocho semanas, según las integraciones y el acceso a los datos.',
    'faq.q5': '¿Necesito tener mis datos ordenados para empezar?',
    'faq.a5': 'No. Parte del trabajo es conectar información dispersa en documentos, conversaciones y sistemas para convertirla en una capa de conocimiento consultable. Empezamos con lo que existe hoy.',

    'cta.title1': 'Encuentra dónde la IA puede crear', 'cta.title2': 'apalancamiento', 'cta.title3': 'en tu negocio.',
    'cta.copy': 'Una sesión de 45 minutos, sin presentación de ventas. Salimos con un mapa de oportunidades priorizado por impacto y esfuerzo.',
    'cta.button': 'Inicia un diagnóstico de IA', 'cta.wa': 'Escríbenos por WhatsApp',

    'footer.tag': 'IA aplicada a negocios.', 'footer.nav': 'Navegación', 'footer.contact': 'Contacto',
    'footer.machines': 'Para máquinas', 'footer.rights': 'Todos los derechos reservados.',
    'footer.built': 'Construido para humanos y para modelos.'
  };

  const en = {
    'loader.label': 'Initializing network',

    'nav.services': 'Services', 'nav.story': 'Transformation', 'nav.agents': 'Agents',
    'nav.approach': 'Approach', 'nav.lab': 'Diagnostic', 'nav.outcomes': 'Outcomes',
    'nav.cta': 'Book a call',

    'hero.eyebrow': 'Applied artificial intelligence for business',
    'hero.title1': 'AI that works', 'hero.title2': 'for', 'hero.title3': 'your business',
    'hero.lede': 'We design and implement practical AI systems that automate work, connect knowledge, improve decisions, and help teams move faster.',
    'hero.cta1': 'Explore What AI Can Do',
    'hero.cta2': 'Talk to an AI Expert',
    'hero.explore': 'Explore the network by business function',
    'hero.scroll': 'Scroll',
    'hero.proof1': 'Automation across WhatsApp, email and calls',
    'hero.proof2': 'Websites that LLMs understand',
    'hero.proof3': 'AI video',

    'fn.sales.name': 'Sales',
    'fn.sales.copy': 'AI agents qualify leads, summarize conversations, update CRM records, and surface opportunities that are lost today.',
    'fn.marketing.name': 'Marketing',
    'fn.marketing.copy': 'AI analyzes customer behavior, generates insights, personalizes communication, and automates repetitive workflows.',
    'fn.operations.name': 'Operations',
    'fn.operations.copy': 'Connected AI agents coordinate tasks, documents, approvals, and internal processes across systems that never talked to each other.',
    'fn.support.name': 'Customer Support',
    'fn.support.copy': 'AI understands customer context, searches company knowledge, suggests answers, and resolves common requests.',
    'fn.knowledge.name': 'Knowledge',
    'fn.knowledge.copy': 'Documents, conversations, databases, and business systems connect into one intelligent knowledge layer.',

    'services.eyebrow': 'What we do',
    'services.title': 'Four ways to put AI to work.',
    'services.lede': 'We do not sell disconnected technology. We install systems that solve a measurable problem inside your operation.',
    'svc.1.title': 'AI implementation for your company',
    'svc.1.copy': 'Diagnosis, design and integration. We find where AI creates real value, build the system, and connect it to the tools your team already uses.',
    'svc.1.t1': 'Opportunity mapping', 'svc.1.t2': 'Architecture and integration',
    'svc.1.t3': 'Production rollout', 'svc.1.t4': 'Team adoption',
    'svc.2.title': 'Websites optimized for LLM search',
    'svc.2.copy': 'Your customers already ask ChatGPT, Gemini, Claude and Perplexity. We build structured sites so those models find, understand and recommend your business.',
    'svc.2.t1': 'Structured data', 'svc.2.t2': 'Semantic architecture',
    'svc.2.t3': 'Citable content', 'svc.2.t4': 'llms.txt and agents',
    'svc.3.title': 'Automation that runs on its own',
    'svc.3.copy': 'WhatsApp, email, calls and internal processes. Flows that answer, classify, log and follow up around the clock, with traceability and human control where it matters.',
    'svc.3.t1': 'WhatsApp', 'svc.3.t2': 'Email', 'svc.3.t3': 'Calls', 'svc.3.t4': 'Internal processes',
    'svc.4.title': 'AI video',
    'svc.4.copy': 'Generative production for campaigns, product and content at scale. From script to final cut, with brand consistency and volume that was impossible before.',
    'svc.4.t1': 'Campaigns', 'svc.4.t2': 'Product', 'svc.4.t3': 'Content at scale', 'svc.4.t4': 'Consistent identity',

    'story.eyebrow': 'The transformation',
    'story.1.tag': 'Fragmented', 'story.1.title': 'Your operation, today.',
    'story.1.copy': 'Tools that do not talk. Data in spreadsheets, conversations in WhatsApp, documents across three clouds, and processes that depend on someone remembering. Everything works, nothing is connected.',
    'story.1.m1': 'Scattered information', 'story.1.m2': 'Repetitive work', 'story.1.m3': 'Slow decisions',
    'story.2.tag': 'Connected', 'story.2.title': 'AI connects what you already have.',
    'story.2.copy': 'First the bridges: systems that start talking to each other, information that travels on its own, and repetitive tasks that stop consuming your people. We integrate your stack instead of replacing it.',
    'story.2.m1': 'Integrations', 'story.2.m2': 'Data flow', 'story.2.m3': 'Automation',
    'story.3.tag': 'Agents', 'story.3.title': 'Agents operating across the organization.',
    'story.3.copy': 'Autonomous units that receive information, reason about the task, act on your systems and return a verifiable result. They work in parallel, with no schedule and with human oversight.',
    'story.3.m1': 'Receive context', 'story.3.m2': 'Reason', 'story.3.m3': 'Execute and report',
    'story.4.tag': 'Coordinated', 'story.4.title': 'A system that learns with you.',
    'story.4.copy': 'What was a set of loose tools becomes a single operating intelligence: coordinated, measurable, and able to improve with every interaction of your team.',
    'story.4.m1': 'Living knowledge', 'story.4.m2': 'Measurable operation', 'story.4.m3': 'Continuous improvement',

    'outcomes.eyebrow': 'Business outcomes',
    'outcomes.title': 'What changes when AI lands well.',
    'outcomes.lede': 'We measure impact where it shows: hours recovered, processes that stop breaking, and decisions made with data instead of instinct.',
    'out.1.title': 'Automate repetitive work', 'out.1.copy': 'Reduce manual processes and operational overhead.',
    'out.2.title': 'Connect your knowledge', 'out.2.copy': 'Turn scattered company information into accessible intelligence.',
    'out.3.title': 'Build AI agents', 'out.3.copy': 'Create systems that can reason, take actions, and collaborate with your team.',
    'out.4.title': 'Make better decisions', 'out.4.copy': 'Transform business data into actionable insights.',
    'out.5.title': 'Move faster', 'out.5.copy': 'Give teams AI tools designed around how they actually work.',

    'agents.eyebrow': 'Agent ecosystem',
    'agents.title': 'Specialized agents, connected to your real business tools.',
    'agents.lede': 'Every agent has one job, a set of permissions and a verifiable workflow. Hover to see how it operates.',
    'ag.1.title': 'Sales Agent', 'ag.1.copy': 'Qualifies leads, summarizes conversations and keeps the CRM current without anyone typing a note.',
    'ag.1.s1': 'CRM', 'ag.1.s2': 'Email', 'ag.1.s3': 'Meeting notes',
    'ag.2.title': 'Support Agent', 'ag.2.copy': 'Understands customer context, searches company knowledge and resolves the repetitive requests.',
    'ag.2.s1': 'Knowledge base', 'ag.2.s2': 'Customer messages', 'ag.2.s3': 'Resolution',
    'ag.3.title': 'Operations Agent', 'ag.3.copy': 'Coordinates tasks, documents and approvals across internal business systems.',
    'ag.3.s1': 'Documents', 'ag.3.s2': 'Approvals', 'ag.3.s3': 'Internal systems',
    'ag.4.title': 'Analytics Agent', 'ag.4.copy': 'Turns business data into insights and reports that arrive on their own, when they are useful.',
    'ag.4.s1': 'Business data', 'ag.4.s2': 'Insights', 'ag.4.s3': 'Reports',

    'phil.eyebrow': 'Our approach',
    'phil.title1': 'AI should solve business problems,', 'phil.title2': 'not create new ones.',
    'phil.lede': 'We identify where AI can create real leverage, design the right systems, integrate them with your existing tools, and help your team put them to work.',
    'phil.p1.t': 'Problem first', 'phil.p1.c': 'We start from the process that hurts and the number we want to move, not from the model of the month.',
    'phil.p2.t': 'Inside your stack', 'phil.p2.c': 'AI lives where your team already works. No unnecessary migrations, no parallel tools.',
    'phil.p3.t': 'Humans in control', 'phil.p3.c': 'Every system is auditable: what it did, with what information, and where a person steps in.',

    'lab.eyebrow': 'Interactive diagnostic',
    'lab.title': 'Tell the network your problem.',
    'lab.lede': 'Describe one concrete challenge in your operation. The network reorganizes and shows what kind of AI system would solve it.',
    'lab.label': 'Describe your business challenge',
    'lab.placeholder': 'Customer support takes too much time.',
    'lab.go': 'Analyze',
    'lab.ex1': 'Customer support takes too much time.',
    'lab.ex2': 'Sales spends hours updating the CRM.',
    'lab.ex3': 'Our company knowledge is scattered everywhere.',
    'lab.ex4': 'Our reporting process is mostly manual.',
    'lab.resultLabel': 'Where AI creates leverage',
    'lab.note': 'This diagnostic is an initial read generated in your browser. We build the real map with you, with access to your processes and data.',

    'faq.eyebrow': 'Frequently asked', 'faq.title': 'What people usually ask us.',
    'faq.q1': 'What exactly does Alphamilz do?',
    'faq.a1': 'We implement applied AI for business: we identify where AI creates real value, design the system, integrate it with your current tools and stay with the team until it runs in production.',
    'faq.q2': 'What is a website optimized for LLM search?',
    'faq.a2': 'A site built to be understood and cited by models like ChatGPT, Gemini, Claude or Perplexity: clear verifiable content, structured data, semantic architecture, direct answers to real questions, and files such as llms.txt that describe the business to agents.',
    'faq.q3': 'Which processes can be automated?',
    'faq.a3': 'WhatsApp support, email triage and replies, follow-up calls, CRM data capture, report generation, document review, internal approvals, and any repetitive flow with clear rules.',
    'faq.q4': 'How long does an implementation take?',
    'faq.a4': 'A diagnostic takes one to two weeks. The first system in production usually takes four to eight weeks, depending on integrations and data access.',
    'faq.q5': 'Do I need clean data before starting?',
    'faq.a5': 'No. Part of the work is connecting information scattered across documents, conversations and systems, turning it into a queryable knowledge layer. We start with what exists today.',

    'cta.title1': 'Find where AI can create', 'cta.title2': 'leverage', 'cta.title3': 'in your business.',
    'cta.copy': 'A 45 minute session, no sales deck. You leave with an opportunity map prioritized by impact and effort.',
    'cta.button': 'Start an AI Assessment', 'cta.wa': 'Message us on WhatsApp',

    'footer.tag': 'Applied AI for business.', 'footer.nav': 'Navigation', 'footer.contact': 'Contact',
    'footer.machines': 'For machines', 'footer.rights': 'All rights reserved.',
    'footer.built': 'Built for humans and for models.'
  };

  /* Diagnosis engine · keyword driven, runs entirely client side. */
  const topics = [
    { id: 'support', domain: 'support',
      strong: ['soporte','atencion','ticket','helpdesk','postventa','whatsapp','queja'],
      match: ['soporte','atencion','atención','cliente','clientes','ticket','whatsapp','mensaje','chat','queja','postventa','support','customer','service','helpdesk','inbox'],
      es: { title: 'Soporte asistido por IA', cards: [
        ['Agente','Agente de soporte','Responde en WhatsApp, correo y chat con el contexto del cliente y el historial completo.'],
        ['Conocimiento','Base de conocimiento viva','Manuales, políticas y conversaciones pasadas convertidas en respuestas consultables.'],
        ['Automatización','Triage y enrutamiento','Clasifica, prioriza y escala a una persona solo cuando hace falta.'],
        ['Analítica','Señales de conversación','Qué preguntan, qué falla y qué producto genera más fricción.']]},
      en: { title: 'AI assisted support', cards: [
        ['Agent','Support agent','Answers on WhatsApp, email and chat with full customer context and history.'],
        ['Knowledge','Living knowledge base','Manuals, policies and past conversations turned into queryable answers.'],
        ['Automation','Triage and routing','Classifies, prioritizes and escalates to a person only when needed.'],
        ['Analytics','Conversation signals','What they ask, what breaks and which product creates the most friction.']]}},

    { id: 'sales', domain: 'sales',
      strong: ['crm','prospecto','lead','pipeline','ventas','venta','sales','cotiz'],
      match: ['venta','ventas','crm','prospecto','lead','pipeline','cotiz','vendedor','seguimiento','cierre','sales','deal','quote','follow'],
      es: { title: 'Ventas con menos trabajo manual', cards: [
        ['Agente','Agente de ventas','Califica prospectos, prepara el contexto de cada reunión y sugiere el siguiente paso.'],
        ['Automatización','CRM que se llena solo','Correos, llamadas y notas se convierten en registros estructurados sin captura manual.'],
        ['Integración','Correo, calendario y CRM','Una sola fuente de verdad conectada a las herramientas que ya usan.'],
        ['Analítica','Scoring de oportunidades','Prioriza por probabilidad real de cierre, no por intuición.']]},
      en: { title: 'Sales with less manual work', cards: [
        ['Agent','Sales agent','Qualifies leads, prepares context for every meeting and suggests the next step.'],
        ['Automation','A CRM that fills itself','Emails, calls and notes become structured records with no manual entry.'],
        ['Integration','Email, calendar and CRM','One source of truth wired into the tools they already use.'],
        ['Analytics','Opportunity scoring','Prioritize by real probability of closing, not by gut feel.']]}},

    { id: 'knowledge', domain: 'knowledge',
      strong: ['conocimiento','disperso','scattered','wiki','sop','document'],
      match: ['conocimiento','document','informacion','información','archivo','disperso','manual','wiki','politica','política','procedimiento','knowledge','scattered','file','doc','sop'],
      es: { title: 'Una sola capa de conocimiento', cards: [
        ['Conocimiento','Capa de conocimiento','Documentos, conversaciones y bases de datos unificados en un índice consultable.'],
        ['Agente','Asistente interno','Tu equipo pregunta en lenguaje natural y recibe respuestas con la fuente citada.'],
        ['Integración','Drive, Notion, Sheets, ERP','Conectores que mantienen todo sincronizado sin mover tu información de lugar.'],
        ['Automatización','Mantenimiento continuo','Documentos nuevos se indexan y los obsoletos se marcan solos.']]},
      en: { title: 'One knowledge layer', cards: [
        ['Knowledge','Knowledge layer','Documents, conversations and databases unified into one queryable index.'],
        ['Agent','Internal assistant','Your team asks in natural language and gets answers with the source cited.'],
        ['Integration','Drive, Notion, Sheets, ERP','Connectors that keep everything in sync without moving your information.'],
        ['Automation','Continuous upkeep','New documents get indexed and stale ones get flagged automatically.']]}},

    { id: 'analytics', domain: 'finance',
      strong: ['reporte','report','dashboard','kpi','metrica','analytics','indicador'],
      match: ['reporte','report','dato','datos','dashboard','analisis','análisis','kpi','metrica','métrica','indicador','excel','finanza','analytics','data','manual report'],
      es: { title: 'Decisiones con datos, no con intuición', cards: [
        ['Agente','Agente de analítica','Lee tus fuentes, arma el reporte y explica qué cambió y por qué.'],
        ['Automatización','Reportes que llegan solos','Semanal, mensual o cuando se cruza un umbral, al canal donde ya trabajan.'],
        ['Integración','Modelo de datos unificado','Ventas, operación y finanzas hablando el mismo idioma.'],
        ['Analítica','Alertas inteligentes','Detecta desviaciones antes de que se vuelvan un problema.']]},
      en: { title: 'Decisions from data, not instinct', cards: [
        ['Agent','Analytics agent','Reads your sources, builds the report and explains what changed and why.'],
        ['Automation','Reports that arrive on their own','Weekly, monthly or on a threshold, in the channel where they already work.'],
        ['Integration','Unified data model','Sales, operations and finance speaking the same language.'],
        ['Analytics','Smart alerts','Catches deviations before they become a problem.']]}},

    { id: 'marketing', domain: 'marketing',
      strong: ['marketing','campana','anuncio','ads','video','publicidad'],
      match: ['marketing','campana','campaña','contenido','redes','anuncio','publicidad','video','ads','content','social','brand','marca'],
      es: { title: 'Marketing con producción a escala', cards: [
        ['Agente','Motor de contenido','Genera variantes por canal manteniendo tono, mensaje e identidad de marca.'],
        ['Video','Video con IA','Piezas para campañas y producto, del guion al render final.'],
        ['Automatización','Personalización','Segmentos y mensajes que se ajustan al comportamiento real del cliente.'],
        ['Analítica','Performance en un panel','Qué creatividad funciona, en qué canal y con qué costo.']]},
      en: { title: 'Marketing with production at scale', cards: [
        ['Agent','Content engine','Generates per channel variants while holding tone, message and brand identity.'],
        ['Video','AI video','Pieces for campaigns and product, from script to final render.'],
        ['Automation','Personalization','Segments and messages that adapt to real customer behavior.'],
        ['Analytics','Performance in one panel','Which creative works, on which channel, at what cost.']]}},

    { id: 'operations', domain: 'operations',
      strong: ['aprobac','factur','inventario','logistica','papeleo','approval','invoice'],
      match: ['proceso','operac','aprobac','factur','inventario','logistica','logística','administrativ','papeleo','firma','operations','approval','invoice','process','workflow','paperwork'],
      es: { title: 'Operación coordinada por agentes', cards: [
        ['Agente','Agente de operaciones','Coordina tareas, documentos y aprobaciones entre áreas y sistemas.'],
        ['Automatización','Procesos de punta a punta','Del formulario al registro final, con reglas claras y trazabilidad.'],
        ['Conocimiento','Lectura de documentos','Facturas, contratos y formatos convertidos en datos estructurados.'],
        ['Integración','Tus sistemas internos','ERP, hojas de cálculo y herramientas propias conectadas al mismo flujo.']]},
      en: { title: 'Operations coordinated by agents', cards: [
        ['Agent','Operations agent','Coordinates tasks, documents and approvals across teams and systems.'],
        ['Automation','End to end processes','From the form to the final record, with clear rules and traceability.'],
        ['Knowledge','Document understanding','Invoices, contracts and forms turned into structured data.'],
        ['Integration','Your internal systems','ERP, spreadsheets and in-house tools wired into the same flow.']]}},

    { id: 'llm', domain: 'knowledge',
      strong: ['chatgpt','gemini','claude','perplexity','seo','llm','sitio','website'],
      match: ['web','sitio','seo','google','chatgpt','gemini','claude','perplexity','busqueda','búsqueda','posicion','search','llm','website','visibil'],
      es: { title: 'Visibilidad en buscadores y en LLM', cards: [
        ['Web','Sitio legible para modelos','Arquitectura semántica y contenido que los LLM pueden entender y citar.'],
        ['Conocimiento','Datos estructurados','Schema.org, llms.txt y respuestas directas a las preguntas que ya te hacen.'],
        ['Contenido','Material citable','Páginas que responden con claridad y datos verificables, no con relleno.'],
        ['Analítica','Monitoreo de menciones','Qué responden ChatGPT, Gemini y Perplexity cuando preguntan por tu categoría.']]},
      en: { title: 'Visibility in search and in LLMs', cards: [
        ['Web','A site models can read','Semantic architecture and content that LLMs can understand and cite.'],
        ['Knowledge','Structured data','Schema.org, llms.txt and direct answers to the questions you already get.'],
        ['Content','Citable material','Pages that answer with clarity and verifiable facts, not filler.'],
        ['Analytics','Mention monitoring','What ChatGPT, Gemini and Perplexity say when asked about your category.']]}},

    { id: 'calls', domain: 'support',
      strong: ['llamada','telefono','call','voz','voice','cobranza'],
      match: ['llamada','telefono','teléfono','call','phone','cita','agenda','recordatorio','cobranza','voz','voice'],
      es: { title: 'Llamadas y seguimiento sin fricción', cards: [
        ['Agente','Agente de voz','Llama, confirma, agenda y registra el resultado en tus sistemas.'],
        ['Automatización','Recordatorios y seguimiento','Secuencias por voz, WhatsApp y correo, coordinadas entre sí.'],
        ['Conocimiento','Transcripción y resumen','Cada conversación queda como texto buscable con sus acuerdos.'],
        ['Analítica','Calidad de la conversación','Qué objeciones aparecen y qué mensajes funcionan mejor.']]},
      en: { title: 'Calls and follow-up without friction', cards: [
        ['Agent','Voice agent','Calls, confirms, schedules and logs the outcome into your systems.'],
        ['Automation','Reminders and follow-up','Voice, WhatsApp and email sequences, coordinated with each other.'],
        ['Knowledge','Transcription and summary','Every conversation becomes searchable text with its commitments.'],
        ['Analytics','Conversation quality','Which objections show up and which messages perform best.']]}}
  ];

  const fallback = {
    domain: 'operations',
    es: { title: 'Mapa inicial de oportunidades', cards: [
      ['Diagnóstico','Dónde empieza el valor','Revisamos el proceso, medimos el tiempo que consume y elegimos el primer sistema.'],
      ['Agente','Un agente con un trabajo','Empezamos por una tarea concreta, medible y con dueño dentro del equipo.'],
      ['Automatización','Conectar lo que ya existe','Tus herramientas actuales, hablando entre sí antes de sumar nada nuevo.'],
      ['Conocimiento','Contexto disponible','La información que el sistema necesita, ordenada y accesible.']]},
    en: { title: 'Initial opportunity map', cards: [
      ['Diagnosis','Where value starts','We review the process, measure the time it consumes and choose the first system.'],
      ['Agent','One agent, one job','We start with a concrete, measurable task that has an owner on the team.'],
      ['Automation','Connect what exists','Your current tools talking to each other before adding anything new.'],
      ['Knowledge','Context available','The information the system needs, organized and accessible.']]}
  };

  function diagnose(text, lang) {
    const norm = (v) => (v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const q = norm(text);
    let best = null, bestScore = 0;
    for (const t of topics) {
      let score = 0;
      const strongSet = new Set((t.strong || []).map(norm));
      for (const k of t.match) {
        const key = norm(k);
        if (key.length > 2 && q.includes(key)) score += key.length + (strongSet.has(key) ? 14 : 0);
      }
      if (score > bestScore) { bestScore = score; best = t; }
    }
    const src = (bestScore >= 5 && best) ? best : fallback;
    const pack = src[lang] || src.es;
    return { id: src.id || 'general', domain: src.domain, title: pack.title, cards: pack.cards };
  }

  return { es, en, diagnose };
})();
