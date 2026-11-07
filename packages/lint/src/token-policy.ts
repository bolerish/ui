import foundations from "./foundations.json" with { type: "json" };

export type Group = "color" | "typography" | "spacing";
export type Policy = {
  foundation: string;
  tokens: string;
  properties: readonly string[];
  keywords: readonly string[];
  recommendations?: Readonly<Record<string, string>>;
  relativeUnits?: Readonly<Record<string, readonly string[]>>;
};

export const policies: Record<Group, Policy> = foundations;
const globalKeywords = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);

function isRelativeValue(policy: Policy, property: string, value: string): boolean {
  const units = policy.relativeUnits?.[property];
  if (!units) return false;
  const parts = value.split(/\s+/);
  const maximum =
    property === "margin" ? 4 : ["marginInline", "marginBlock", "gap"].includes(property) ? 2 : 1;
  if (parts.length > maximum) return false;
  return parts.every((part) => {
    if (property.startsWith("margin") && part === "auto") return true;
    const match = part.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(em)?$/);
    if (!match) return false;
    const amount = Number(match[1]);
    if (
      amount === 0 &&
      (property.startsWith("margin") || property.endsWith("Gap") || property === "gap")
    )
      return true;
    return (
      units.includes(match[2] ?? "number") &&
      Number.isFinite(amount) &&
      (property.startsWith("margin") || amount > 0)
    );
  });
}

export function isAllowedLiteral(group: Group, property: string, value: string): boolean {
  const policy = policies[group];
  const keywords = new Set([...globalKeywords, ...policy.keywords]);
  if (isRelativeValue(policy, property, value)) return true;
  if (keywords.has(value) || /^var\(--[\w-]+(?:\s*,[\s\S]+)?\)$/.test(value)) return true;
  return (
    group === "spacing" &&
    value
      .split(/\s+/)
      .every((part) => keywords.has(part) || /^[-+]?0(?:\.0+)?(?:px|rem|em|%)?$/.test(part))
  );
}
