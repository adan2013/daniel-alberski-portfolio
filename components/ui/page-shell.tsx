import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./class-names";

type ShellElement = "div" | "footer" | "main" | "section";
type PageShellProps<T extends ShellElement> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function PageShell<T extends ShellElement = "div">({
  as,
  className,
  children,
  ...props
}: PageShellProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cx(
        "shell mx-auto w-[calc(100%-112px)] max-w-332 max-desktop:w-[calc(100%-64px)] max-tablet:w-[calc(100%-48px)] max-mobile:w-[calc(100%-40px)] print:w-full",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
