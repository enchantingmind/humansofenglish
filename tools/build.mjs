// Zero-dependency static site builder for Humans of English.
//
//   node tools/build.mjs
//
// Reads page bodies from _src/pages, wraps them in the shared layout (head,
// header, footer) and writes plain HTML into the repository root, where
// GitHub Pages serves it. Also writes sitemap.xml and assets/js/config.js.
//
// Page files start with a meta comment:
//   <!--meta {"title": "...", "description": "..."} -->
// Placeholders available in page bodies:
//   {{icon:name}}  {{icon:name:extra-class}}   inline Lucide icon
//   {{include:name}}                           _src/partials/name.html
//   {{resource-cards}}  {{resource-cards:3}}   cards from _src/data.mjs
//   {{resources:slug-a,slug-b}}                specific resource cards
//   {{case-cards}}                             example learning journey cards
//   {{category-filters}}                       resource filter buttons
//   {{contact-links}}                          email + Instagram links (from site settings)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, nav, categories, resources, caseStudies, courses, categoryLabel } from "../_src/data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "_src");
const PAGES = path.join(SRC, "pages");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- icons ----------
const iconCache = new Map();
function icon(name, extra = "") {
  if (!iconCache.has(name)) {
    const file = path.join(SRC, "icons", name + ".svg");
    if (!fs.existsSync(file)) throw new Error("Missing icon: " + name);
    const raw = fs.readFileSync(file, "utf8");
    const inner = raw.slice(raw.indexOf(">", raw.indexOf("<svg")) + 1, raw.lastIndexOf("</svg>"));
    iconCache.set(name, inner.replace(/\s*\n\s*/g, ""));
  }
  const cls = ("icon " + extra).trim();
  return `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconCache.get(name)}</svg>`;
}

// ---------- shared components ----------
const brandMark = `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M8 4h24a6 6 0 0 1 6 6v15a6 6 0 0 1-6 6H19l-8 6v-6H8a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6Z" fill="#0756A5"/><path d="M12 12v12M12 18h7M19 12v12M24 12h6M24 12v12h6M24 18h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="33" cy="7" r="4" fill="#F4B942"/></svg>`;

function resourceCard(r, headingLevel = 3) {
  const h = "h" + headingLevel;
  const search = [r.title, r.description, categoryLabel(r.category), ...r.tags].join(" ").toLowerCase();
  return `<article class="resource-card" data-category="${r.category}" data-search="${esc(search)}">
  <p class="card-category">${esc(categoryLabel(r.category))}</p>
  <${h} class="card-title"><a class="stretched-link" href="/learning-resources/${r.slug}/">${esc(r.title)}</a></${h}>
  <p class="card-text">${esc(r.description)}</p>
  <p class="card-meta">${icon("clock")}<span>${r.minutes} min read</span><span aria-hidden="true">·</span><span>${esc(r.level)}</span></p>
</article>`;
}

function resourceCards(limit, exclude) {
  const list = resources.filter((r) => r.slug !== exclude).slice(0, limit || resources.length);
  return `<div class="resource-grid">${list.map((r) => resourceCard(r)).join("\n")}</div>`;
}

const caseColours = ["c-coral", "c-teal", "c-violet", "c-sky", "c-pink", "c-sun"];

function caseCard(c) {
  const colour = caseColours[caseStudies.indexOf(c) % caseColours.length];
  return `<article class="case-card ${colour}">
  <div class="case-card-top"><span class="chip">Example journey</span><span class="case-weeks">${c.weeks}-week plan</span></div>
  <span class="icon-tile">${icon(c.icon)}</span>
  <p class="case-learner">${esc(c.learner)}</p>
  <h3 class="card-title"><a class="stretched-link" href="/case-studies/${c.slug}/">${esc(c.title)}</a></h3>
  <p class="card-text">${esc(c.summary)}</p>
  <ul class="tag-list" aria-label="Focus areas">${c.focus.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
  <span class="text-link" aria-hidden="true">Read the plan ${icon("arrow-right")}</span>
</article>`;
}

