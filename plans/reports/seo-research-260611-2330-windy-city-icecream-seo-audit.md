# SEO Research — Windy City Ice Cream (windycityicecream.com)

Date: 2026-06-11 | Type: SEO audit + service-area analysis + recommendations

## 1. Service Area Analysis (khu vực bán hàng)

**Business model:** Ice cream truck + pushcart catering (B2B + B2C events). Seasonal: May – mid-September.

**Base:** Alsip, IL 60803 (southwest Cook County suburb).
- ⚠️ NAP CONFLICT: JSON-LD says `11641 South Ridgeland Ave`; chatbot knowledge base says warehouse `10525 S Ridgeland Ave`. Must confirm + unify (NAP consistency = critical local ranking factor).

**Coverage = drive-time tiers from Alsip (peak traffic, one-way):**
| Tier | Drive time | Fee | Approx. zone |
|---|---|---|---|
| Free | 0–30 min | $0 | South/SW suburbs: Oak Lawn, Evergreen Park, Burbank, Blue Island, Orland Park, Tinley Park, Oak Forest, Palos Hills, Bridgeview, Chicago South Side |
| T1 | 31–45 min | $25 | Chicago downtown/North Side, Bolingbrook, Joliet, Oak Brook, Berwyn, Cicero |
| T2 | 46–60 min | $50 | Naperville, Schaumburg, Evanston, Aurora (partial) |
| T3 | 61–75 min | $100 | Elgin, far N/W suburbs — edge of coverage |

**Declared counties:** Cook, Will, DuPage. Effective radius ≈ 75-min peak drive ≈ most of Chicagoland.

**Key customer segments:** corporate events, schools (discount program), festivals, block parties, fundraisers, weddings/private parties.

**Strategic implication:** strongest economics in the FREE zone (south/SW suburbs) — but site never names ANY suburb in indexable copy. Only generic "greater Chicago area". Zero suburb keywords to rank on.

## 2. Current SEO State

### Good (already implemented)
- Full metadata: title template, description, OG, Twitter card, robots meta — `fe/src/app/layout.jsx`
- Per-page metadata + canonical via route `layout.jsx` (about, contact, events, pricing, refunds, service)
- `robots.txt` + `sitemap.js` (7 URLs)
- JSON-LD: FoodEstablishment (NAP, geo, areaServed counties) + WebSite — `fe/src/components/json-ld.jsx`
- GA4 (G-860HRT2S3Z)
- Site already surfaces #1 in sample SERP for "ice cream truck catering Chicago suburbs"

### Issues found
1. **NAP address conflict** (see above) — json-ld.jsx vs knowledge-base.js.
2. **Duplicate H1**: home `page.jsx` (lines 673, 836) and `about/page.jsx` (453, 516) each have 2× `<h1>`. Demote second to `<h2>`.
3. **17 images with `alt=""`** + non-descriptive filenames (`1211991 2.png`). next/image alt should describe ("ice cream truck serving corporate event in Chicago").
4. **No suburb-level content**: /service page says only "greater Chicago area". No city names in copy, no per-suburb landing pages.
5. **Maps embed `q=Chicago`** (generic city center) on home + /service — should pin actual business location/GBP.
6. **JSON-LD gaps**: `sameAs: []` (no GBP/Facebook/Instagram/Yelp links); areaServed = 3 counties only (no City entries); no FAQPage schema (FAQ content already exists in chatbot KB); no Service/Offer schema; no openingHoursSpecification/seasonal note; no aggregateRating.
7. **No blog/content section** — zero long-tail capture ("how much does ice cream truck catering cost", "school event ideas").
8. `keywords` meta tag ignored by Google (harmless, low value).
9. `sitemap lastModified: new Date()` every build — fake freshness signal, minor.

## 3. Competitor Landscape (from SERP sampling, June 2026)

