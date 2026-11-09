# CV profesional - Jesús David Juvinao Pérez

Proyecto Node.js con Playwright para generar dos hojas de vida ATS-friendly (PDF y HTML) y dos páginas web semánticas en español e inglés.

## Requisitos

- Node.js 20.11 o superior.
- Playwright y su navegador Chromium (se instalan en los pasos siguientes).

## Generar los PDF y las páginas web

```bash
npm install
npx playwright install chromium
npm run build
```

Los PDF y HTML imprimibles quedan en `dist/`. Las páginas web bilingües quedan en `site/cv/es/` y `site/cv/en/`, con CSS, PDF descargables, `sitemap.xml` y `robots.txt` en `site/`.

## Personalizar

Edita `src/resume-data.mjs`:

- Cambia datos de contacto en `profile`.
- Ajusta resumen, competencias, experiencia, educación e idiomas en `resume.es` y `resume.en`.
- Ejecuta `npm run build` para regenerar todos los formatos.

## Publicar la versión web en Netlify

Copia el contenido de `site/` a la carpeta pública de tu portafolio (o adapta la ruta de publicación). Las URL previstas son:

- `https://juvinaodev.netlify.app/cv/es/`
- `https://juvinaodev.netlify.app/cv/en/`

Después de publicar, verifica que esas rutas estén disponibles y que el `sitemap.xml` publicado sea el del proyecto. Si tu sitio ya tiene un sitemap, integra estas dos URL en el existente en vez de sobrescribirlo.

## Decisiones de contenido

- Se prioriza una estructura de una sola columna, texto seleccionable, encabezados convencionales y enlaces visibles para mejorar la lectura humana y el parseo ATS.
- No se incluyen foto, cédula ni referencias personales.
- Las palabras clave aparecen dentro de competencias y responsabilidades, sin texto oculto ni acumulación artificial.
- No se inventan métricas de impacto, volúmenes transaccionales ni porcentajes.
- El usuario declara 7+ años de experiencia, pero las fechas compartidas (junio de 2021–enero de 2022, abril de 2022–octubre de 2023 y abril de 2024–noviembre de 2026) representan aproximadamente 4 años y 8 meses de tiempo transcurrido. Para evitar una inconsistencia visible, el resumen no declara una cifra de años. Antes de enviar el CV como perfil de 7+ años, confirmar la fecha real de ingreso a Wompi y añadir la experiencia o los periodos faltantes anteriores a junio de 2021.
- El nombre del proyecto/empleador de junio de 2021 a enero de 2022 no fue suministrado; se describe por sector y tipo de proyecto, sin inventar una empresa.
- La formación se mantiene como “Ingeniería – área de software y robótica”; confirmar si se obtuvo el título y el nombre oficial del programa antes de convertirlo en “Ingeniero”/“Bachelor's degree” como credencial académica.

## Nota sobre ATS y SEO

El PDF está pensado para candidaturas y sistemas ATS. Las páginas HTML semánticas, sus metadatos, enlaces a perfiles, hreflang y datos estructurados `Person` están pensados para descubrimiento orgánico cuando se publiquen en el portafolio. No se garantiza posicionamiento: la indexación depende del rastreo, la competencia y la calidad del sitio. Adapta además el CV a cada descripción de vacante.
