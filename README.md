# 🚐 R L Travels — Website

**Comfortable & Affordable Travel Services from Bhadrak, Odisha**

A fully production-ready static website for R L Travels, featuring:
- Responsive design (works on all phones, tablets, and desktops)
- Google Sheets enquiry form integration
- Gallery lightbox
- WhatsApp floating button
- SEO-optimised with structured data
- PWA-ready (installable on phones)

---

## 📁 Project Structure

```
rl-travels/
│
├── index.html                    ← Main website page
├── 404.html                      ← Custom "Page Not Found" page
├── manifest.json                 ← PWA manifest (installable on phones)
├── robots.txt                    ← Search engine crawling rules
├── sitemap.xml                   ← SEO sitemap (update URL to your domain)
│
├── css/
│   ├── tokens.css                ← Design tokens (colors, spacing, fonts)
│   ├── reset.css                 ← CSS reset + base styles
│   ├── components.css            ← Reusable UI components (buttons, cards, forms)
│   └── layout.css                ← Page sections + full responsive breakpoints
│
├── js/
│   ├── nav.js                    ← Navigation: scroll-aware, mobile drawer
│   ├── reveal.js                 ← Scroll-reveal animations
│   ├── utils.js                  ← Back-to-top, lightbox, WhatsApp FAB, pills
│   └── form.js                   ← Form validation + Google Sheets submission
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   │   └── hero-bg.jpg       ← ★ ADD YOUR HERO IMAGE HERE
│   │   ├── gallery/
│   │   │   ├── gallery-1.jpg     ← ★ ADD GALLERY IMAGES HERE (1–7)
│   │   │   ├── gallery-2.jpg
│   │   │   ├── gallery-3.jpg
│   │   │   ├── gallery-4.jpg
│   │   │   ├── gallery-5.jpg
│   │   │   ├── gallery-6.jpg
│   │   │   └── gallery-7.jpg
│   │   └── icons/
│   │       ├── favicon.ico       ← ★ ADD YOUR FAVICON HERE
│   │       ├── favicon-16.png
│   │       ├── favicon-32.png
│   │       ├── apple-touch.png   ← 180×180px (iOS home screen icon)
│   │       ├── icon-192.png      ← 192×192px (Android PWA icon)
│   │       ├── icon-512.png      ← 512×512px (Android PWA icon)
│   │       └── og-image.jpg      ← 1200×630px (social share preview)
│   └── fonts/                    ← Optional: place self-hosted fonts here
│
└── google-apps-script/
    └── Code.gs                   ← ★ DEPLOY THIS to connect Google Sheets
```

---

## 🚀 Quick Start

### 1. Add Your Images

| File | Size | Purpose |
|------|------|---------|
| `assets/images/hero/hero-bg.jpg` | 1920×1080px | Hero background |
| `assets/images/gallery/gallery-1.jpg` | 700×900px | Tall gallery feature image |
| `assets/images/gallery/gallery-2.jpg` to `gallery-7.jpg` | 600×400px | Gallery grid images |
| `assets/images/icons/favicon.ico` | 32×32px | Browser tab icon |
| `assets/images/icons/apple-touch.png` | 180×180px | iOS home screen icon |
| `assets/images/icons/og-image.jpg` | 1200×630px | Social media share image |
| `assets/images/icons/icon-192.png` | 192×192px | Android PWA icon |
| `assets/images/icons/icon-512.png` | 512×512px | Android PWA splash icon |

