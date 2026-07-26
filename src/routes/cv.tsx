import { createFileRoute, Link } from "@tanstack/react-router";
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
        lead="A summary version is below. The full PDF is available on request."
      />
      <div className="container-prose py-16 space-y-16 max-w-4xl">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-navy-deep transition-colors"
        >
          Request full CV
        </Link>

        <Block title="Education">
          <Row left="2022 – 2024">
            <p className="font-serif text-navy-deep text-lg">M.Sc., Atmospheric and Oceanic Sciences</p>
            <p className="text-sm text-muted-foreground">McGill University, Montreal, Quebec, Canada.</p>
            <p className="text-sm text-muted-foreground">Thesis: Projection of Sea Ice Condition in Nunatsiavut (Labrador). Advisor: Prof. Bruno Tremblay.</p>
          </Row>
          <Row left="2017 – 2021">
            <p className="font-serif text-navy-deep text-lg">B.Sc., Meteorology and Climate Science (First-Class Honours)</p>
            <p className="text-sm text-muted-foreground">Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana.</p>
            <p className="text-sm text-muted-foreground">Thesis: Impact of Climate Change on Vectorial Capacity of Malaria Vectors. Advisor: Dr. Edmund I. Yamba.</p>
          </Row>
        </Block>

        <Block title="Appointments">
          <Row left="2026 – now">
            Senior Reviewer, AI Data &amp; Scientific Visualization (Remote)
          </Row>
          <Row left="Jun – Aug 2024">
            Research Assistant, Environment and Climate Change Canada
          </Row>
          <Row left="2023 – 2024">
            Teaching Assistant, Dept. of Atmospheric &amp; Oceanic Sciences, McGill University
          </Row>
          <Row left="2021 – 2022">
            Teaching &amp; Research Assistant, Dept. of Physics, KNUST
          </Row>
          <Row left="Jun – Jul 2019">
            Intern, Ghana Meteorological Agency (GMet), Accra
          </Row>
        </Block>

        <Block title="Awards & Fellowships">
          <Row left="2024">Full funding — ICTP School and Workshop on Polar Climates, Trieste, Italy</Row>
          <Row left="2022 – 2024">Graduate Excellence Award, McGill University</Row>
          <Row left="2022 – 2023">Anti-Black Racism Initiative Graduate Excellence Recruitment Award, McGill</Row>
          <Row left="2021">Winner — Final-Year Poster Presentation, KNUST</Row>
        </Block>

        <Block title="Service & Memberships">
          <Row left="2023 – now">Member, American Geophysical Union (AGU)</Row>
          <Row left="2022 – now">Member, Ghana Meteorological Society (GhMS)</Row>
          <Row left="2022 – 2024">Member, Council of Atmospheric &amp; Oceanic Sciences (CAOS) Student Association, McGill</Row>
          <Row left="2021">2nd Deputy Electoral Commissioner, Queen Elizabeth II Hall, KNUST</Row>
          <Row left="2021">Weather Forecaster (volunteer), Countryside Radio, Kumasi, Ghana</Row>
        </Block>

        <Block title="Technical skills">
          <Row left="Programming">Python, R, FORTRAN, JavaScript, Bash, CDO, NCL</Row>
          <Row left="Data & ML">Xarray, Pandas, NumPy, Scikit-Learn, Matplotlib, Cartopy, GeoPandas, ParaView</Row>
          <Row left="Climate data">CESM, CMIP6, WRF, ERA5, PRISM, NetCDF, hydroclimatology, climate diagnostics</Row>
          <Row left="GIS & tools">ArcGIS, QGIS, Git, LaTeX, HTML/CSS, Power BI, MS Office, Google Workspace</Row>
          <Row left="Languages">English (fluent), French (beginner)</Row>
        </Block>
      </div>
    </SiteLayout>
  );
}
