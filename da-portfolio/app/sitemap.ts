import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { localizedPath, projectPath } from "@/lib/localized-routes";
export default function sitemap(): MetadataRoute.Sitemap {
  return (["pl", "en"] as const).flatMap((locale) => [
    { url: `https://danielalberski.adanit.pl${localizedPath(locale)}` },
    ...projects
      .filter((p) => p.caseStudy)
      .map((p) => ({
        url: `https://danielalberski.adanit.pl${projectPath(locale, p.slug)}`,
      })),
  ]);
}
