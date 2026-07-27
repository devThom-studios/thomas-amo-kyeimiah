import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import aboutHero from "@/assets/heroes/about.jpg.asset.json";
import researchHero from "@/assets/heroes/research.jpg.asset.json";
import publicationsHero from "@/assets/heroes/publications.jpg.asset.json";
import projectsHero from "@/assets/heroes/projects.jpg.asset.json";
import teachingHero from "@/assets/heroes/teaching.jpg.asset.json";
import articlesHero from "@/assets/heroes/articles.jpg.asset.json";
import cvHero from "@/assets/heroes/cv.jpg.asset.json";
import contactHero from "@/assets/heroes/contact.jpg.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/research", label: "Research" },
  { to: "/publications", label: "Publications" },
  { to: "/projects", label: "Projects" },
  { to: "/teaching", label: "Teaching" },
  { to: "/articles", label: "Articles" },
  { to: "/cv", label: "CV" },
  { to: "/contact", label: "Contact" },
] as const;

// Map nested routes to the top-level nav item that should be marked active.
const NESTED_ACTIVE: Array<{ prefix: string; navTo: string }> = [
  { prefix: "/fieldwork", navTo: "/research" },
];

function isNavActive(navTo: string, pathname: string): boolean {
  if (navTo === "/") return pathname === "/";
  if (pathname === navTo || pathname.startsWith(navTo + "/")) return true;
  for (const { prefix, navTo: target } of NESTED_ACTIVE) {
    if (target === navTo && (pathname === prefix || pathname.startsWith(prefix + "/"))) {
      return true;
    }
  }
  return false;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-navy-deep focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  // Auto-close the mobile disclosure whenever the route changes.
  useEffect(() => {
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false;
  }, [pathname]);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-prose flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-baseline gap-2 group"
          aria-label="KyeimiahLab — Home"
        >
          <span className="font-serif text-lg text-navy-deep tracking-tight whitespace-nowrap">
            Kyeimiah<span className="text-sky">Lab</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Primary">
          {NAV.map((item) => {
            const active = isNavActive(item.to, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <details ref={mobileDetailsRef} className="lg:hidden relative">
          <summary className="list-none cursor-pointer text-sm text-navy-deep">Menu</summary>
          <div className="absolute right-0 top-8 w-56 rounded-md border border-border bg-card shadow-lg p-2 flex flex-col text-sm">
            {NAV.map((item) => {
              const active = isNavActive(item.to, pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link-mobile ${active ? "nav-link-mobile-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </details>
      </div>
      <div className="h-px divider-sky" aria-hidden />
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-prose py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div>
          <p className="font-serif text-lg text-navy-deep">Thomas Amo Kyeimiah</p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Atmospheric and climate data scientist. M.Sc., McGill University.
            Sea-ice and polar climate, hydroclimatology, and reproducible
            Python workflows for Earth system science.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Navigate</p>
          <ul className="grid grid-cols-2 gap-y-1.5">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground hover:text-navy-deep hover-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-1.5">
            <li><Link to="/contact" className="hover-underline">Email</Link></li>
            <li><a href="https://scholar.google.com/citations?user=Wh2jRRYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="hover-underline">Google Scholar</a></li>
            <li><a href="https://github.com/devThom-studios" target="_blank" rel="noopener noreferrer" className="hover-underline">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/thomas-amo-kyeimiah-msc-87b602166/" target="_blank" rel="noopener noreferrer" className="hover-underline">LinkedIn</a></li>
            <li><a href="https://orcid.org/0009-0002-5080-0818" target="_blank" rel="noopener noreferrer" className="hover-underline">ORCID</a></li>
          </ul>
        </div>
      </div>
      <div className="container-prose py-6 border-t border-border flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Thomas Amo Kyeimiah. All rights reserved.</p>
        <p>Built with care in Montreal.</p>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  variant = "calm",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  variant?: HeroVariant;
}) {
  const v = HERO_VARIANTS[variant];
  return (
    <section className="relative border-b border-border overflow-hidden bg-navy-deep">
      {/* Desktop crop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover hidden md:block"
        style={{
          backgroundImage: `url(${v.image})`,
          backgroundPosition: v.pos,
        }}
      />
      {/* Mobile crop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover md:hidden"
        style={{
          backgroundImage: `url(${v.image})`,
          backgroundPosition: v.posMobile,
        }}
      />
      {/* Consistent navy overlay — same treatment as the Nain hero. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/70 to-navy-deep/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-15 atmosphere-contours mix-blend-overlay"
      />
      <div className="container-prose relative py-20 md:py-28 fade-up text-white">
        <p className="eyebrow text-white/80">{eyebrow}</p>
        <h1 className="mt-4 text-4xl md:text-6xl leading-[1.05] max-w-4xl font-serif text-white drop-shadow-[0_2px_16px_rgba(10,20,40,0.55)]">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}

export type HeroVariant =
  | "about"
  | "teaching"
  | "research"
  | "projects"
  | "publications"
  | "articles"
  | "cv"
  | "contact"
  | "calm";

// Per-route hero imagery with desktop + mobile focal points tuned to keep
// text readable and each image's focal point visible.
const HERO_VARIANTS: Record<HeroVariant, { image: string; pos: string; posMobile: string }> = {
  about:        { image: aboutHero.url,        pos: "70% 55%", posMobile: "75% 55%" },
  teaching:     { image: teachingHero.url,     pos: "70% 60%", posMobile: "70% 60%" },
  research:     { image: researchHero.url,     pos: "75% 45%", posMobile: "80% 50%" },
  projects:     { image: projectsHero.url,     pos: "80% 60%", posMobile: "80% 60%" },
  publications: { image: publicationsHero.url, pos: "70% 50%", posMobile: "70% 55%" },
  articles:     { image: articlesHero.url,     pos: "70% 45%", posMobile: "75% 50%" },
  cv:           { image: cvHero.url,           pos: "75% 45%", posMobile: "80% 50%" },
  contact:      { image: contactHero.url,      pos: "55% 55%", posMobile: "55% 55%" },
  calm:         { image: aboutHero.url,        pos: "50% 50%", posMobile: "50% 50%" },
};