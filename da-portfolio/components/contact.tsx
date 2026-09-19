"use client";
import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Field, TextArea } from "@/components/ui/field";
import { PageShell } from "@/components/ui/page-shell";
import { useState } from "react";
import type { Locale } from "@/lib/projects";
import { useTranslations } from "@/components/i18n-provider";
import { localizedPath } from "@/lib/localized-routes";
export function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/53a196e933c0eb7206126e31ba18fd5d",
        {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(20000),
        },
      );
      const body = await res.json();
      if (!res.ok || (body.success !== true && body.success !== "true"))
        throw new Error("Failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }
  return (
    <section
      id="contact"
      className="contact-section border-t border-line bg-soft pt-18.75 pb-15 max-mobile:pt-11 max-mobile:pb-8"
    >
      <PageShell className="contact-grid grid grid-cols-[1fr_1.1fr] gap-22.5 [&_h2]:mt-5.5 [&_h2]:mb-6 [&_h2]:text-[clamp(34px,3.4vw,49px)] [&_h2]:font-medium [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.045em] [&_h2_span]:text-muted [&>div>p]:max-w-90 [&>div>p]:text-[16px] [&_form]:pt-1.25 [&_label]:mb-2 [&_label]:block [&_label]:text-[13px] max-desktop:gap-13.75 max-tablet:grid-cols-2 max-tablet:gap-8.75 max-mobile:grid-cols-1 max-mobile:gap-9.5 max-mobile:[&_h2]:mt-5 max-mobile:[&_h2]:text-[37px] print:[&_form]:hidden">
        <div>
          <Eyebrow>04 / {t("contact.eyebrow")}</Eyebrow>
          <h2>
            {t("contact.title")}
            <br />
            <span>{t("contact.titleAccent")}</span>
          </h2>
          <p>{t("contact.description")}</p>
          <div className="contact-links mt-6 flex gap-6.5 text-[14px] max-mobile:mt-4.5">
            <Action href="https://www.linkedin.com/in/daniel-alberski/">
              LinkedIn
            </Action>
            <Action href="https://github.com/adan2013">GitHub </Action>
          </div>
        </div>
        <form
          action="https://formsubmit.co/53a196e933c0eb7206126e31ba18fd5d"
          method="POST"
          onSubmit={submit}
        >
          <div className="form-row mb-5.25 grid grid-cols-2 gap-5 max-tablet:grid-cols-1 max-tablet:gap-4">
            <div>
              <label htmlFor="name">{t("contact.name")}</label>
              <Field
                id="name"
                name="name"
                autoComplete="given-name"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>
          </div>
          <label htmlFor="message">{t("contact.message")}</label>
          <TextArea
            id="message"
            name="message"
            required
            rows={4}
            maxLength={10000}
          />
          <Field type="hidden" name="_subject" value={t("contact.subject")} />
          <Field
            type="hidden"
            name="_next"
            value={`https://danielalberski.adanit.pl${localizedPath(locale, "/submit")}`}
          />
          <div
            className="honeypot absolute size-0 overflow-hidden"
            aria-hidden="true"
          >
            <label>
              {t("contact.honeypot")}
              <Field name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="form-footer mt-5.5 flex items-center justify-between gap-4.5 [&>small]:max-w-64 [&>small]:text-[11px] [&>small]:text-muted max-desktop:flex-col max-desktop:items-start max-mobile:flex-row max-mobile:items-center max-mobile:[&>small]:max-w-34 max-mobile:[&>small]:text-[10px] max-mobile:[&>button]:gap-3.75">
            <small>
              {t("contact.provider")}{" "}
              <Action
                href="https://formsubmit.co/"
                variant="inline"
                target="_blank"
                rel="noopener noreferrer"
              >
                FormSubmit
              </Action>
              .
            </small>
            <Action type="submit" disabled={state === "sending"}>
              {state === "sending" ? t("contact.sending") : t("contact.send")}
            </Action>
          </div>
          <p
            role={state === "error" ? "alert" : "status"}
            aria-live="polite"
            data-state={state}
            className="form-status mt-4 min-h-6 text-[14px] font-medium leading-relaxed data-[state=success]:bg-ink data-[state=success]:px-4 data-[state=success]:py-3 data-[state=success]:text-white data-[state=success]:shadow-[4px_4px_0_var(--line)] data-[state=error]:border-l-4 data-[state=error]:border-[#a3182c] data-[state=error]:bg-page data-[state=error]:px-4 data-[state=error]:py-3 data-[state=error]:text-[#841a24]"
          >
            {state === "success"
              ? t("contact.success")
              : state === "error"
                ? t("contact.error")
                : ""}
          </p>
        </form>
      </PageShell>
    </section>
  );
}
