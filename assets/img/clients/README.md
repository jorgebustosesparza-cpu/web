# Logotipos de clientes

Aquí van los archivos de los clientes que aparecen en la sección "Clientes".
El sitio los busca con estos nombres exactos:

- `femsa.svg`
- `oxxo.svg`
- `uber-eats.svg`
- `coca-cola.svg`

Si falta alguno, el sitio muestra el nombre de la marca en texto, así que nunca
se rompe la sección.

## Cómo se ven

Cada `<img>` en `index.html` lleva un atributo `data-treat`:

- `data-treat="mono"` pinta el logotipo en blanco (útil para logotipos de un solo
  color sobre fondo transparente: FEMSA, Uber Eats, Coca-Cola).
- Sin ese atributo, el logotipo se muestra con sus colores originales (útil para
  OXXO, cuyo logotipo es una placa de color).

Formato recomendado: SVG con fondo transparente. PNG también funciona, de al menos
200 px de alto.

Nota legal: estos son logotipos registrados de sus dueños. Úsalos solo con la
autorización de cada marca para mostrarlos como cliente.
