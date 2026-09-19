import type { HTMLAttributes } from "react";
import { cx } from "./class-names";

export function Eyebrow({
  layout = "block",
  size = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  layout?: "block" | "flex";
  size?: "default" | "hero";
}) {
  return (
    <span
      className={cx(
        "eyebrow text-[12px] leading-normal font-medium tracking-[0.13em]",
        layout === "flex" ? "flex items-center" : "block",
        size === "hero"
          ? "max-mobile:text-[8px] max-mobile:tracking-[0.085em]"
          : "max-mobile:text-[10px] max-mobile:tracking-[0.11em]",
        className,
      )}
      {...props}
    />
  );
}
