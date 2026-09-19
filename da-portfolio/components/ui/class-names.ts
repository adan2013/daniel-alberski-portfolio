type ClassName = string | false | null | undefined;

export function cx(...classNames: ClassName[]) {
  return classNames.filter(Boolean).join(" ");
}
