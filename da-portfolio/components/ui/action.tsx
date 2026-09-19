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
    const content = actionContent(variant, children);
    const {
      target: requestedTarget,
      rel: requestedRel,
      ...restAnchorProps
    } = anchorProps;
    const externalLink = /^(?:https?:)?\/\//.test(href);
    const target = requestedTarget ?? (externalLink ? "_blank" : undefined);
    const rel =
      requestedRel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

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
