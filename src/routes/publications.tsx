import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { PUBLICATIONS } from "@/data/site";

type Entry = {
  year: string;
  authors: string;
  title: string;
  venue: string;
  details?: string;
  doi?: string;
  links?: readonly { label: string; href: string }[];
};

export const Route = createFileRoute("/publications")({
  head: () => ({
    meta: [
      { title: "Publications — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Peer-reviewed articles, conference presentations, theses, and posters by Thomas Amo Kyeimiah.",
      },
      { property: "og:title", content: "Publications — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Journal articles, conference talks, theses, and posters." },
      { property: "og:url", content: "/publications" },
    ],
    links: [{ rel: "canonical", href: "/publications" }],
  }),
  component: Publications,
});

function Section({ title, entries }: { title: string; entries: readonly Entry[] }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b border-navy-deep pb-3">
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        <span className="text-sm text-muted-foreground">{entries.length}</span>
      </div>
      <ol className="mt-8 space-y-10">
        {entries.map((e, i) => (
          <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 md:gap-8">
            <span className="text-sm text-muted-foreground pt-1 font-mono">{e.year}</span>
            <div>
              <p className="text-sm text-muted-foreground">{e.authors}</p>
              <p className="mt-1 text-lg leading-snug text-navy-deep font-serif">
                {e.title}
              </p>
              <p className="mt-1 text-sm italic text-muted-foreground">
                {e.venue}
                {e.details ? `, ${e.details}` : ""}
                {e.doi ? ` · doi:${e.doi}` : ""}
              </p>
              {e.links && (
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  {e.links.map((l) => (
                    <a key={l.label} href={l.href} className="hover-underline text-navy-deep">
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Publications() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Publications"
        title="Peer-reviewed articles, talks, theses, and posters."
        lead="A complete list is available in the CV. Preprints and DOIs are linked where available."
      />
      <div className="container-prose py-20 space-y-20">
        <Section title="Journal articles" entries={PUBLICATIONS.journal} />
        <Section title="Conference presentations" entries={PUBLICATIONS.conference} />
        <Section title="Theses" entries={PUBLICATIONS.thesis} />
        <Section title="Posters" entries={PUBLICATIONS.poster} />
      </div>
    </SiteLayout>
  );
}
