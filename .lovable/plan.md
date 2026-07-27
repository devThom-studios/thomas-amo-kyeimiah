
# QA Audit — kyeimiahlab.com

Read-only review of source in `src/` and `public/`. No files were modified. Live-browser tests were not executed for this pass; findings are grounded in the source code, which is what the runtime renders. Items flagged "verify in browser" are worth confirming with Playwright before shipping fixes.

Legend — **Sev**: Critical / High / Medium / Low. **C** = confirmed problem in code, **O** = optional improvement.

---

## Critical

**1. Sitemap emits invalid `<loc>` values.** [C]
- File: `src/routes/sitemap[.]xml.ts`, `BASE_URL = ""`.
- Evidence: output is `<loc>/about</loc>`, `<loc>/</loc>`, etc. Sitemaps require absolute URLs; Google Search Console will reject the sitemap.
- Fix: `const BASE_URL = "https://kyeimiahlab.com";` (project domain is set — the empty-string placeholder pattern only applies when no domain exists).

**2. Research page meta description is stale and misrepresents the portfolio.** [C]
- File: `src/routes/research.tsx` lines 15–20.
- Evidence: description says *"West African monsoon, SST teleconnections, and machine-learned atmospheric boundary-layer physics"* — none of that appears in `RESEARCH` (sea ice / CMIP6 / malaria vectorial capacity). Same string surfaces in Google results and `og:description`.
- Fix: rewrite to reflect the real research (sea-ice projection in Nunatsiavut, CMIP6 sea-ice evaluation, climate–health in Ghana).

---

## High

**3. All child routes use relative `canonical` and `og:url`.** [C]
- Files: `about.tsx`, `research.tsx`, `publications.tsx`, `projects.tsx`, `teaching.tsx`, `articles.tsx`, `cv.tsx`, `contact.tsx`, `fieldwork.nain-2024.tsx`.
- Evidence: `{ rel: "canonical", href: "/about" }`, `{ property: "og:url", content: "/about" }` etc.
- Impact: crawlers/social platforms may resolve against the sharing domain (or discard). The project has a canonical domain (`https://kyeimiahlab.com`) already used in `__root.tsx` and `index.tsx`; leaf routes should match.
- Fix: use `https://kyeimiahlab.com<path>` on every leaf.

**4. Fieldwork `og:image` is a relative asset URL.** [C]
- File: `src/routes/fieldwork.nain-2024.tsx` lines 24–25 — `og:image: NAIN_HERO.src` (resolves to `/__l5e/assets-v1/...`).
- Impact: social crawlers require absolute URLs; WhatsApp/Twitter/LinkedIn will drop the preview.
- Fix: build absolute URL (`https://kyeimiahlab.com${NAIN_HERO.src}`) or use `getRequestOrigin` at loader time.

**5. `robots.txt` has no `Sitemap:` directive.** [C]
- File: `public/robots.txt`.
- Fix: add `Sitemap: https://kyeimiahlab.com/sitemap.xml`.

**6. Formspree form has no anti-spam honeypot.** [C]
- File: `src/routes/contact.tsx`.
- Evidence: form posts name/email/message directly to `https://formspree.io/f/xdaqyeon` with no `_gotcha` hidden field.
- Impact: expect spam volume. Formspree officially supports the `_gotcha` honeypot.
- Fix: add `<input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />`. Optionally add `_subject`.

---

## Medium

**7. "Coming soon" article cards are real `<a href="#">` links.** [C]
- File: `src/routes/articles.tsx` (all four `ARTICLES` have `href: "#"`).
- Impact: clicking scrolls to top with no feedback, focus outline moves oddly, and Lighthouse flags "Links do not have a discernible action". Screen readers announce them as active links.
- Fix: render `Coming soon` items as `<div>` or `<span>` (or `<a aria-disabled="true" tabIndex={-1}>`), and remove the "Read essay →" affordance until a real URL exists.

**8. Mobile nav (`<details>`) does not close after navigation.** [C]
- File: `src/components/site-layout.tsx` lines 79–96.
- Evidence: TanStack `<Link>` navigations do not toggle the ambient `<details open>` state; the menu stays open covering hero content until the user manually taps "Menu" again.
- Fix: subscribe to `useRouterState`/`useLocation` and imperatively close the `<details>` on pathname change, or use a controlled disclosure state.

**9. Home hero "Curriculum Vitae" button blends into hero background.** [O, verify in browser]
- File: `src/routes/index.tsx` lines 61–67 — `bg-navy-deep text-primary-foreground` sits on top of a `from-navy-deep/85…` overlay over the hero image, i.e. dark button on dark surface.
- Text/BG contrast passes (white on navy), but the button "shape" is nearly invisible because it matches the container. The three sibling buttons (Scholar/GitHub/LinkedIn) use `border-ivory/30 bg-background/20` — the CV CTA loses primacy.
- Fix: give the primary CTA an inverse style (e.g. `bg-ivory text-navy-deep`) so it clearly reads as the primary action.

