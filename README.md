# Alphamilz · sitio web

Sitio de una sola página para **Alphamilz**, agencia de inteligencia artificial aplicada a
negocios. Español por defecto, inglés con un clic. Sin framework y sin build step: son
archivos estáticos que se publican en cualquier hosting.

```
index.html              página completa (ES en el markup, EN vía JS)
llms.txt                descripción del negocio para agentes y modelos de lenguaje
robots.txt              rastreadores de buscadores y de LLM permitidos
sitemap.xml             una URL con hreflang es/en
assets/
  css/main.css          sistema visual completo
  js/i18n.js            todo el copy en ES y EN
  js/main.js            scroll, idioma, menú, pills, WhatsApp y popup
  js/scene.js           escena 3D: el isotipo extruido girando con el scroll
  fonts/                Source Code Pro y Outfit (subset latin, variables)
  img/                  isotipo, favicon y portada social
  vendor/               three.js r169
```

## Cómo verlo en local

```bash
npx http-server -p 8080 -c-1 .
```

Abre `http://localhost:8080`. `?lang=en` fuerza inglés, `?lang=es` fuerza español.

## Marca

Todo sale del toolkit:

| Uso | Valor |
|---|---|
| Fondo | `#0B0D13` sobre la base de marca `#1A1F2D` |
| Acento principal | Lima `#A6F700` |
| Acento secundario | Violeta `#5200FF` |
| Apoyos | Púrpura `#8645F9`, azul `#6CB7FF` |
| Tipografía de sistema | Source Code Pro (títulos, etiquetas, botones) |
| Tipografía de marca | Outfit (logotipo y párrafos) |
| Motivos | Corchetes `[ ]`, pills, patrón de puntos |

## La escena 3D

`assets/js/scene.js` extruye el isotipo desde su propio path vectorial y lo renderiza con
material cromado e iridiscencia, sobre un entorno de reflejos generado en canvas con los
colores de la marca. Gira con el scroll (dos vueltas completas de arriba a abajo), cambia de
color y de posición en cada sección, y lo acompañan pequeños objetos de vidrio.

Cada sección declara su comportamiento en el HTML:

```html
<section data-accent="#5200FF" data-x="-4.6" data-y="0.2" data-scale="0.5" data-dim="0.42">
```

- `data-accent`: color de la sección (tiñe el isotipo, el halo y los detalles de la interfaz).
- `data-x` / `data-y`: dónde se coloca el isotipo, en unidades de la escena.
- `data-scale`: qué tan grande se ve.
- `data-dim`: cuánto protagonismo cede para que el texto gane contraste.

En móvil el isotipo pasa automáticamente a ser fondo: más chico, centrado y atenuado. Si el
navegador no tiene WebGL, se muestra el isotipo en SVG con un brillo suave y todo lo demás
sigue funcionando. Con `prefers-reduced-motion` se detienen los giros.

## WhatsApp

Un único número, `+52 81 8287 0885`, en `assets/js/main.js` (`WA_NUMBER`). Todos los enlaces
marcados con `data-wa` se arman solos con el mensaje correcto según el idioma y, en la sección
"Hacemos lo que necesitas", según el servicio elegido.

- Botón flotante, visible después del primer scroll.
- Popup de auditoría gratis a los 20 segundos, una vez por sesión. Se cierra con Escape,
  clic afuera o "Ahora no", y no vuelve a aparecer si la persona ya se fue a WhatsApp.

## Antes de publicar

1. **Logotipo.** `assets/img/isotype.svg` es una reconstrucción vectorial del isotipo hecha a
   partir del toolkit. Si tienes el SVG original, reemplaza ese archivo y los paths inline de
   `index.html` (header, footer, preloader y la escena 3D en `scene.js`).
2. **Logos de clientes.** OXXO, Del Sol, Buffalo Wild Wings y 7-Eleven aparecen como nombres
   tipográficos. Si tienes autorización para usar sus logotipos, mándalos en SVG y los
   cambiamos en la lista `.logos` de `index.html`.
3. **Dominio.** Está puesto `https://alphamilz.com/` en canonical, Open Graph, hreflang,
   JSON-LD, `sitemap.xml`, `robots.txt` y `llms.txt`.
4. **Redes.** Si quieres LinkedIn o Instagram en el footer, hay lugar en la columna de contacto.

## Accesibilidad

Navegación por teclado completa, foco visible, popup con foco atrapado y cierre con Escape,
`prefers-reduced-motion` respetado, enlace para saltar al contenido y roles ARIA en el diálogo
y los controles.
