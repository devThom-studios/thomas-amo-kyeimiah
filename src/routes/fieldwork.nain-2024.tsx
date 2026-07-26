import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { NAIN_GALLERY, NAIN_HERO } from "@/data/nain-fieldwork";

export const Route = createFileRoute("/fieldwork/nain-2024")({
  head: () => ({
    meta: [
      { title: "Nain Field Campaign — Nunatsiavut, Labrador (Feb 2024)" },
      {
        name: "description",
        content:
          "Field campaign in Nain, Nunatsiavut (February 2024): weather-station and camera deployments, radiometer installation, and in-situ observations supporting sea-ice and climate analysis at McGill University.",
      },
      { property: "og:title", content: "Nain Field Campaign — Nunatsiavut, Labrador (Feb 2024)" },
      {
        property: "og:description",
        content:
          "Weather-station and camera deployments, radiometer installation, and in-situ observations on the sea ice near Nain, Nunatsiavut.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/fieldwork/nain-2024" },
      { property: "og:image", content: NAIN_HERO.src },
      { name: "twitter:image", content: NAIN_HERO.src },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/fieldwork/nain-2024" }],
  }),
  component: NainFieldwork,
});

function NainFieldwork() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={NAIN_HERO.src}
          alt={NAIN_HERO.alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/70 to-navy-deep/40" />
        <div className="container-prose relative py-28 md:py-40 fade-up text-white">
          <p className="eyebrow text-white/80">Fieldwork · February 2024</p>
          <h1 className="mt-5 text-4xl md:text-6xl leading-[1.05] max-w-4xl font-serif">
            Nain Field Campaign — Nunatsiavut, Labrador
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Instrument deployments, in-situ observations, and community
            engagement on the sea ice outside Nain, in support of my M.Sc.
            research at McGill University.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
            <span><span className="eyebrow text-white/60 mr-2">Location</span>Nain, Nunatsiavut, Labrador</span>
            <span><span className="eyebrow text-white/60 mr-2">Dates</span>February 2024</span>
            <span><span className="eyebrow text-white/60 mr-2">Programme</span>M.Sc., McGill University</span>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="container-prose py-20 md:py-28 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85 max-w-2xl">
          <p>
            In February 2024 I travelled to Nain, the northernmost community in
            Nunatsiavut, to carry out field research for my M.Sc. thesis at
            McGill University. The campaign combined instrument work on the
            sea ice, careful data collection under Arctic winter conditions,
            and time spent with researchers and local partners who make this
            kind of northern fieldwork possible.
          </p>
          <p>
            The observations we gathered are used alongside satellite products,
            ERA5 reanalysis, and CESM climate-model simulations to sharpen
            regional sea-ice projections for Labrador — work that matters both
            for climate science and for the community that lives with the ice
            every winter.
          </p>
        </div>
        <aside className="rounded-md border border-border bg-mist/60 p-6 text-sm space-y-4">
          <div>
            <p className="eyebrow mb-1">Field operations</p>
            <p className="text-muted-foreground leading-relaxed">
              Automatic weather station, radiometer, and visible / infrared
              camera deployments on the sea ice.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-1">Data & integration</p>
            <p className="text-muted-foreground leading-relaxed">
              In-situ observations validated against satellite, ERA5, and
              CESM output for improved sea-ice projections.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-1">Community engagement</p>
            <p className="text-muted-foreground leading-relaxed">
              Presentation of research objectives, methods, and findings at
              the Nunatsiavut Research Centre.
            </p>
          </div>
        </aside>
      </section>

      {/* Detailed sections */}
      <section className="container-prose pb-24 grid gap-16 md:grid-cols-3">
        <div>
          <p className="eyebrow">01 · Field operations</p>
          <h2 className="mt-3 text-2xl leading-snug">Instruments on the sea ice</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            I installed, operated, and maintained an automatic weather station
            on the sea ice, along with visible and infrared cameras for
            continuous environmental and ice monitoring. A radiometer was
            deployed to measure surface radiation fluxes relevant to the
            local surface energy balance. Every deployment involved
            calibration, on-site troubleshooting, and daily checks in Arctic
            winter conditions.
          </p>
        </div>
        <div>
          <p className="eyebrow">02 · Data & integration</p>
          <h2 className="mt-3 text-2xl leading-snug">From observation to model</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            The in-situ records were validated and quality-controlled on
            return, then used as a ground-truth reference for satellite
            retrievals and ERA5 reanalysis over Labrador. The same
            observations anchor comparisons with CESM simulations, helping
            translate a single winter's data into sharper regional
            projections of sea-ice change.
          </p>
        </div>
        <div>
          <p className="eyebrow">03 · Community engagement</p>
          <h2 className="mt-3 text-2xl leading-snug">In conversation with Nunatsiavut</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            The campaign was carried out in close collaboration with
            researchers and local partners in Nain. I presented the research
            objectives, methods, findings, and community relevance to the
            Nunatsiavut Research Centre — an exchange that shaped how the
            work is framed and communicated back to the region.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-t border-border bg-mist/40">
        <div className="container-prose py-20">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow">Field notebook</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif">
                A short visual record
              </h2>
            </div>
            <p className="hidden sm:block text-xs text-muted-foreground max-w-xs text-right">
              Click any photograph to open the lightbox. Use ← → to move
              between images, Esc to close.
            </p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {NAIN_GALLERY.map((photo, i) => (
              <li
                key={photo.src}
                className={
                  photo.orientation === "panorama"
                    ? "col-span-2 md:col-span-3"
                    : photo.orientation === "portrait"
                      ? "row-span-2"
                      : ""
                }
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group block w-full h-full overflow-hidden rounded-sm border border-border bg-mist focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Open photo ${i + 1}: ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className={
                      "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] " +
                      (photo.orientation === "panorama"
                        ? "aspect-[3/1]"
                        : photo.orientation === "portrait"
                          ? "aspect-[3/4]"
                          : "aspect-[4/3]")
                    }
                  />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground italic">
            Selected photographs from the February 2024 campaign. Additional
            imagery is retained in the project archive.
          </p>
        </div>
      </section>

      {/* Back nav */}
      <section className="container-prose py-16 flex flex-wrap justify-between items-center gap-4 border-t border-border">
        <Link to="/research" className="hover-underline text-navy-deep text-sm">
          ← Back to Research
        </Link>
        <Link to="/contact" className="hover-underline text-navy-deep text-sm">
          Get in touch about this work →
        </Link>
      </section>

      <PhotoLightbox
        photos={NAIN_GALLERY}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </SiteLayout>
  );
}