import { createTranslator, isLocale, locales } from "@/lib/i18n";
import {
  ogCard,
  ogContentType,
  ogSize,
  publicImageDataUrl,
} from "@/lib/og-card";
import { projects, projectName } from "@/lib/projects";

export const alt = "Daniel Alberski — case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects
      .filter((project) => project.caseStudy)
      .map((project) => ({ locale, slug: project.slug })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: param, slug } = await params;
  const locale = isLocale(param) ? param : "pl";
  const t = createTranslator(locale);
  const project = projects.find(
    (candidate) => candidate.slug === slug && candidate.caseStudy,
  );
  if (!project) return new Response(null, { status: 404 });

  const cover = project.media.find((media) => media.src?.endsWith(".jpg"));
  return ogCard({
    eyebrow: t("portfolio.projects.caseStudy"),
    title: projectName(project, locale),
    subtitle: project.premise[locale],
    footer: "Daniel Alberski · Software Developer",
    image: cover?.src ? await publicImageDataUrl(cover.src) : undefined,
  });
}
