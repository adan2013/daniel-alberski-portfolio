import type { ButtonHTMLAttributes } from "react";
import { cx } from "./class-names";

export function FilterButton({
  selected,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      className={cx(
        "relative isolate flex min-w-0 gap-3 overflow-hidden border border-field bg-white p-4 text-left transition-colors duration-320 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-[var(--curtain-color,var(--text))] before:transition-transform before:duration-320 before:ease-out before:content-[''] hover:border-accent hover:text-white hover:before:scale-y-100 focus-visible:border-accent focus-visible:text-white focus-visible:before:scale-y-100 disabled:pointer-events-none disabled:opacity-50 group/filter [--filter-selected:color-mix(in_srgb,var(--accent)_88%,black)] [--curtain-color:var(--accent)] hover:[&_.filter-muted]:text-white focus-visible:[&_.filter-muted]:text-white aria-pressed:border-(--filter-selected) aria-pressed:bg-(--filter-selected) aria-pressed:text-white aria-pressed:[--curtain-color:var(--filter-selected)]",
        className,
      )}
      aria-pressed={selected}
      {...props}
    />
  );
}
