import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { TEACHING } from "@/data/site";

export const Route = createFileRoute("/teaching")({
  head: () => ({
    meta: [
      { title: "Teaching — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Teaching, mentoring, and course design in climate data science and atmospheric dynamics.",
      },
      { property: "og:title", content: "Teaching — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Teaching, mentoring, and course design." },
      { property: "og:url", content: "/teaching" },
    ],
    links: [{ rel: "canonical", href: "/teaching" }],
  }),
  component: Teaching,
});

function Teaching() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Teaching"
        title="Courses, mentoring, and open teaching material."
        lead="I teach climate data science with an emphasis on reproducibility, physical intuition, and practical geospatial workflows. All teaching notebooks are open-source."
      />
      <section className="container-prose py-20">
        <ul className="space-y-10">
          {TEACHING.map((t, i) => (
            <li
              key={i}
              className="grid gap-6 md:grid-cols-[1fr_3fr] items-start border-t border-border pt-8"
            >
              <div>
                <p className="eyebrow">{t.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.where}</p>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-serif text-navy-deep leading-snug">
                  {t.course}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-foreground/85">
                  {t.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
