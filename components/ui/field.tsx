import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "./class-names";

export function Field({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "field w-full min-h-11.5 rounded-none border border-field bg-white px-3.25 py-2.75 text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "field block w-full min-h-11.5 resize-y rounded-none border border-field bg-white px-3.25 py-2.75 text-ink",
        className,
      )}
      {...props}
    />
  );
}
