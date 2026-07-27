import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import portrait from "@/assets/thomas-winter-montreal.jpg.asset.json";
import { SiteLayout, PageHero } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Biography, training, and research philosophy of Thomas Amo Kyeimiah, atmospheric and climate data scientist.",
      },
      { property: "og:title", content: "About — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Biography, training, and research philosophy." },
      { property: "og:url", content: "https://kyeimiahlab.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://kyeimiahlab.com/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        variant="about"
        eyebrow="About"
        title="Atmospheric and climate data scientist working across polar, tropical, and computational climate science."
        lead="From sea ice on the Labrador coast to malaria transmission in Ghana, I use climate models, reanalyses, and reproducible Python workflows to understand a changing Earth system."
      />
      <section className="container-prose py-20 md:py-28 grid gap-16 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85 max-w-2xl">
          <p>
            I am a recent M.Sc. graduate in Atmospheric and Oceanic Sciences
            from McGill University, with a First-Class B.Sc. in Meteorology and
            Climate Science from Kwame Nkrumah University of Science and
            Technology (KNUST). My graduate thesis, supervised by Prof. Bruno
            Tremblay, projected sea-ice conditions in Nunatsiavut (Labrador)
            using CESM-HR climate model output alongside Canadian Ice Service
            observations.
          </p>
          <p>
            My research sits at the interface of climate dynamics,
            hydroclimatology, and predictive modelling. I work with large
            observational, reanalysis, and climate-model datasets to study
            atmospheric, oceanic, and environmental processes — from CMIP6
            sea-ice evaluation with Environment and Climate Change Canada to
            climate–health interactions across Ghana's agro-ecological zones.
          </p>
          <p>
            I have strong programming and analytical skills in Python, R, and
            Fortran, and I care about reproducibility, clear scientific
            communication, and mentoring the next generation of climate
            scientists. Alongside research, I currently review AI-generated
            scientific workflows and data visualisations for technical accuracy
            and reproducibility.
          </p>
          <p>
            In February 2024 I travelled to Nain, Nunatsiavut, for the{" "}
            <Link to="/fieldwork/nain-2024" className="hover-underline text-navy-deep">
              Nain field campaign
            </Link>
            , installing instruments on the sea ice and working with researchers and local partners in Labrador.
          </p>
          <div className="pt-6 grid sm:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow mb-2">Education</p>
              <ul className="space-y-2 text-base">
                <li>M.Sc. Atmospheric &amp; Oceanic Sciences, McGill University (2024)</li>
                <li>B.Sc. Meteorology &amp; Climate Science, KNUST (First-Class Honours, 2021)</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2">Affiliations</p>
              <ul className="space-y-2 text-base">
                <li>American Geophysical Union (AGU)</li>
                <li>Ghana Meteorological Society (GhMS)</li>
                <li>Council of Atmospheric &amp; Oceanic Sciences Student Assoc. (McGill)</li>
              </ul>
            </div>
          </div>
        </div>
        <aside>
          <div className="rounded-md overflow-hidden border border-border bg-mist aspect-[900/1100]">
            <img
              src={portrait.url}
              alt="Thomas Amo Kyeimiah outdoors in Montreal during winter."
              width={1990}
              height={2048}
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            Montreal, 2023.
          </p>
        </aside>
      </section>
    </SiteLayout>
  );
}
