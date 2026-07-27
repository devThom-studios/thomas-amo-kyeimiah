import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { SOCIALS } from "@/data/site";
import { useState } from "react";

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
      { property: "og:url", content: "https://kyeimiahlab.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://kyeimiahlab.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xdaqyeon", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <SiteLayout>
      <PageHero
        variant="contact"
        eyebrow="Contact"
        title="Get in touch."
        lead="I welcome messages about research collaboration, PhD supervision opportunities, invited talks, teaching, and scientific writing."
      />
      <section className="container-prose py-20 grid gap-16 md:grid-cols-2 max-w-5xl">
        <div className="space-y-8">
          <div>
            <p className="eyebrow mb-2">Email</p>
            <a href={SOCIALS.email} className="text-2xl font-serif text-navy-deep hover-underline break-all">
              {SOCIALS.emailAddress}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              I typically reply within one to two working days.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Elsewhere</p>
            <ul className="space-y-2 text-base">
              <li>
                <a href={SOCIALS.scholar} target="_blank" rel="noopener noreferrer" className="hover-underline">
                  Google Scholar →
                </a>
              </li>
              <li>
                <a href={SOCIALS.orcid} target="_blank" rel="noopener noreferrer" className="hover-underline">
                  ORCID →
                </a>
              </li>
              <li>
                <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="hover-underline">
                  GitHub →
                </a>
              </li>
              <li>
                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="hover-underline">
                  LinkedIn →
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-2">Phone</p>
            <p className="text-base text-foreground/85">{SOCIALS.phone}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Based in</p>
            <address className="not-italic text-base leading-relaxed text-foreground/85">
              {SOCIALS.location}
            </address>
          </div>
        </div>
        <form
          className="rounded-md border border-border bg-card p-8 space-y-5"
          onSubmit={handleSubmit}
        >
          {/* Honeypot — hidden from real users; bots that fill it get filtered. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div>
            <label htmlFor="name" className="eyebrow block mb-2">Name</label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
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
              autoComplete="email"
              inputMode="email"
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
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 rounded-md bg-navy-deep text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
          <div aria-live="polite" role="status" className="min-h-[1.25rem] text-sm">
            {status === "success" && (
              <p className="text-navy-deep">Thank you—your message has been sent.</p>
            )}
            {status === "error" && (
              <p className="text-destructive">
                Something went wrong. Please try again or email{" "}
                <a href={SOCIALS.email} className="hover-underline">
                  {SOCIALS.emailAddress}
                </a>{" "}
                directly.
              </p>
            )}
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}
