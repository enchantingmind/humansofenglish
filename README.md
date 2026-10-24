# Humans of English

Website for **humansofenglish.com**, an English learning institution for IELTS, TOEFL,
spoken English and professional communication. *Learn English. Find Your Voice.*

Plain HTML, CSS and a little vanilla JavaScript. No framework, no npm packages, no
tracking. Hosted on GitHub Pages.

## How it's organised

| Path | What it is |
| --- | --- |
| `_src/pages/` | **Page content.** One file per page; folders become URLs. |
| `_src/partials/` | Shared blocks: contact form, FAQ, level selector, CTA band |
| `_src/data.mjs` | **Site settings**, navigation, resource list and case-study list |
| `_src/icons/` | Lucide icons (ISC licence), inlined at build time |
| `tools/build.mjs` | Build script: wraps pages in the shared header/footer, writes HTML |
| `tools/serve.mjs` | Local preview server that behaves like GitHub Pages |
| `assets/css/style.css` | All styles; brand colours are CSS variables at the top |
| `assets/js/site.js` | Menu, accordions, level selector, filters/search, form validation |
| `assets/images/` | Hero illustration (original SVG) and social sharing image |
| `assets/fonts/` | Inter, self-hosted (SIL Open Font Licence) |
| `index.html`, `*/index.html`, `404.html`, `sitemap.xml`, `assets/js/config.js` | **Generated.** Don't edit; run the build. |
| `CNAME`, `.nojekyll`, `robots.txt`, `favicon.svg` | GitHub Pages / SEO files |

## Editing the site

Requires [Node.js](https://nodejs.org) 18 or newer, with nothing to install.

```bash
node tools/build.mjs      # regenerate all HTML after any change in _src/
node tools/serve.mjs      # preview at http://localhost:8080/
```

Commit the generated files along with your changes. GitHub Pages serves them as-is.

- **Change a page:** edit the file in `_src/pages/`. The `<!--meta {...} -->` block at
  the top sets the page title and meta description.
- **Add a learning resource:** add an entry to `resources` in `_src/data.mjs`, then
  create `_src/pages/learning-resources/<slug>.html` with `"layout": "article"`.
  Cards, filters, search, footer links and the sitemap update automatically.
- **Courses and fees:** edit `courses` in `_src/data.mjs` (title, duration, level,
  who it's for, outcomes, study plan, what's included). The "From ₹999 / month" price
  is `priceFrom` / `pricePeriod` in `site`. A new course also needs a page file
  `_src/pages/courses/<slug>.html` with `"layout": "course"`, and its `goal` must
  match an option in the contact form's goal list.
- **Add a case study:** same pattern with `caseStudies` and `_src/pages/case-studies/`.
  Case studies are labelled as *example journeys*. Keep them that way unless they
  describe a real learner who has given permission.
- **Styles** need no build step. Edit `assets/css/style.css` and refresh.

### Contact form, email and Instagram

Contact details live in `_src/data.mjs` (rebuild after changing them):

- `contactEmail` is **mansi@humansofenglish.com**. Submitting the form validates the
  details, then opens the visitor's own email app with a message addressed to this
  inbox: subject `Enquiry: <goal> (<name>)`, and their message, name, email and goal
  in the body. The visitor presses send in their email app.
- `instagram` is **humansofenglish**. Shown as "DM us on Instagram" on the homepage,
  contact page and footer.
- `formEndpoint` (optional) is a form service URL, for example Formspree. When set, the form
  sends the email itself without opening the visitor's email app, and shows "sent"
  only when the service confirms it. Update the privacy policy if you switch.

Leaving a value empty hides it everywhere.

## Deploying (GitHub Pages)

Every push to `main` publishes the site once Pages is enabled.

**One-time setup**, needing an admin of `enchantingmind/humansofenglish`. Go to
*Settings → Pages*:

1. **Source:** Deploy from a branch → `main` / `(root)` → Save.
2. **Custom domain:** `humansofenglish.com` → Save. Wait for the DNS check to pass.
3. Tick **Enforce HTTPS** once it becomes available. The certificate is issued
   automatically, usually within an hour of the DNS check passing.

Recommended: verify the domain under the owner's *GitHub account Settings → Pages →
Add a domain*. GitHub gives you a TXT record to add in GoDaddy, which stops anyone else
from claiming the domain on GitHub.

## DNS at GoDaddy

*GoDaddy → My Products → humansofenglish.com → DNS → DNS Records*

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | enchantingmind.github.io |

Also:

- **Delete every other A record on `@`.** These are GoDaddy's parking/forwarding addresses,
  e.g. `3.33.130.190` and `15.197.148.33`. If they stay, some visitors get GoDaddy's
  page instead of the site, and the HTTPS certificate may fail to issue.
- Turn off **Domain Forwarding** in GoDaddy if it is on.
- Don't add a CAA record unless it allows `letsencrypt.org`.

`www.humansofenglish.com` redirects to `humansofenglish.com` automatically.

### Checking DNS

```bash
nslookup -type=A humansofenglish.com 8.8.8.8      # only the four 185.199.x.153 addresses
nslookup -type=CNAME www.humansofenglish.com 8.8.8.8
```

DNS changes can take a few hours to spread. If the site looks wrong on your own
network but right on mobile data, your router is caching an old record.

## Content principles

The site never invents statistics, pass rates, testimonials, staff, history, or
contact details. Exam format summaries point readers to the official test websites,
because formats change.
