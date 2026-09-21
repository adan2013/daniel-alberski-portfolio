import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale, Project } from "./projects";
export async function readCaseStudy(project: Project, locale: Locale) {
  if (!project.caseStudy) throw new Error("Not a case study");
  return readFile(
    path.join(process.cwd(), "content", locale, project.caseStudy + ".md"),
    "utf8",
  );
}
