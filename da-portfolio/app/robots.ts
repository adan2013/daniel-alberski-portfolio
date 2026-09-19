import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/submit", "/en/submit"] },
    sitemap: "https://danielalberski.adanit.pl/sitemap.xml",
  };
}
