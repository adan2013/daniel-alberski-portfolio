import type { HTMLAttributes } from "react";
import { cx } from "./class-names";

export function TagList({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "tags flex flex-wrap gap-1.5 [&>span]:border [&>span]:border-line [&>span]:px-2.25 [&>span]:py-0.75 [&>span]:text-[11px] [&>span]:text-muted",
        className,
      )}
      {...props}
    />
  );
}
