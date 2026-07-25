import { createFileRoute } from "@tanstack/react-router";
import portrait from "@/assets/portrait.jpg";
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
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title="An atmospheric scientist working at the intersection of physics, data, and place."
        lead="I use climate models, observations, and machine learning to understand how the atmosphere behaves — and how those dynamics matter for the people who live beneath it."
      />
      <section className="container-prose py-20 md:py-28 grid gap-16 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85 max-w-2xl">
          <p>
            I am an atmospheric scientist and climate data scientist. My research
            focuses on the physical dynamics of the West African monsoon, the
            role of land–atmosphere interactions in regional climate, and the
            development of physics-constrained machine-learning methods for
            Earth system modelling.
          </p>
          <p>
            My work draws on high-resolution climate simulations, reanalyses,
            satellite observations, and long station records. I care deeply
            about how methodological choices — bias correction, downscaling,
            evaluation — propagate into the conclusions we draw about future
            climate, and about building open tools that make those choices
            legible to other researchers.
          </p>
          <p>
            Beyond research, I write about climate science for general
            audiences, mentor students at earlier stages of the pipeline, and
            contribute to open-source scientific software.
          </p>
          <div className="pt-6 grid sm:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow mb-2">Education</p>
              <ul className="space-y-2 text-base">
                <li>Ph.D. Candidate, Atmospheric Sciences</li>
                <li>M.Sc. Meteorology and Climate Science</li>
                <li>B.Sc. Physics</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2">Affiliations</p>
              <ul className="space-y-2 text-base">
                <li>Climate Dynamics Group</li>
                <li>African Climate & Development Initiative</li>
                <li>WCRP Early Career Researcher</li>
              </ul>
            </div>
          </div>
        </div>
        <aside>
          <div className="rounded-md overflow-hidden border border-border bg-mist">
            <img
              src={portrait}
              alt="Portrait of Thomas Amo Kyeimiah."
              width={900}
              height={1100}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            Portrait, 2025.
          </p>
        </aside>
      </section>
    </SiteLayout>
  );
}