| Competitor | Angle |
|---|---|
| rainbowcone.com/catering | Big brand, brand searches |
| chicagoicecreamtruck.com | Exact-match domain, broad suburb claims |
| chitownicecreamtruck.com | Longevity (since 2002) |
| bigbrosicecream.com | Shop + truck combo |
| icecreamonwheels.com | National franchise w/ Chicago page |
| icecreamtruckchi.com (Everest) | Catering-focused landing pages |
| roaminghunger.com | Directory — get listed (free backlink + leads) |

Differentiators to push in copy/schema: woman-owned, 10+ years, school fundraiser profit-share, 24h pushcart service, transparent pricing tiers.

## 4. Recommendations (prioritized)

### P0 — Quick wins (hours)
1. Resolve NAP conflict; single source of truth for address across json-ld, footer, contact, chatbot KB. Align with Google Business Profile.
2. Fix duplicate H1s (home, about) → `<h2>`.
3. Fill all 17 empty `alt` attributes with descriptive, keyword-natural text.
4. /service page: add indexable suburb list grouped by travel tier (Free zone first) — instantly creates ~30 city keyword associations.
5. JSON-LD: add `sameAs` (GBP, Facebook, Instagram, Yelp), expand `areaServed` with `City` entries, add `FAQPage` schema (reuse chatbot FAQ), add seasonal `openingHoursSpecification`.
6. Fix Maps embeds to actual Alsip location / GBP pin.

### P1 — Local SEO structure (days)
7. **Google Business Profile** (if not done): service-area business, categories "Ice cream truck" + "Caterer", request reviews after every event → reply to all. #1 lever for "ice cream truck near me".
8. **Suburb landing pages**: `/service-areas/[city]` for 10–15 high-value towns (Oak Lawn, Orland Park, Tinley Park, Oak Forest, Palos Hills, Evergreen Park, Burbank, Naperville, Bolingbrook, Joliet, Oak Brook, Schaumburg, Evanston, Chicago neighborhoods). Each: unique 300–500 words, travel-fee tier, local event types, testimonial, CTA + quote form link. Add to sitemap. Avoid doorway-page risk: real unique content per page.
9. **Event-type pages** (or expand /events): corporate events, school events + fundraisers, weddings, block parties, festivals. Matches query intent "ice cream truck for school event Chicago".
10. Directory citations/backlinks: Roaming Hunger, Yelp, GigSalad, The Knot, Thumbtack, local chambers (Alsip, Oak Lawn).

### P2 — Content & authority (ongoing)
11. Blog: pricing explainer ("How much does ice cream truck catering cost in Chicago? — 2026"), planning guides, seasonal "book early for May–June" posts (Feb–Apr publish cadence to catch pre-season demand).
12. Visible FAQ section on site (content already written in chatbot KB) + FAQPage schema.
13. Testimonials/review embed + AggregateRating schema once GBP reviews accumulate.
14. Rename key images to descriptive filenames; add OG image check (`/main.png` exists in public?).

## 5. Target Keyword Map

| Page | Primary keyword | Secondary |
|---|---|---|
| Home | ice cream truck catering Chicago | ice cream truck rental Chicago |
| /events | ice cream truck for corporate events Chicago | company party ice cream catering |
| /pricing | ice cream truck catering cost Chicago | ice cream truck rental price |
| /service | ice cream truck service area Chicagoland | Cook/Will/DuPage County ice cream truck |
| /service-areas/[city] | ice cream truck [city] IL | ice cream catering [city] |
| Blog | how much to rent an ice cream truck | school fundraiser ice cream truck |

## Unresolved questions
1. Correct street address: 11641 or 10525 S Ridgeland Ave? (blocks P0-1)
2. Does a Google Business Profile already exist? Social profiles (FB/IG/Yelp) URLs for `sameAs`?
3. Any existing reviews/testimonials usable for review schema?
4. Confirm `/main.png` OG image exists and is 1200×630.
