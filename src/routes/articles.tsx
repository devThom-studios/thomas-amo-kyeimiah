import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { ARTICLES } from "@/data/site";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Articles — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Essays and technical notes on climate science, machine learning, and reproducible scientific computing.",
      },
      { property: "og:title", content: "Articles — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Science communication and technical writing." },
      { property: "og:url", content: "/articles" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  component: Articles,
});

function Articles() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Articles"
        title="Writing on climate science and scientific computing."
        lead="Longer-form essays for a general audience and technical notes for other researchers. Two threads: what the atmosphere is doing, and how we know."
      />
      <section className="container-prose py-16">
        <ul className="divide-y divide-border border-y border-border">
          {ARTICLES.map((a) => (
            <li key={a.title} className="py-10">
              <a href={a.href} className="group grid gap-4 md:grid-cols-[1fr_3fr] items-start">
                <div className="text-sm text-muted-foreground">
                  <p>{a.date}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
                    {a.tag}
                  </p>
                  <p className="mt-1">{a.read}</p>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-navy-deep leading-snug group-hover:text-accent transition-colors">
                    {a.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-foreground/85 max-w-2xl">
                    {a.excerpt}
                  </p>
                  <p className="mt-4 text-sm text-navy-deep hover-underline inline-block">
                    Read essay →
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
