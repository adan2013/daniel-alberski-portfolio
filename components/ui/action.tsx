import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";
import { cx } from "./class-names";
import "./action.css";

type ActionVariant = "ghost" | "inline" | "primary" | "curtain";
type ActionTone = "default" | "accent";
type ActionCommonProps = {
  variant?: ActionVariant;
  tone?: ActionTone;
  className?: string;
  children: ReactNode;
};
type ActionAnchorProps = ActionCommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className" | "href"> & {
    href: string;
  };
type ActionButtonProps = ActionCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };
type ActionProps = ActionAnchorProps | ActionButtonProps;

const ghostClasses =
  "ghost-link relative isolate inline-block overflow-hidden rounded-none p-3 leading-none no-underline";
const inlineClasses =
  "inline-link relative isolate inline-block text-ink underline decoration-field underline-offset-4 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:-z-10 before:h-full before:origin-bottom before:scale-y-[0.08] before:bg-soft before:transition-transform before:duration-320 before:ease-out before:content-[''] hover:before:scale-y-100 focus-visible:before:scale-y-100";
const animatedActionClasses =
  "relative isolate inline-flex items-center overflow-hidden rounded-none p-3 no-underline transition-colors duration-320 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-320 before:ease-out before:content-[''] hover:text-white hover:before:scale-y-100 focus-visible:text-white focus-visible:before:scale-y-100 group/action";
const actionVariantClasses: Record<ActionVariant, string> = {
  ghost: ghostClasses,
  inline: inlineClasses,
  primary: cx(
    animatedActionClasses,
    "min-h-12 justify-center border border-accent bg-accent text-[14px] font-medium text-white before:bg-[color-mix(in_srgb,var(--accent)_88%,black)]",
  ),
  curtain: cx(
    animatedActionClasses,
    "min-h-11 before:bg-[var(--curtain-color,var(--text))]",
  ),
};
const actionToneClasses: Record<ActionTone, string> = {
  default: "",
  accent: "[--curtain-color:var(--accent)]",
};

function ActionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="transition-transform duration-320 ease-out motion-safe:group-hover/action:-translate-y-0.5 motion-safe:group-focus-visible/action:-translate-y-0.5">
      {children}
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="github-icon size-[1.1em] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.29c.98 0 1.95.13 2.87.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.28 5.68.42.36.78 1.07.78 2.16v3.05c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

function actionContent(variant: ActionVariant, children: ReactNode) {
  return variant === "primary" || variant === "curtain" ? (
    <ActionLabel>{children}</ActionLabel>
  ) : (
    children
  );
}

export function Action(props: ActionProps) {
  if ("href" in props && props.href !== undefined) {
    const {
      href,
      variant = "ghost",
      tone = "default",
      className,
      children,
      ...anchorProps
    } = props;
    const classes = cx(
      actionVariantClasses[variant],
      actionToneClasses[tone],
      className,
    );
    const {
      target: requestedTarget,
      rel: requestedRel,
      ...restAnchorProps
    } = anchorProps;
    const externalLink = /^(?:https?:)?\/\//.test(href);
    const target = requestedTarget ?? (externalLink ? "_blank" : undefined);
    const rel =
      requestedRel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    const isGitHubLink = /^(?:https?:)?\/\/(?:www\.)?github\.com(?:\/|$)/i.test(
      href,
    );
    const labeledContent = isGitHubLink ? (
      <span className="inline-flex items-center gap-2">
        <GitHubIcon />
        {children}
      </span>
    ) : (
      children
    );
    const content = actionContent(variant, labeledContent);

    return href.startsWith("/") && !href.startsWith("//") ? (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        {...restAnchorProps}
      >
        {content}
      </Link>
    ) : (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
        {...restAnchorProps}
      >
        {content}
      </a>
    );
  }

  const {
    variant = "primary",
    tone = "default",
    className,
    children,
    ...buttonProps
  } = props;
  return (
    <button
      type="button"
      className={cx(
        actionVariantClasses[variant],
        actionToneClasses[tone],
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...buttonProps}
    >
      {actionContent(variant, children)}
    </button>
  );
}
