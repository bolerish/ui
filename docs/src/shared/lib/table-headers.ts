import { Children, isValidElement, type ReactNode } from "react";

function textContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      return isValidElement<{ children?: ReactNode }>(child)
        ? textContent(child.props.children)
        : "";
    })
    .join("");
}

export function tableHeaders(children: ReactNode): string[] {
  const head = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === "thead",
  );
  if (!isValidElement<{ children?: ReactNode }>(head)) return [];
  const row = Children.toArray(head.props.children).find(
    (child) => isValidElement(child) && child.type === "tr",
  );
  if (!isValidElement<{ children?: ReactNode }>(row)) return [];
  return Children.toArray(row.props.children).filter(isValidElement).map(textContent);
}