const caseCards = (exclude) =>
  `<div class="case-grid">${caseStudies.filter((c) => c.slug !== exclude).map(caseCard).join("\n")}</div>`;

// ---------- courses ----------
const priceHtml = () => `From <strong>${esc(site.priceFrom)}</strong><span>/ ${esc(site.pricePeriod)}</span>`;
const modeChips = () =>
  `<ul class="mode-chips" aria-label="How you can learn"><li>${icon("map-pin")}In person</li><li>${icon("video")}Online (video call)</li></ul>`;

function courseCard(c, headingLevel = 3) {
  const h = "h" + headingLevel;
  return `<article class="course-card ${c.colour}">
  <div class="course-card-top"><span class="icon-tile">${icon(c.icon)}</span><p class="price-tag">${priceHtml()}</p></div>
  <${h} class="card-title"><a class="stretched-link" href="/courses/${c.slug}/">${esc(c.title)}</a></${h}>
  <p class="card-text">${esc(c.short)}</p>
  <ul class="course-meta"><li>${icon("calendar-days")}${esc(c.duration)}</li><li>${icon("target")}${esc(c.level)}</li></ul>
  ${modeChips()}
  <span class="text-link" aria-hidden="true">View course &amp; study plan ${icon("arrow-right")}</span>
</article>`;
}

const courseHelpCard = () => `<aside class="course-card course-help c-sun" aria-label="Help choosing a course">
  <span class="icon-tile">${icon("compass")}</span>
  <h3 class="card-title">Not sure which course is right?</h3>
  <p class="card-text">Tell us your goal and we'll suggest a course and a study plan. Or try our quick level self-check first.</p>
  <div class="btn-row"><a class="btn btn-primary" href="/contact/">Ask us ${icon("arrow-right")}</a><a class="btn btn-secondary" href="/#level">Level self-check</a></div>
</aside>`;

// Full list (5 courses + help card fills a 3×2 grid); on a course page, the other four in one row.
const courseCards = (exclude) => {
  const list = courses.filter((c) => c.slug !== exclude).map((c) => courseCard(c));
  return exclude
    ? `<div class="course-grid course-grid-row">${list.join("\n")}</div>`
    : `<div class="course-grid">${list.join("\n")}\n${courseHelpCard()}</div>`;
};

function courseLayout(meta, body) {
  const c = courses.find((x) => x.slug === meta.slug);
  if (!c) throw new Error("Unknown course slug: " + meta.slug);
  const enquire = `/contact/?course=${c.slug}#contact-form-heading`;
  const list = (items) => `<ul class="check-list">${items.map((t) => `<li>${icon("check")}<span>${esc(t)}</span></li>`).join("")}</ul>`;
  const includeIcons = ["users", "clipboard-check", "book-marked", "file-check"];
  return `<main id="main">
<header class="page-hero course-hero ${c.colour}">
  <div class="container course-hero-grid">
    <div>
      ${breadcrumb([["/", "Home"], ["/courses/", "Courses"], ["", c.title]])}
      <p class="eyebrow">Course</p>
      <h1>${esc(c.title)}</h1>
      <p class="lede">${esc(c.short)}</p>
      <ul class="course-meta course-meta-lg"><li>${icon("calendar-days")}${esc(c.duration)}</li><li>${icon("target")}${esc(c.level)}</li></ul>
    </div>
    <aside class="price-card" aria-label="Fees and format">
      <p class="price-card-label">Course fees</p>
      <p class="price-card-amount">${priceHtml()}</p>
      ${modeChips()}
      <a class="btn btn-primary btn-lg btn-block" href="${enquire}">Enquire about this course ${icon("arrow-right")}</a>
      <p class="price-card-note">Your exact fee depends on the plan you choose, and we confirm it with you before you start.</p>
    </aside>
  </div>
</header>

<section class="section ${c.colour}" aria-labelledby="fit-heading">
  <div class="container split">
    <div class="split-head">
      <p class="eyebrow">Is it for you?</p>
      <h2 id="fit-heading">Who this course is for</h2>
      ${list(c.forWho)}
    </div>
    <div class="info-card outcome-card">
      <h3>${icon("sparkles")}What you'll be able to do</h3>
      ${list(c.outcomes)}
    </div>
  </div>
</section>

<section class="section section-cream has-doodles ${c.colour}" aria-labelledby="plan-heading">
  ${doodle("spiral", "corner-doodle corner-spiral")}
  <div class="container container-narrow">
    <p class="eyebrow">Study plan</p>
    <h2 id="plan-heading">Your ${scribble("study plan", "")}</h2>
    <p class="section-intro">A typical plan for this course. We adjust the pace and focus to your level, your goal and your schedule.</p>
    <ol class="study-plan">
      ${c.plan.map((p, i) => `<li><span class="study-step" aria-hidden="true">${i + 1}</span><div><p class="study-when">${esc(p.when)}</p><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join("\n      ")}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="format-heading">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">How you learn</p>
      <h2 id="format-heading">In person or online, your choice</h2>
      <p class="section-intro">The same course, the same study plan and the same personal feedback, whichever format suits you.</p>
    </div>
    <div class="info-grid">
      <div class="info-card c-coral">
        <h3>${icon("map-pin")}In person</h3>
        <p>Face-to-face sessions for learners who like to practise in the room, with real-time conversation and feedback.</p>
      </div>
      <div class="info-card c-sky">
        <h3>${icon("video")}Online, over a video call</h3>
        <p>Live sessions from wherever you are. All you need is a stable internet connection and a device with a microphone.</p>
      </div>
    </div>
    <h3 class="includes-heading">What's included</h3>
    <ul class="includes-grid">
      ${c.includes.map((t, i) => `<li>${icon(includeIcons[i % includeIcons.length])}<span>${esc(t)}</span></li>`).join("\n      ")}
    </ul>
  </div>
