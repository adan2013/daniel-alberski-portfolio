import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import "./case-study-story.css";

export function CaseStudyStory({
  children,
  animation,
  locale,
}: {
  children: ReactNode;
  animation?: ReactNode;
  locale: Locale;
}) {
  return (
    <div className="case-story" data-has-animation={Boolean(animation)}>
      {animation ? (
        <section
          className="case-animation"
          aria-label={locale === "pl" ? "Animacja" : "Animation"}
        >
          {animation}
        </section>
      ) : null}
      {children}
    </div>
  );
}
