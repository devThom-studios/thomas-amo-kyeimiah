import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "Curriculum Vitae — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Curriculum vitae of Thomas Amo Kyeimiah — atmospheric and climate data scientist.",
      },
      { property: "og:title", content: "CV — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Education, appointments, publications, awards, and service." },
      { property: "og:url", content: "/cv" },
    ],
    links: [{ rel: "canonical", href: "/cv" }],
  }),
  component: CV,
});

function Row({
  left,
  children,
}: {
  left: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[5rem_1fr] md:grid-cols-[7rem_1fr] gap-4 md:gap-8 py-3 border-t border-border">
      <span className="text-sm text-muted-foreground font-mono pt-0.5">{left}</span>
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl border-b border-navy-deep pb-3">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CV() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Curriculum Vitae"
        title="Curriculum Vitae"
        lead="A summary version is below. A full PDF is available on request."
      />
      <div className="container-prose py-16 space-y-16 max-w-4xl">
        <div className="flex flex-wrap gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-navy-deep text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-navy transition-colors"
          >
            Download PDF
          </a>
          <a
            href="mailto:thomas.amokyeimiah@example.edu"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-navy-deep transition-colors"
          >
            Request full CV
          </a>
        </div>

        <Block title="Education">
          <Row left="2023 – present">
            <p className="font-serif text-navy-deep text-lg">Ph.D., Atmospheric Sciences</p>
            <p className="text-sm text-muted-foreground">Dissertation: Data-driven perspectives on the West African monsoon.</p>
          </Row>
          <Row left="2021 – 2023">
            <p className="font-serif text-navy-deep text-lg">M.Sc., Meteorology and Climate Science</p>
            <p className="text-sm text-muted-foreground">Thesis awarded with distinction.</p>
          </Row>
          <Row left="2017 – 2021">
            <p className="font-serif text-navy-deep text-lg">B.Sc., Physics</p>
            <p className="text-sm text-muted-foreground">First-class honours.</p>
          </Row>
        </Block>

        <Block title="Appointments">
          <Row left="2024 – now">
            Research Assistant, Climate Dynamics Group
          </Row>
          <Row left="2023 – 2024">
            Visiting Researcher, Regional Climate Programme
          </Row>
          <Row left="2022 – 2023">
            Data Science Fellow, African Climate & Development Initiative
          </Row>
        </Block>

        <Block title="Awards & Fellowships">
          <Row left="2025">WCRP Early Career Researcher Award</Row>
          <Row left="2024">AGU Outstanding Student Presentation Award</Row>
          <Row left="2023">Graduate Fellowship in Climate Science</Row>
          <Row left="2021">Dean's Award for Excellence in Physics</Row>
        </Block>

        <Block title="Selected service">
          <Row left="2024 – now">Reviewer, Journal of Climate; Geophysical Research Letters</Row>
          <Row left="2024">Session convener, EGU General Assembly</Row>
          <Row left="2023 – now">Mentor, ClimateMatch Academy</Row>
        </Block>

        <Block title="Technical skills">
          <Row left="Languages">Python (expert), Fortran, R, SQL, TypeScript</Row>
          <Row left="Modelling">CESM/CAM, WRF, xarray, PyTorch, JAX</Row>
          <Row left="Geospatial">GDAL, rasterio, cartopy, STAC, MapLibre</Row>
          <Row left="Compute">Slurm/HPC, Dask, AWS, DuckDB</Row>
        </Block>
      </div>
    </SiteLayout>
  );
}