</section>
${body.trim() ? expand(body, { slug: c.slug }) : ""}
<section class="section section-surface" aria-labelledby="course-resources-heading">
  <div class="container">
    <div class="section-head section-head-row">
      <h2 id="course-resources-heading">Start with these free guides</h2>
      <a class="text-link" href="/learning-resources/">All resources ${icon("arrow-right")}</a>
    </div>
    ${expand(`{{resources:${c.resources.join(",")}}}`)}
  </div>
</section>

<section class="section" aria-labelledby="other-courses-heading">
  <div class="container">
    <div class="section-head section-head-row">
      <h2 id="other-courses-heading">Other courses</h2>
      <a class="text-link" href="/courses/">All courses ${icon("arrow-right")}</a>
    </div>
    ${courseCards(c.slug)}
  </div>
</section>
${ctaBand()}
</main>`;
}

function courseJsonLd(c, route) {
  const price = String(site.priceFrom).replace(/[^\d.]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.short,
    url: site.url + route,
    provider: { "@type": "EducationalOrganization", name: site.name, url: site.url },
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "INR", unitText: "MONTH", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } },
    },
    hasCourseInstance: [
      { "@type": "CourseInstance", courseMode: "Onsite" },
      { "@type": "CourseInstance", courseMode: "Online" },
    ],
  };
}

function categoryFilters() {
  const btn = (id, label, pressed) =>
    `<button type="button" class="filter-btn" data-filter="${id}" aria-pressed="${pressed}">${esc(label)}</button>`;
  return `<div class="filter-group" role="group" aria-label="Filter by category">${btn("all", "All", true)}${categories
    .map((c) => btn(c.id, c.label, false))
    .join("")}</div>`;
}

function expand(html, ctx = {}) {
  return html
    .replace(/\{\{include:([\w-]+)\}\}/g, (_, n) => expand(fs.readFileSync(path.join(SRC, "partials", n + ".html"), "utf8"), ctx))
    .replace(/\{\{icon:([\w-]+)(?::([\w -]+))?\}\}/g, (_, n, c) => icon(n, c || ""))
    .replace(/\{\{resource-cards(?::(\d+))?\}\}/g, (_, n) => resourceCards(n ? +n : 0, ctx.slug))
    .replace(/\{\{resources:([\w,-]+)\}\}/g, (_, list) => {
      const picked = list.split(",").map((s) => {
        const r = resources.find((x) => x.slug === s);
        if (!r) throw new Error("Unknown resource slug: " + s);
        return resourceCard(r);
      });
      return `<div class="resource-grid">${picked.join("\n")}</div>`;
    })
    .replace(/\{\{case-cards\}\}/g, () => caseCards(ctx.slug))
    .replace(/\{\{course-cards\}\}/g, () => courseCards(ctx.slug))
    .replace(/\{\{price-from\}\}/g, () => esc(site.priceFrom))
    .replace(/\{\{category-filters\}\}/g, categoryFilters)
    .replace(/\{\{contact-links(?::([\w -]+))?\}\}/g, (_, c) => contactLinks(c ? "contact-links " + c : undefined))
    .replace(/\{\{doodle:([\w-]+)(?::([\w -]+))?\}\}/g, (_, n, c) => doodle(n, c || ""))
    .replace(/<span class="scribble([^"]*)">([^<]+)<\/span>/g, (_, cls, text) => scribble(text, cls));
}

// ---------- hand-drawn decorations ----------
// Doodles live in _src/doodles/*.svg. Paths with class="draw" (and pathLength="1")
// animate as if drawn by hand when they scroll into view (see site.js / style.css).
function doodle(name, extra) {
  const file = path.join(SRC, "doodles", name + ".svg");
  if (!fs.existsSync(file)) throw new Error("Missing doodle: " + name);
  const cls = `doodle doodle-${name} ${extra}`.trim();
  const svg = fs.readFileSync(file, "utf8").trim();
  return svg.replace("<svg", `<svg class="${cls}" data-draw aria-hidden="true" focusable="false"`);
}

// <span class="scribble c-coral">words</span> → words with a drawn underline beneath.
function scribble(text, cls) {
  return `<span class="scribble${cls}" data-draw>${text}<svg class="scribble-line" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="draw" pathLength="1" d="M4 15C45 7 95 5 140 9s46 6 56-1"/><path class="draw draw-late" pathLength="1" d="M20 20c50-6 110-7 166-4"/></svg></span>`;
}

// Email and Instagram links from site settings; each one is omitted while empty.
const instagramUrl = () => `https://www.instagram.com/${site.instagram}/`;
function contactLinks(cls = "contact-links") {
  const items = [];
  if (site.contactEmail) {
    items.push(`<li>${icon("mail")}<a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></li>`);
  }
  if (site.instagram) {
    items.push(`<li>${icon("instagram")}<a href="${instagramUrl()}" rel="noopener">DM us on Instagram <span class="handle">@${esc(site.instagram)}</span></a></li>`);
  }
  return items.length ? `<ul class="${cls}">${items.join("")}</ul>` : "";
}

