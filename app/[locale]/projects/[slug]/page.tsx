import { notFound } from "next/navigation";
import { caseStudyAnimations } from "@/components/case-study-animations";
import { CaseStudy } from "@/components/case-study";
import { locales } from "@/lib/i18n";
import { projects, projectName } from "@/lib/projects";
import { getRequestI18n } from "@/lib/request-i18n";
import { languageAlternates } from "@/lib/localized-routes";
import { socialMetadata } from "@/lib/site-metadata";

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

  const title = projectName(project, locale);
  const description = project.premise[locale];
  return {
    title,
    description,
    alternates: languageAlternates(locale, `/projects/${slug}`),
    ...socialMetadata(locale, {
      title: `${title} — Daniel Alberski`,
      description,
      pathname: `/projects/${slug}`,
      type: "article",
    }),
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
  const Animation = caseStudyAnimations[project.slug];
  return (
    <CaseStudy
      key={project.slug}
      project={project}
      locale={locale}
      animation={Animation ? <Animation locale={locale} /> : null}
    />
  );
}
