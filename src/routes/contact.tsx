import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { SOCIALS } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Thomas Amo Kyeimiah" },
      {
        name: "description",
        content:
          "Get in touch with Thomas Amo Kyeimiah about research collaboration, teaching, or scientific writing.",
      },
      { property: "og:title", content: "Contact — Thomas Amo Kyeimiah" },
      { property: "og:description", content: "Get in touch about research, teaching, or writing." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        lead="I welcome messages about research collaboration, PhD supervision opportunities, invited talks, teaching, and scientific writing."
      />
      <section className="container-prose py-20 grid gap-16 md:grid-cols-2 max-w-5xl">
        <div className="space-y-8">
          <div>
            <p className="eyebrow mb-2">Email</p>
            <a href={SOCIALS.email} className="text-2xl font-serif text-navy-deep hover-underline">
              thomas.amokyeimiah@example.edu
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              I typically reply within one to two working days.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Elsewhere</p>
            <ul className="space-y-2 text-base">
              <li>
                <a href={SOCIALS.scholar} target="_blank" rel="noreferrer" className="hover-underline">
                  Google Scholar →
                </a>
              </li>
              <li>
                <a href={SOCIALS.orcid} target="_blank" rel="noreferrer" className="hover-underline">
                  ORCID →
                </a>
              </li>
              <li>
                <a href={SOCIALS.github} target="_blank" rel="noreferrer" className="hover-underline">
                  GitHub →
                </a>
              </li>
              <li>
                <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover-underline">
                  LinkedIn →
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-2">Mailing address</p>
            <address className="not-italic text-base leading-relaxed text-foreground/85">
              Department of Atmospheric Sciences
              <br />
              Climate Dynamics Group
              <br />
              University Campus, Building 6
            </address>
          </div>
        </div>
        <form
          className="rounded-md border border-border bg-card p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            const body = encodeURIComponent(String(data.get("message") ?? ""));
            const subject = encodeURIComponent(
              `Website message from ${String(data.get("name") ?? "")}`,
            );
            window.location.href = `mailto:thomas.amokyeimiah@example.edu?subject=${subject}&body=${body}`;
          }}
        >
          <div>
            <label htmlFor="name" className="eyebrow block mb-2">Name</label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="email" className="eyebrow block mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="message" className="eyebrow block mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-navy-deep text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-navy transition-colors"
          >
            Send message
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
