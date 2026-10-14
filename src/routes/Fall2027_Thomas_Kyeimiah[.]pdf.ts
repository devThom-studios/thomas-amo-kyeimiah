import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Serves the PhD application PDF at /Fall2027_Thomas_Kyeimiah.pdf with an
// X-Robots-Tag: noindex header so search engines do not index the file.
// The bytes live as a static file at /assets/Fall2027_Thomas_Kyeimiah.pdf;
// this route proxies them so the clean URL carries the noindex header.
// Deliberately not linked from any navigation or page.
export const Route = createFileRoute("/Fall2027_Thomas_Kyeimiah.pdf")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const assetUrl = new URL("/assets/Fall2027_Thomas_Kyeimiah.pdf", request.url);
        const upstream = await fetch(assetUrl);
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Fall2027_Thomas_Kyeimiah.pdf"',
            "X-Robots-Tag": "noindex, nofollow",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
