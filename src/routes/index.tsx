import { createFileRoute, Link } from "@tanstack/react-router";
import earthHero from "@/assets/heroes/home.jpg.asset.json";
import { SiteLayout } from "@/components/site-layout";
import { RESEARCH, RESEARCH_INTERESTS, PUBLICATIONS, SOCIALS } from "@/data/site";
import { WeatherWidget } from "@/components/weather-widget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thomas Amo Kyeimiah — Atmospheric & Climate Data Scientist" },
      {
        name: "description",
        content:
          "Personal research site of Thomas Amo Kyeimiah — climate dynamics, machine learning for Earth system science, and geospatial analysis of African rainfall.",
      },
      { property: "og:title", content: "Thomas Amo Kyeimiah — Atmospheric & Climate Data Scientist" },
      {
        property: "og:description",
        content:
          "Personal research site of Thomas Amo Kyeimiah — climate dynamics, machine learning for Earth system science, and geospatial analysis of African rainfall.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: earthHero.url, fetchpriority: "high" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = RESEARCH.slice(0, 3);
  const latest = PUBLICATIONS.journal[0];
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-navy-deep">
        <img
          src={earthHero.url}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[75%_50%] md:object-[70%_45%]"
        />
        {/* Consistent navy overlay — same treatment as the Nain hero. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/70 to-navy-deep/40" />
        <div aria-hidden className="absolute inset-0 pointer-events-none atmosphere-contours opacity-25 mix-blend-overlay" />
        <div className="container-prose relative py-24 md:py-36 fade-up">
          <p className="eyebrow text-white">Atmospheric & Climate Science · Earth System Data Science</p>
          <h1 className="mt-6 text-5xl md:text-7xl leading-[1.02] max-w-4xl text-ivory drop-shadow-[0_2px_20px_rgba(10,20,40,0.6)]">
            Thomas Amo Kyeimiah
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-ivory/90">
            I am an atmospheric and climate data scientist, recently graduated
            with an M.Sc. in Atmospheric and Oceanic Sciences from McGill
            University. My work focuses on sea-ice and polar climate,
            hydroclimatology, and the evaluation of CMIP6 and reanalysis
            datasets — combining physical intuition with reproducible Python
            workflows and machine-learning methods for Earth system science.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/cv"
              className="inline-flex items-center gap-2 rounded-md bg-navy-deep text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-navy transition-colors"
            >
              Curriculum Vitae
              <span aria-hidden>→</span>
            </Link>
            <a
              href={SOCIALS.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ivory/30 bg-background/20 text-ivory backdrop-blur-sm px-5 py-2.5 text-sm font-medium hover:bg-background/40 transition-colors"
            >
              Google Scholar
            </a>
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ivory/30 bg-background/20 text-ivory backdrop-blur-sm px-5 py-2.5 text-sm font-medium hover:bg-background/40 transition-colors"
            >
              GitHub
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ivory/30 bg-background/20 text-ivory backdrop-blur-sm px-5 py-2.5 text-sm font-medium hover:bg-background/40 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Research interests */}
      <section className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Research interests</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Questions I work on</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-lg text-foreground/85">
            {RESEARCH_INTERESTS.map((r) => (
              <li key={r} className="flex gap-3 border-t border-border pt-3">
                <span className="text-accent select-none">§</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured research */}
      <section className="relative border-t border-border surface-frost">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px divider-sky" />
        <div className="container-prose py-20 md:py-28">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow">Featured research</p>
              <h2 className="mt-3 text-3xl md:text-4xl max-w-2xl">
                Selected projects across the physical climate system
              </h2>
            </div>
            <Link
              to="/research"
              className="text-sm text-navy-deep hover-underline"
            >
              All research →
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featured.map((r) => (
              <Link
                key={r.slug}
                to="/research"
                hash={r.slug}
                aria-label={`Read details: ${r.title}`}
                className="group flex flex-col bg-card border border-border rounded-md overflow-hidden transition-all duration-200 hover:border-navy-deep hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-mist">
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <p className="eyebrow">{r.period}</p>
                  <h3 className="text-xl leading-snug">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {r.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest publication */}
      <section className="container-prose py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] items-start">
          <div>
            <p className="eyebrow">Latest publication</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Peer-reviewed</h2>
          </div>
          <article className="border-t border-navy-deep pt-8">
            <p className="text-sm text-muted-foreground">
              {latest.venue} · {latest.year}
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl leading-snug font-serif text-navy-deep">
              {latest.title}
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">{latest.authors}</p>
            <p className="mt-1 text-sm text-muted-foreground italic">
              doi:{latest.doi}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {latest.links.map((l) => (
                <a key={l.label} href={l.href} className="hover-underline text-navy-deep">
                  {l.label} →
                </a>
              ))}
              <Link to="/publications" className="hover-underline text-muted-foreground">
                All publications →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Weather */}
      <section className="relative border-t border-border surface-frost">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px divider-sky" />
        <div className="container-prose py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] items-start">
            <div>
              <p className="eyebrow">Live atmosphere</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Current weather</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                A small window on the atmosphere I study — default view is
                Montreal. Search any city or use your location.
              </p>
            </div>
            <WeatherWidget />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
