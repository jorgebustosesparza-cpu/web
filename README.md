# Alphamitz — sitio web

Sitio de una sola página para **Alphamitz**, agencia de inteligencia artificial aplicada a
negocios. Español por defecto, inglés con un clic. Sin framework, sin build step: son archivos
estáticos que se pueden publicar en cualquier hosting (Netlify, Vercel, Cloudflare Pages,
GitHub Pages, un bucket de S3 o un Nginx).

```
index.html              página completa (ES en el markup, EN vía JS)
llms.txt                descripción del negocio para agentes y modelos de lenguaje
robots.txt              rastreadores de buscadores y de LLM permitidos
sitemap.xml             una URL, con hreflang es/en
site.webmanifest        PWA básica
assets/
  css/main.css          sistema de diseño completo (tokens, tema oscuro/marfil, layout)
  js/i18n.js            todo el copy en ES y EN + motor de diagnóstico del laboratorio
  js/main.js            scroll, idioma, reveals, menú, cursor, laboratorio, arranque WebGL
  js/scene.js           red de inteligencia en Three.js (nodos, enlaces, flujos, agentes)
  fonts/                Plus Jakarta Sans, Inter, JetBrains Mono, Instrument Serif (subset latin)
  img/                  isotipo, favicon y portada para redes sociales
  vendor/               three.js r169 (build de módulo minificado)
```

## Cómo verlo en local

Cualquier servidor estático sirve. Hace falta uno porque `main.js` es un módulo ES:

```bash
npx http-server -p 8080 -c-1 .
# o
python3 -m http.server 8080
```

Luego abre `http://localhost:8080`. `?lang=en` fuerza inglés, `?lang=es` fuerza español.

## Antes de publicar

Estos son los únicos puntos que dependen de datos reales de la agencia:

1. **Logotipo.** `assets/img/isotype.svg` es una reconstrucción vectorial del isotipo hecha a
   partir de la imagen que compartiste. Si tienes el SVG original, reemplaza ese archivo
   (mismo `viewBox` o ajusta el que traiga) y el mismo path dentro de `index.html`
   (aparece en el header, el footer, el preloader y el favicon).
2. **Nombre.** En todo el sitio se escribe `alphamitz`, tal como se lee en el logotipo
   adjunto. Si la grafía correcta es otra, búscala y cámbiala: aparece en `index.html`
   (marca, `<title>`, JSON-LD), `llms.txt` y `README.md`.
3. **Contacto.** Sustituye `hola@alphamitz.com`, el número de WhatsApp `wa.me/000000000000`
   y el enlace de LinkedIn. Están en el header, el laboratorio, el CTA final y el footer.
4. **Dominio.** Cambia `https://alphamitz.com/` por el dominio real en `index.html`
   (canonical, Open Graph, hreflang y JSON-LD), `sitemap.xml`, `robots.txt` y `llms.txt`.
5. **Portada social.** `assets/img/og-cover.png` (1200×630) ya está generada; reemplázala si
   cambia el mensaje principal.

## Cómo está construido

**Escena 3D.** `assets/js/scene.js` mantiene una sola nube de puntos (los nodos), una malla de
líneas (las conexiones), una segunda nube (los datos en tránsito) y cinco sólidos de vidrio
(los agentes). Cada nodo pertenece a un área de negocio y tiene cuatro posiciones objetivo:
fragmentado, conectado, agentes en operación y sistema coordinado. El scroll interpola entre
esas cuatro geometrías reales, no hace fundidos entre imágenes. La topología se recalcula sola
cada pocos segundos, así que la red nunca se ve igual dos veces.

**Enfoque por función.** Al pasar el cursor por una función de negocio, un servicio, un
resultado o un agente, los nodos de esa área se reorganizan al frente, sus enlaces se
iluminan y el resto de la red retrocede.

**Tema.** Cada sección declara `data-scene-theme` (oscuro o marfil), `data-scene-phase`
(momento de la narrativa) y `data-scene-presence` (cuánto protagonismo tiene la escena ahí).
El fondo de la página y los colores de la red cambian juntos, y en las secciones con más texto
la red se retira para que el contenido siempre gane en contraste.

**Diagnóstico.** El campo del laboratorio corre en el navegador: compara el texto con ocho
grupos de palabras clave y devuelve un conjunto de soluciones (agentes, automatizaciones,
conocimiento, integraciones, analítica). No hay backend ni se envía nada a ningún servidor.

**Rendimiento.** Tres llamadas de dibujo para toda la red. La densidad de nodos, el número de
partículas y el `devicePixelRatio` se ajustan al ancho de pantalla, y si el promedio de frame
se degrada el propio renderer baja resolución. El único cálculo pesado, el de vecinos
cercanos, está limitado a unas pocas veces por segundo.

**Si no hay WebGL** (o el navegador lo bloquea, o hay ahorro de datos activado), la página
muestra una constelación estática en SVG y todo lo demás sigue funcionando. Con
`prefers-reduced-motion` la narrativa deja de ser un scroll fijo y se lee como un documento
normal.

**Para modelos de lenguaje.** Todo el contenido está en el HTML (nada se carga por JS),
con `Organization`, `ProfessionalService`, `OfferCatalog` y `FAQPage` en JSON-LD, además de
`llms.txt`. Es el mismo trabajo que el sitio vende como servicio.

## Accesibilidad

Navegación completa por teclado (las pestañas de funciones responden a flechas), foco visible,
`prefers-reduced-motion` y `prefers-contrast` respetados, enlace para saltar al contenido,
textos alternativos y roles ARIA en los componentes interactivos.
