import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
        <details className="lg:hidden relative">
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
            <li><a href="mailto:kyeimiahthomasamo97@gmail.com" className="hover-underline">Email</a></li>
            <li><a href="https://scholar.google.com/citations?user=Wh2jRRYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="hover-underline">Google Scholar</a></li>
            <li><a href="https://github.com/devThom-studios" target="_blank" rel="noopener noreferrer" className="hover-underline">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/thomas-amo-kyeimiah-msc-87b602166/" target="_blank" rel="noopener noreferrer" className="hover-underline">LinkedIn</a></li>
            <li><a href="https://orcid.org/0009-0002-5080-0818" target="_blank" rel="noopener noreferrer" className="hover-underline">ORCID</a></li>
          </ul>
        </div>
      </div>
      <div className="container-prose py-6 border-t border-border flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Thomas Amo Kyeimiah. All rights reserved.</p>
        <p>Last updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.</p>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative border-b border-border surface-frost overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-70 atmosphere-contours"
      />
      <div className="container-prose relative py-20 md:py-28 fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl md:text-6xl leading-[1.05] max-w-4xl">{title}</h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}