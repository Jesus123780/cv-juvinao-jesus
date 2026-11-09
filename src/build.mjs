import fs from 'node:fs/promises';
import path from 'node:path';
import { profile, resume } from './resume-data-.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = path.join(root, 'site');
const css = await fs.readFile(path.join(import.meta.dirname, 'styles.css'), 'utf8');

function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function link(url, label = url) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
}

function renderContact() {
  return [
    escapeHtml(profile.location), escapeHtml(profile.phone),
    link(`mailto:${profile.email}`, profile.email), link(profile.linkedin, 'linkedin.com/in/jesus-david-juvinao-perez-8a9352174'),
    link(profile.github, 'github.com/Jesus123780'), link(profile.portfolio, 'juvinaodev.netlify.app')
  ].join(' <span class="sep">|</span> ');
}

function renderExperience(items) {
  const renderItem = item => `
    <article class="experience-item">
      <h3>${escapeHtml(item.role)}</h3>
      <p class="company"><strong>${escapeHtml(item.company)}</strong> <span class="sep">|</span> ${escapeHtml(item.place)}</p>
      <p class="dates">${escapeHtml(item.dates)}</p>
      <ul>${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
    </article>`;
  const first = items.slice(0, 1).map(renderItem).join('');
  const remaining = items.slice(1).map(renderItem).join('');
  if (!remaining) return first;
  return `${first}<div class="experience-continuation"><p class="continuation-header"><strong>${escapeHtml(profile.name)}</strong> <span class="sep">|</span> ${escapeHtml(items[0].role)}</p>${remaining}</div>`;
}

function renderSkills(items) {
  return items.map(([label, value]) => `<p class="skill-line"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join('');
}

function renderEducation(items) {
  return items.map(item => `
    <article class="education-item">
      <p><strong>${escapeHtml(item.institution)}</strong> <span class="sep">|</span> ${escapeHtml(item.program)}</p>
      <p class="dates">${escapeHtml(item.dates)}</p>
    </article>`).join('');
}

function renderResume(lang, data, { standalone = false } = {}) {
  const alternate = lang === 'es' ? 'en' : 'es';
  const alternateLabel = lang === 'es' ? 'English version' : 'Versión en español';
  const canonical = `https://juvinaodev.netlify.app/cv/${lang}/`;
  const altCanonical = `https://juvinaodev.netlify.app/cv/${alternate}/`;
  const pdfName = lang === 'es' ? 'CV_Jesus_David_Juvinao_ES.pdf' : 'CV_Jesus_David_Juvinao_EN.pdf';
  const style = standalone ? `<style>${css}</style>` : '<link rel="stylesheet" href="../../assets/cv.css">';
  const schema = {
    '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
    jobTitle: data.role.replaceAll('|', '·'), description: data.description,
    email: profile.email, telephone: profile.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressRegion: 'Cundinamarca', addressCountry: 'CO' },
    url: 'https://juvinaodev.netlify.app/', sameAs: [profile.github, profile.linkedin],
    knowsAbout: ['Software Engineering', 'Full Stack Development', 'Backend Development', 'Go', 'Golang', 'Node.js', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'AWS', 'Microservices', 'Fintech', 'Digital Payments', 'REST APIs', 'GraphQL', 'Docker', 'CI/CD', 'Generative AI', 'AI-assisted Software Development']
  };
  return `<!doctype html>
<html lang="${data.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}">
  <meta name="author" content="${escapeHtml(profile.name)}"><meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}"><link rel="alternate" hreflang="${alternate}" href="${altCanonical}">
  <link rel="alternate" hreflang="x-default" href="https://juvinaodev.netlify.app/cv/es/">
  ${style}
  <meta property="og:type" content="profile"><meta property="og:title" content="${escapeHtml(data.title)}">
  <meta property="og:description" content="${escapeHtml(data.description)}"><meta property="og:url" content="${canonical}">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <nav class="language-nav" aria-label="Language"><a href="../${alternate}/">${alternateLabel}</a><a class="download" href="../../assets/${pdfName}" download>${lang === 'es' ? 'Descargar PDF' : 'Download PDF'}</a></nav>
  <main class="resume">
    <header class="resume-header"><p class="eyebrow">${escapeHtml(data.role)}</p><h1>${escapeHtml(profile.name)}</h1>
      <p class="specialty">${escapeHtml(data.specialty)}</p><p class="contact">${renderContact()}</p>
    </header>
    <section><h2>${escapeHtml(data.sections.summary)}</h2><p class="summary">${escapeHtml(data.summary)}</p></section>
    <section><h2>${escapeHtml(data.sections.strengths)}</h2><div class="skills">${renderSkills(data.strengths)}</div></section>
    <section><h2>${escapeHtml(data.sections.experience)}</h2>${renderExperience(data.experience)}</section>
    <section><h2>${escapeHtml(data.sections.education)}</h2>${renderEducation(data.education)}</section>
    <section><h2>${escapeHtml(data.sections.languages)}</h2><p>${escapeHtml(data.languages)}</p></section>
    <footer>${escapeHtml(data.footer)}</footer>
  </main>
</body></html>`;
}