> 💡 **Image optimisation tip:** Use [squoosh.app](https://squoosh.app) to compress images.
> Target: hero < 400KB, gallery images < 150KB each.

---

### 2. Connect Google Sheets (Enquiry Form)

**Step 1 — Create a Google Sheet**
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet named **"RL Travels – Enquiries"**
3. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

**Step 2 — Set up Apps Script**
1. In the sheet: **Extensions → Apps Script**
2. Delete existing code, paste the entire contents of `google-apps-script/Code.gs`
3. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
4. Click **Save** 💾

**Step 3 — Deploy as Web App**
1. Click **Deploy → New deployment**
2. Click ⚙ gear icon → **Web app**
3. Set **Execute as:** `Me`
4. Set **Who has access:** `Anyone`
5. Click **Deploy** → **Authorize access**
6. Copy the **Web App URL**

**Step 4 — Connect to the website**
1. Open `index.html`
2. Find: `data-sheet-url="PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"`
3. Replace with your Web App URL

**Step 5 — Optional: Email notifications**

In `Code.gs`, set:
```javascript
var SEND_EMAIL_NOTIFICATION = true;
var NOTIFY_EMAIL = 'your@email.com';
```
Then **re-deploy** (Deploy → Manage deployments → Edit → New version).

---

### 3. Update Your Details

Search and replace these placeholders in `index.html`:

| Placeholder | Replace with |
|-------------|-------------|
| `+919238514756` | Your phone number |
| `rltravels@gmail.com` | Your email address |
| `https://rltravels.in` | Your actual website URL |
| `R L Travels` | Your business name (if different) |

Also update:
- `sitemap.xml` — replace `rltravels.in` with your domain
- `manifest.json` — update `start_url` and `shortcuts` URLs
- `robots.txt` — update the `Sitemap:` URL

---

### 4. Deploy Your Website

**Option A — Free hosting (Recommended for starters)**
- [Netlify](https://netlify.com) — drag & drop the `rl-travels/` folder
- [Vercel](https://vercel.com) — import from GitHub
- [GitHub Pages](https://pages.github.com) — free for public repos

**Option B — cPanel / Shared Hosting**
1. Zip the contents of `rl-travels/` (not the folder itself)
2. Upload to `public_html/` via File Manager or FTP
3. Extract the zip

**Option C — VPS (nginx example)**
```nginx
server {
    listen 80;
    server_name rltravels.in www.rltravels.in;
    root /var/www/rl-travels;
    index index.html;

    location / {
        try_files $uri $uri/ /404.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|webp|ico|svg|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /404.html;
}
```

---

## 🎨 Customisation

### Change the colour scheme
Edit `css/tokens.css` — all colours are in the `:root` block:
```css
--clr-saffron: #E8670A;   /* primary accent */
--clr-green:   #2E7D52;   /* WhatsApp / success buttons */
--clr-gold:    #C9921A;   /* stars, gold accents */
```

### Change fonts
Edit `css/tokens.css` and the Google Fonts `<link>` in `index.html`:
```css
--font-display: 'Playfair Display', serif;
--font-body:    'DM Sans', sans-serif;
```

### Add/remove gallery images
Edit the `gallery__grid` section in `index.html`. Each item follows this pattern:
```html
<div class="gallery__item reveal">
  <img src="assets/images/gallery/gallery-N.jpg"
    alt="Description of image"
    loading="lazy" width="600" height="400"
    onerror="this.src='fallback-url'">
</div>
```

### Update pricing
Find the `.pricing__grid` section in `index.html` and update the `price-card__number` values.

---

## 📱 Features

| Feature | Status |
|---------|--------|
| Fully responsive (360px – 4K) | ✅ |
| Mobile navigation drawer | ✅ |
| Scroll-reveal animations | ✅ |
| Gallery lightbox (click to enlarge) | ✅ |
| WhatsApp floating button | ✅ |
| Back-to-top button | ✅ |
| Google Sheets form submission | ✅ |
| Form validation (client-side) | ✅ |
| Email notifications on enquiry | ✅ |
| Promo code copy to clipboard | ✅ |
| Destination pills → WhatsApp | ✅ |
| Dark/light nav on scroll | ✅ |
| PWA installable | ✅ |
| SEO meta + structured data | ✅ |
| Open Graph / Twitter Card | ✅ |
| Custom 404 page | ✅ |
| Print stylesheet | ✅ |
| Reduced motion support | ✅ |
| Image fallbacks (onerror) | ✅ |

---

## 🛠 Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Samsung Internet 14+ | ✅ Full |
| Opera 76+ | ✅ Full |

---

## 📞 Support

For any issues with the website setup:
- **Phone:** +91 92385 14756
- **Email:** rltravels@gmail.com
- **WhatsApp:** [wa.me/919238514756](https://wa.me/919238514756)

---

*© 2025 R L Travels, Bhadrak, Odisha. All rights reserved.*