// ---------- layout ----------
function isCurrent(href, route) {
  return href === "/" ? route === "/" : route.startsWith(href);
}

function header(route) {
  const links = nav
    .map((n) => `<li><a href="${n.href}"${isCurrent(n.href, route) ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`)
    .join("");
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">${brandMark}<span class="brand-name">Humans <span>of</span> English</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-open">${icon("menu")}</span><span class="nav-toggle-close">${icon("x")}</span>
      <span class="sr-only">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">${links}</ul>
      <a class="btn btn-primary btn-sm nav-cta" href="/contact/">Get Started</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  const col = (title, items) =>
    `<div class="footer-col"><h2 class="footer-heading">${title}</h2><ul>${items
      .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`)
      .join("")}</ul></div>`;
  const contact = contactLinks("footer-contact");
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand brand-invert" href="/">${brandMark}<span class="brand-name">Humans <span>of</span> English</span></a>
      <p class="footer-tagline">${esc(site.tagline)}</p>
      <p class="footer-mission">We help learners communicate clearly, prepare for the opportunities that matter to them, and build confidence through practical English education.</p>
      ${contact}
    </div>
    ${col("Learn", [
      ["/courses/", "Courses & Fees"],
      ["/exam-preparation/", "Exam Preparation"],
      ["/exam-preparation/#ielts", "IELTS Preparation"],
      ["/exam-preparation/#toefl", "TOEFL Preparation"],
      ["/communication-skills/", "Communication Skills"],
      ["/case-studies/", "Case Studies"],
    ])}
    ${col("Resources", [
      ["/learning-resources/", "All learning resources"],
      ...resources.slice(0, 4).map((r) => [`/learning-resources/${r.slug}/`, r.title]),
    ])}
    ${col("Humans of English", [
      ["/about/", "About Us"],
      ["/about/mansi-singh/", "Our Founder"],
      ["/contact/", "Contact"],
      ["/privacy-policy/", "Privacy Policy"],
    ])}
  </div>
  <div class="container footer-bottom">
    <div class="footer-credits">
      <p>&copy; <span data-year>2026</span> Humans of English. All rights reserved.</p>
      <p class="made-by">Made with ${icon("heart", "heart")}<span class="sr-only">love</span> by <a href="https://tavzuran.com/" rel="noopener">Tavzuran</a></p>
    </div>
    <a class="back-to-top" href="#top">${icon("arrow-up")}Back to top</a>
  </div>
</footer>`;
}

