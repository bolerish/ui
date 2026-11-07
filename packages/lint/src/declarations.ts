import { isAllowedLiteral, policies, type Group } from "./token-policy.js";

export type Declaration = { property: string; value: string; line: number; column: number };
export type UnreviewedDeclaration = Declaration & { reason: string };
export type DeclarationDiagnostic = Declaration & {
  ruleId: string;
  group: Group;
  tokens: string;
  foundation: string;
  message: string;
};

const properties = new Map(
  Object.entries(policies).flatMap(([group, policy]) =>
    policy.properties.flatMap((property) => {
      const entry = { group: group as Group, property };
      return [
        [property.toLowerCase(), entry],
        [property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), entry],
      ] as const;
    }),
  ),
);
const shorthands =
  /^(background|font|border(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|outline|text-decoration|column-rule)$/;

/** Diagnose parsed declarations. This does not parse CSS or resolve variable provenance. */
export function checkDeclarations(declarations: readonly Declaration[]) {
  const diagnostics: DeclarationDiagnostic[] = [];
  const unreviewed: UnreviewedDeclaration[] = [];
  let checked = 0;
  let outsideScope = 0;
  for (const declaration of declarations) {
    const name = declaration.property.trim().toLowerCase();
    if (name.startsWith("--") || shorthands.test(name) || name.startsWith("-")) {
      unreviewed.push({
        ...declaration,
        reason: name.startsWith("--") ? "custom-property" : "unsupported-property",
      });
      continue;
    }
    const entry = properties.get(name);
    if (!entry) {
      outsideScope++;
      continue;
    }
    const value = declaration.value
      .trim()
      .replace(/\s*!important\s*$/i, "")
      .trim()
      .toLowerCase();
    // Functions, comments and quoted strings need a value parser or token provenance.
    // Never accept their contents as a complete static token check.
    if (/[()'"\\]/.test(value) || value.includes("/*")) {
      unreviewed.push({ ...declaration, reason: "unresolved-value" });
      continue;
    }
    checked++;
    const { group, property } = entry;
    const policy = policies[group];
    const maximum = /^(margin|padding|borderColor)$/.test(property)
      ? 4
      : /^(margin|padding|border)(Inline|Block)(Color)?$/.test(property) || property === "gap"
        ? 2
        : 1;
    const parts = value.split(/\s+/);
    if (parts.length <= maximum && parts.every((part) => isAllowedLiteral(group, property, part)))
      continue;
    const tokens = policy.recommendations?.[property] ?? policy.tokens;
    diagnostics.push({
      ...declaration,
      ruleId: `bolerish-ui/${group}-tokens`,
      group,
      tokens,
      foundation: policy.foundation,
      message: `Use ${tokens} for ${declaration.property}; review the semantic role before replacing ${declaration.value}.`,
    });
  }
  return {
    diagnostics,
    coverage: {
      declarations: declarations.length,
      checked,
      outsideScope,
      unreviewed,
      complete: checked > 0 && unreviewed.length === 0,
    },
  };
}
