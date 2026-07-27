import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { RESEARCH } from "@/data/site";
import { Link } from "@tanstack/react-router";
import { NAIN_FEATURE_IMAGE } from "@/data/nain-fieldwork";
import { FigureLightbox } from "@/components/figure-lightbox";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Research projects on sea-ice projection in Nunatsiavut (Labrador), CMIP6 sea-ice evaluation with ECCC, and climate–health interactions across Ghana's agro-ecological zones.",
      },
      { property: "og:title", content: "Research — Thomas Amo Kyeimiah" },
      {
        property: "og:description",
        content:
          "Research on sea-ice projection in Nunatsiavut, CMIP6 sea-ice evaluation, and climate–health interactions in Ghana — with methods, datasets, and results.",
      },
      { property: "og:url", content: "https://kyeimiahlab.com/research" },
    ],
    links: [{ rel: "canonical", href: "https://kyeimiahlab.com/research" }],
  }),
  component: Research,
});

function Research() {
  const [openFigure, setOpenFigure] = useState<{ src: string; alt: string } | null>(null);
  const thumbPosition: Record<string, string> = {
    "sea-ice-nunatsiavut": "center",
    "cmip6-sea-ice-assessment": "center",
    "malaria-vectorial-capacity": "center",
  };
  return (
    <SiteLayout>
      <PageHero
        variant="research"
        eyebrow="Research"
        title="Physical climate dynamics, data-driven attribution, and hybrid modelling."
        lead="Each project below is an ongoing thread of work. I've included methods, datasets, headline results, and links to the code and papers where they exist."
      />
      <section className="container-prose py-16 md:py-24 space-y-24">
        {RESEARCH.map((r, i) => (
          <Reveal
            as="article"
            key={r.slug}
            id={r.slug}
            delayMs={i * 80}
            className="scroll-mt-24 grid gap-10 md:grid-cols-[5fr_7fr] items-start"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <button
                type="button"
                onClick={() => setOpenFigure({ src: r.image, alt: r.imageAlt })}
                className="group block w-full rounded-md overflow-hidden border border-border bg-mist focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={`View full figure: ${r.imageAlt}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: thumbPosition[r.slug] ?? "center" }}
                  />
                </div>
                <span className="flex items-center justify-center gap-1.5 border-t border-border bg-background/60 py-2 text-xs text-navy-deep">
                  <Maximize2 size={12} aria-hidden="true" />
                  View full figure
                </span>
              </button>
              <p className="mt-3 text-xs text-muted-foreground italic">
                Figure. {r.imageAlt}
              </p>
            </div>
            <div>
              <p className="eyebrow">{r.period}</p>
              <h2 className="mt-3 text-2xl md:text-3xl leading-snug">{r.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-foreground/85">
                {r.summary}
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="eyebrow mb-2">Methods</p>
                  <ul className="space-y-1 text-sm">
                    {r.methods.map((m) => (
                      <li key={m}>· {m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-2">Datasets</p>
                  <ul className="space-y-1 text-sm">
                    {r.datasets.map((d) => (
                      <li key={d}>· {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <p className="eyebrow mb-2">Selected results</p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {r.results.map((res) => (
                    <li key={res} className="pl-4 border-l-2 border-accent">
                      {res}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {r.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="hover-underline text-navy-deep"
                  >
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* Fieldwork feature */}
        <Reveal
          as="article"
          id="fieldwork"
          className="grid gap-10 md:grid-cols-[5fr_7fr] items-stretch border-t border-border pt-16"
        >
          <Link
            to="/fieldwork/nain-2024"
            className="block rounded-md overflow-hidden border border-border bg-mist group focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="View the Nain field campaign"
          >
            <img
              src={NAIN_FEATURE_IMAGE.src}
              alt={NAIN_FEATURE_IMAGE.alt}
              width={1600}
              height={1200}
              loading="lazy"
              className="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>
          <div>
            <p className="eyebrow">Fieldwork · February 2024</p>
            <h2 className="mt-3 text-2xl md:text-3xl leading-snug">
              Nain Field Campaign — Nunatsiavut, Labrador
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/85">
              A February 2024 campaign on the sea ice outside Nain, in
              support of my M.Sc. research at McGill. I installed and
              maintained an automatic weather station, visible and infrared
              cameras, and a radiometer, and worked with researchers and
              local partners to collect in-situ observations that anchor
              satellite, ERA5, and CESM comparisons for regional sea-ice
              projections.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="eyebrow mb-2">Location</p>
                <p>Nain, Nunatsiavut, Labrador</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Context</p>
                <p>M.Sc. research, McGill University</p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/fieldwork/nain-2024"
                className="hover-underline text-navy-deep text-sm"
              >
                View field campaign →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <FigureLightbox
        src={openFigure?.src ?? null}
        alt={openFigure?.alt ?? ""}
        onClose={() => setOpenFigure(null)}
      />
    </SiteLayout>
  );
}
