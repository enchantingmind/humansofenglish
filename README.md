# Humans of English

Static website for **humansofenglish.com**: plain HTML and CSS, hosted on GitHub Pages.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page |
| `style.css` | Styles (brand colours are CSS variables at the top) |
| `favicon.svg` | Browser tab icon |
| `CNAME` | Tells GitHub Pages the custom domain: `humansofenglish.com` |
| `.nojekyll` | Serve files as-is (skip Jekyll processing) |
| `robots.txt`, `sitemap.xml` | For search engines |

## Local preview

Open `index.html` in a browser. No build step.

## Deploying (GitHub Pages)

Every push to `main` publishes the site once Pages is enabled.

**One-time setup** (needs a repo admin) — *Settings → Pages*:

1. **Source:** Deploy from a branch → `main` / `(root)` → Save.
2. **Custom domain:** `humansofenglish.com` → Save. Wait for the DNS check to pass.
3. Tick **Enforce HTTPS** once it becomes available (the certificate is issued
   automatically, usually within an hour of the DNS check passing).

Optional but recommended: verify the domain under the owner's
*GitHub Settings → Pages → Add a domain*. GitHub provides a TXT record to add in
GoDaddy, which stops anyone else from claiming the domain on GitHub.

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

- **Delete every other A record on `@`** (GoDaddy's parking/forwarding addresses,
  e.g. `3.33.130.190` and `15.197.148.33`). If they stay, some visitors get
  GoDaddy's page instead of the site, and the HTTPS certificate may fail to issue.
- Turn off **Domain Forwarding** in GoDaddy if it is on.
- Do not add a CAA record unless it allows `letsencrypt.org`.

`www.humansofenglish.com` will redirect to `humansofenglish.com` automatically.

### Checking DNS

```bash
nslookup -type=A humansofenglish.com 8.8.8.8      # should list only the four 185.199.x.153 addresses
nslookup -type=CNAME www.humansofenglish.com 8.8.8.8
```

DNS changes can take up to a few hours to spread. If the site looks wrong on your
own network but right on mobile data, your router is caching an old record.