function head({ title, description, route, type = "website", jsonLd }) {
  const canonical = site.url + (route === "/404" ? "/" : route);
  const fullTitle = route === "/" ? title : `${title} | ${site.name}`;
  const ld = jsonLd ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "";
  return `<!doctype html>
<html lang="en" id="top">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  ${route === "/404" ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  <meta name="theme-color" content="#0756A5">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.url}${site.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css">
  <script>
    (function () {
      var h = location.hostname;
      if (location.protocol === "http:" && h !== "localhost" && h !== "127.0.0.1") {
        location.replace("https://" + location.host + location.pathname + location.search + location.hash);
      }
      document.documentElement.className += " js";
    })();
  </script>
  <script src="/assets/js/config.js" defer></script>
  <script src="/assets/js/site.js" defer></script>${ld}
</head>`;
}

function breadcrumb(items) {
  const parts = items.map(([href, label], i) =>
    i === items.length - 1
      ? `<li><span aria-current="page">${esc(label)}</span></li>`
      : `<li><a href="${href}">${esc(label)}</a></li>`
  );
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${parts.join("")}</ol></nav>`;
}

const ctaBand = () => expand("{{include:cta-band}}");

function articleLayout(meta, body) {
  const r = resources.find((x) => x.slug === meta.slug);
  if (!r) throw new Error("Unknown resource slug: " + meta.slug);
  return `<main id="main">
<article>
  <header class="page-hero page-hero-article">
    <div class="container container-narrow">
      ${breadcrumb([["/", "Home"], ["/learning-resources/", "Learning Resources"], ["", r.title]])}
      <p class="card-category">${esc(categoryLabel(r.category))}</p>
      <h1>${esc(r.title)}</h1>
      <p class="lede">${esc(r.description)}</p>
      <p class="card-meta">${icon("clock")}<span>${r.minutes} min read</span><span aria-hidden="true">·</span><span>${esc(r.level)}</span><span aria-hidden="true">·</span><span>Humans of English team</span></p>
    </div>
  </header>
  <div class="container container-narrow prose">
${expand(body, { slug: r.slug })}
  </div>
</article>
<section class="section section-surface" aria-labelledby="related-heading">
  <div class="container">
    <div class="section-head section-head-row">
      <h2 id="related-heading">Keep learning</h2>
      <a class="text-link" href="/learning-resources/">All resources ${icon("arrow-right")}</a>
    </div>
    ${resourceCards(3, r.slug)}
  </div>
</section>
${ctaBand()}
</main>`;
}

function caseLayout(meta, body) {
  const c = caseStudies.find((x) => x.slug === meta.slug);
  if (!c) throw new Error("Unknown case study slug: " + meta.slug);
  return `<main id="main">
<article>
  <header class="page-hero">
    <div class="container">
      ${breadcrumb([["/", "Home"], ["/case-studies/", "Case Studies"], ["", c.title]])}
      <p class="eyebrow">Example learning journey · ${esc(c.learner)}</p>
      <h1>${esc(c.title)}</h1>
      <p class="lede">${esc(c.summary)}</p>
      <ul class="tag-list" aria-label="Focus areas">${c.focus.map((f) => `<li>${esc(f)}</li>`).join("")}<li>${c.weeks}-week plan</li></ul>
    </div>
  </header>
  <div class="container case-body">
    <div class="notice" role="note">${icon("info")}<p><strong>This is an illustrative example, not a real student's story.</strong> It shows how a learning plan for this kind of goal could be structured. Every learner's plan is built around their own starting point.</p></div>
    <div class="prose">
${expand(body, { slug: c.slug })}
    </div>
  </div>
</article>
<section class="section section-surface" aria-labelledby="more-cases-heading">
  <div class="container">
    <div class="section-head section-head-row">
      <h2 id="more-cases-heading">More example journeys</h2>
      <a class="text-link" href="/case-studies/">All case studies ${icon("arrow-right")}</a>
    </div>
    ${caseCards(c.slug)}
  </div>
</section>
${ctaBand()}
</main>`;
}

// Rewrite root-relative URLs ("/about/") to page-relative ones ("../about/") so the
// site also works when opened straight from disk. 404.html keeps absolute URLs
// because GitHub Pages serves it at whatever path was requested.
function relativize(html, route) {
  if (route === "/404") return html;
  const depth = route.split("/").filter(Boolean).length;
  const prefix = depth ? "../".repeat(depth) : "./";
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${prefix}`);
}