async function main() {
  await fs.mkdir(dist, { recursive: true });
  await fs.mkdir(path.join(site, 'assets'), { recursive: true });
  for (const lang of ['es', 'en']) {
    const html = renderResume(lang, resume[lang], { standalone: true });
    const htmlPath = path.join(dist, `CV_Jesus_David_Juvinao_${lang.toUpperCase()}.html`);
    await fs.writeFile(htmlPath, html, 'utf8');
    const siteHtml = renderResume(lang, resume[lang]);
    await fs.mkdir(path.join(site, 'cv', lang), { recursive: true });
    await fs.writeFile(path.join(site, 'cv', lang, 'index.html'), siteHtml, 'utf8');
  }
  await fs.copyFile(path.join(import.meta.dirname, 'styles.css'), path.join(site, 'assets', 'cv.css'));
  await fs.writeFile(path.join(site, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n  <url><loc>https://juvinaodev.netlify.app/cv/es/</loc><xhtml:link rel="alternate" hreflang="es" href="https://juvinaodev.netlify.app/cv/es/"/><xhtml:link rel="alternate" hreflang="en" href="https://juvinaodev.netlify.app/cv/en/"/></url>\n  <url><loc>https://juvinaodev.netlify.app/cv/en/</loc><xhtml:link rel="alternate" hreflang="es" href="https://juvinaodev.netlify.app/cv/es/"/><xhtml:link rel="alternate" hreflang="en" href="https://juvinaodev.netlify.app/cv/en/"/></url>\n</urlset>\n`, 'utf8');
  await fs.writeFile(path.join(site, 'robots.txt'), 'User-agent: *\nAllow: /cv/\nSitemap: https://juvinaodev.netlify.app/sitemap.xml\n', 'utf8');
  if (process.argv.includes('--html-only')) {
    console.log('HTML y páginas SEO generadas. Se omitió la exportación PDF (--html-only).');
    return;
  }
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of ['es', 'en']) {
      const htmlPath = path.join(dist, `CV_Jesus_David_Juvinao_${lang.toUpperCase()}.html`);
      const pdfPath = path.join(dist, `CV_Jesus_David_Juvinao_${lang.toUpperCase()}.pdf`);
      const page = await browser.newPage({ viewport: { width: 1280, height: 1800 }, deviceScaleFactor: 1 });
      await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
      await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
      await page.close();
      await fs.copyFile(pdfPath, path.join(site, 'assets', path.basename(pdfPath)));
      console.log(`Generado: ${pdfPath}`);
    }
  } finally {
    await browser.close();
  }
  console.log('Páginas SEO generadas en site/cv/es y site/cv/en.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
