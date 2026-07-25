import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { PROJECTS } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Open-source computational projects: Python tooling for climate modelling, machine learning, geospatial analysis, and visualisation.",
      },
      { property: "og:title", content: "Projects — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Open-source scientific software and computational projects." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: Projects,
});

function Projects() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Projects"
        title="Open-source scientific software."
        lead="Computational work — most of it public — that supports the research on this site. Python for climate modelling, machine learning, geospatial analysis, and visualisation."
      />
      <section className="container-prose py-20">
        <ul className="divide-y divide-border border-y border-border">
          {PROJECTS.map((p) => (
            <li key={p.name} className="py-8 grid gap-6 md:grid-cols-[1fr_2fr] items-start group">
              <div>
                <p className="font-mono text-sm text-accent">{p.name}</p>
                <p className="mt-2 text-xl font-serif text-navy-deep leading-snug">
                  {p.tagline}
                </p>
              </div>
              <div>
                <p className="text-base leading-relaxed text-foreground/85">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-mono text-muted-foreground border border-border rounded px-2 py-0.5"
                    >
                      {s}
                    </span>
                  ))}
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-sm hover-underline text-navy-deep"
                  >
                    View repository →
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