// ---------- pages ----------
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

function routeFor(rel) {
  const r = rel.split(path.sep).join("/").replace(/\.html$/, "");
  if (r === "index") return "/";
  if (r === "404") return "/404";
  return "/" + r.replace(/\/index$/, "") + "/";
}

function outFile(route) {
  if (route === "/404") return path.join(ROOT, "404.html");
  return path.join(ROOT, ...route.split("/").filter(Boolean), "index.html");
}

const built = [];
for (const file of walk(PAGES)) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/^<!--meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error("Missing meta comment in " + file);
  const meta = JSON.parse(m[1]);
  const body = src.slice(m[0].length);
  const route = routeFor(path.relative(PAGES, file));

  let main;
  let type = "website";
  let jsonLd = meta.jsonLd;
  if (meta.layout === "article") {
    main = articleLayout(meta, body);
    type = "article";
    const r = resources.find((x) => x.slug === meta.slug);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: r.title,
      description: r.description,
      author: { "@type": "Organization", name: site.name, url: site.url },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      mainEntityOfPage: site.url + route,
    };
  } else if (meta.layout === "case") {
    main = caseLayout(meta, body);
    type = "article";
  } else if (meta.layout === "course") {
    main = courseLayout(meta, body);
    jsonLd = courseJsonLd(courses.find((x) => x.slug === meta.slug), route);
  } else {
    main = expand(body);
  }

  const html = `${head({ title: meta.title, description: meta.description, route, type, jsonLd })}
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${header(route)}
${main.trim()}
${footer()}
</body>
</html>
`;
  const out = outFile(route);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, relativize(html, route));
  built.push(route);
}

// ---------- sitemap + config ----------
const urls = built
  .filter((r) => r !== "/404")
  .sort()
  .map((r) => `  <url><loc>${site.url}${r}</loc></url>`)
  .join("\n");
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

fs.mkdirSync(path.join(ROOT, "assets", "js"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "assets", "js", "config.js"),
  `// Generated by tools/build.mjs from _src/data.mjs. Edit there, not here.\nwindow.HOE_CONFIG = ${JSON.stringify(
    {
      contactEmail: site.contactEmail,
      formEndpoint: site.formEndpoint,
      instagram: site.instagram,
      courseGoals: Object.fromEntries(courses.map((c) => [c.slug, c.goal])),
    },
    null,
    2
  )};\n`
);

console.log(`Built ${built.length} pages:\n  ` + built.sort().join("\n  "));
