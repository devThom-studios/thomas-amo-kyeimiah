import { Link } from "@tanstack/react-router";
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
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-prose flex items-center justify-between h-16">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-lg text-navy-deep tracking-tight">
            Thomas Amo Kyeimiah
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground tracking-widest uppercase">
            / Atmospheric Science
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-navy-deep" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-navy-deep" }}
              activeOptions={{ exact: item.to === "/" }}
              className="transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="lg:hidden relative">
          <summary className="list-none cursor-pointer text-sm text-navy-deep">Menu</summary>
          <div className="absolute right-0 top-8 w-56 rounded-md border border-border bg-card shadow-lg p-3 flex flex-col text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-1.5 text-muted-foreground hover:text-navy-deep"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
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
            Atmospheric scientist and climate data scientist. Research on the
            physical climate system, land–atmosphere interactions, and
            data-driven Earth science.
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
            <li><a href="mailto:thomas.amokyeimiah@example.edu" className="hover-underline">Email</a></li>
            <li><a href="https://scholar.google.com" target="_blank" rel="noreferrer" className="hover-underline">Google Scholar</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover-underline">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover-underline">LinkedIn</a></li>
            <li><a href="https://orcid.org" target="_blank" rel="noreferrer" className="hover-underline">ORCID</a></li>
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
    <section className="border-b border-border bg-mist/40">
      <div className="container-prose py-20 md:py-28 fade-up">
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