**10. Site header lacks a skip-to-content link.** [C]
- Adds accessibility gap for keyboard users navigating past 9 nav items on every page.
- Fix: add a visually-hidden-until-focus `<a href="#main">Skip to main content</a>`, and give `<main>` `id="main"`.

**11. Nav-link active detection: `/research#fieldwork` won't trigger `/research` active state via hash.** [O]
- File: `src/components/site-layout.tsx` lines 29–38. Hash is not in `pathname`, so the check is fine — but the reverse case: on `/fieldwork/nain-2024`, `NESTED_ACTIVE` maps to `/research` (correct). No fix needed; verified.

**12. Contact form: browser autocomplete/inputmode not set.** [O]
- Add `autoComplete="name"` / `"email"`, `inputMode="text"` / `"email"` for better mobile UX.

**13. Weather widget uses hardcoded Tailwind color palette classes.** [O]
- File: `src/components/weather-widget.tsx` lines 146–155 — `text-amber-600`, `bg-sky-100`, etc. Bypasses design tokens (soft violation of the design-system rule). Works and looks fine; acceptable for state-driven condition color, but noted for consistency.

**14. `SiteFooter` renders `new Date().toLocaleDateString(...)` at render time.** [O]
- File: `src/components/site-layout.tsx` line 140. SSR/client time zones and locales can differ → hydration warnings. Also the "Last updated" string is not meaningful (it's "now", not the last content update).
- Fix: drop the auto date or hardcode a real last-updated month.

**15. `Ghana_agro_climatic_zones.jpg.asset.json` is orphaned.** [C]
- File: `src/assets/research/Ghana_agro_climatic_zones.jpg.asset.json` — no import references it (superseded by `Ghana_monthly_vectorial_capacity.jpg`).
- Fix: delete via `lovable-assets delete --file …` to avoid orphan CDN objects. Confirm no other reference first (`rg Ghana_agro`).

---

## Low

**16. Sitemap uses `changefreq=monthly` uniformly.** [O] Harmless; Google largely ignores `changefreq`. Follows the sitemap-lastmod policy correctly by omitting `<lastmod>`.

**17. `<html lang="en">` set — good.** `charSet: "utf-8"` — good. No favicon.png (only .ico) — acceptable.

**18. `articles` sitemap entry advertises a page whose links are all `#`.** [O] Consider removing `/articles` from the sitemap until an article ships.

**19. Home hero renders 9 buttons/links inside `<div>` without list semantics.** [O] Minor a11y polish; not blocking.

**20. `useMemo` MapPin/Wind/Droplets/Thermometer imports in weather widget.** [O, verify] `Wind`, `Droplets`, `Thermometer` may be unused above line 500 — worth removing dead imports; not visible in inspected portion.

**21. Publications page: doi displayed as `doi:10.1016/j.idm.2025.12.011`.** [O, verify] Cross-check the DOI resolves — the fragment `.12.011` for a 2025 volume of *Infectious Disease Modelling* is atypical; verify with the publisher before relying on it externally.

**22. `og:image` alt text and dimensions live only in `__root.tsx`.** [C] TanStack meta dedupes by `property`, so `og:image` in `index.tsx` correctly overrides the root value with the same URL. No duplication in emitted HTML — verified by inspection, but worth a Playwright DOM check to be 100% sure.

**23. Reduced-motion respected.** [C] `src/styles.css` line 221 gates animations under `@media (prefers-reduced-motion: reduce)`. Good.

---

## Not tested this pass (recommend before merging fixes)

- **Live browser matrix (1440 / 768 / 390).** Verify: mobile nav overlay z-index vs sticky header; hero crop focal points on `/publications`, `/projects`, `/cv` at 390px; weather widget layout wrapping at 390px; lightbox close-button hit target on mobile (`h-10 w-10` = 40px, below the 44px target).
- **Contact form end-to-end** with a fake payload (Formspree accepts test submissions; do NOT actually submit unless the user wants an inbox entry).
- **Weather widget** on a tab-visibility transition after >10 min to confirm auto-refresh.
- **`stack_modern--invoke-server-function`** GET `/sitemap.xml` and GET `/robots.txt` to confirm the runtime output matches expectations after fix #1.
- **Typecheck/build.** Not run this turn (harness auto-runs on edits); recommended before final sign-off.

---

## Suggested fix order

1. Sitemap `BASE_URL` (#1) + `robots.txt` sitemap directive (#5) — one-line SEO fixes.
2. Research page meta description (#2) and absolute canonical/og:url on all leaf routes (#3, #4).
3. Formspree honeypot (#6).
4. Articles "Coming soon" placeholder (#7), mobile nav auto-close (#8), Home CV CTA contrast (#9), skip-to-content link (#10).
5. Cleanup: orphan asset (#15), footer auto-date (#14), dead weather imports (#20).

Approve this report to switch to build mode, or tell me which subset to fix first.
