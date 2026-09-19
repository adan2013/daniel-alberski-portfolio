import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { locales } from "@/lib/i18n";
import { projects, projectName } from "@/lib/projects";
import { getRequestI18n } from "@/lib/request-i18n";
import { languageAlternates } from "@/lib/localized-routes";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects
      .filter((project) => project.caseStudy)
      .map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await getRequestI18n(params);
  const project = projects.find(
    (candidate) => candidate.slug === slug && candidate.caseStudy,
  );
  if (!project) return {};

  return {
    title: projectName(project, locale),
    description: project.premise[locale],
    alternates: languageAlternates(locale, `/projects/${slug}`),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await getRequestI18n(params);
  const project = projects.find(
    (candidate) => candidate.slug === slug && candidate.caseStudy,
  );
  if (!project) notFound();
  return <CaseStudy project={project} locale={locale} />;
}
