import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { PROJECTS, AI_APPS } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Open-source computational projects: Python tooling for climate modelling, machine learning, geospatial analysis, and visualisation — plus AI-built web apps and games.",
      },
      { property: "og:title", content: "Projects — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Open-source scientific software and AI-built web apps." },
      { property: "og:url", content: "https://kyeimiahlab.com/projects" },
    ],
    links: [{ rel: "canonical", href: "https://kyeimiahlab.com/projects" }],
  }),
  component: Projects,
});

type Tab = "software" | "ai-apps";

function Projects() {
  const [tab, setTab] = useState<Tab>("software");

  const tabs: { id: Tab; label: string }[] = [
    { id: "software", label: "Open-source scientific software" },
    { id: "ai-apps", label: "AI apps & web" },
  ];

  return (
    <SiteLayout>
      <PageHero
        variant="projects"
        eyebrow="Projects"
        title="Software, apps, and experiments."
        lead="Computational work that supports the research on this site — Python for climate modelling, machine learning, geospatial analysis, and visualisation — alongside AI-built web apps and games."
      />
      <section className="container-prose py-20">
        <div
          role="tablist"
          aria-label="Project categories"
          className="mb-12 flex flex-wrap gap-2 sm:gap-3"
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-5 py-2.5 text-sm sm:text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "border-navy-deep bg-navy-deep text-ivory"
                    : "border-border text-foreground/80 hover:border-accent hover:text-accent"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "software" ? (
          <div id="panel-software" role="tabpanel" aria-label="Open-source scientific software">
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
                      {p.href && (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-sm hover-underline text-navy-deep"
                        >
                          View repository →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div id="panel-ai-apps" role="tabpanel" aria-label="AI apps and web">
            <ul className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {AI_APPS.map((app) => (
                <li
                  key={app.name}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-ivory/60 shadow-sm transition-shadow hover:shadow-md"
                >
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-[16/9] overflow-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={app.image}
                      alt={app.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </a>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-sm text-accent">{app.name}</p>
                    <h2 className="mt-2 text-xl font-serif text-navy-deep leading-snug">
                      {app.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
                    <p className="mt-3 text-base leading-relaxed text-foreground/85 flex-1">
                      {app.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {app.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-mono text-muted-foreground border border-border rounded px-2 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                      <a
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-sm hover-underline text-navy-deep"
                      >
                        Open app →
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
