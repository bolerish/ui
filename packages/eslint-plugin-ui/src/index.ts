import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { ESLint, Rule } from "eslint";

import foundations from "./foundations.json" with { type: "json" };

type Group = "color" | "typography" | "spacing";
type Policy = {
  foundation: string;
  tokens: string;
  properties: readonly string[];
  keywords: readonly string[];
  recommendations?: Readonly<Record<string, string>>;
  relativeUnits?: Readonly<Record<string, readonly string[]>>;
};
type Preset = Group | "recommended";
type PresetConfig = {
  name: string;
  plugins: Record<string, Omit<ESLint.Plugin, "configs">>;
  rules: Record<string, "warn">;
};
type LiteralValue = { node: TSESTree.Node; value: string | number };

const policies: Record<Group, Policy> = foundations;
const globalKeywords = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);

function propertyName(node: TSESTree.Property): string | null {
  if (!node.computed && node.key.type === "Identifier") return node.key.name;
  return node.key.type === "Literal" && typeof node.key.value === "string" ? node.key.value : null;
}

function isStylexImport(
  identifier: TSESTree.Identifier,
  sourceCode: TSESLint.SourceCode,
  imported: "namespace" | "create",
): boolean {
  for (
    let scope: TSESLint.Scope.Scope | null = sourceCode.getScope(identifier);
    scope;
    scope = scope.upper
  ) {
    const variable = scope.set.get(identifier.name);
    if (!variable) continue;
    return variable.defs.some((definition) => {
      if (
        definition.type !== "ImportBinding" ||
        definition.parent.type !== "ImportDeclaration" ||
        definition.parent.source.value !== "@stylexjs/stylex"
      )
        return false;
      const specifier = definition.node;
      return imported === "namespace"
        ? specifier.type === "ImportNamespaceSpecifier" ||
            specifier.type === "ImportDefaultSpecifier"
        : specifier.type === "ImportSpecifier" &&
            (specifier.imported.type === "Identifier"
              ? specifier.imported.name
              : specifier.imported.value) === imported;
    });
  }
  return false;
}

function isStylexCreate(node: TSESTree.CallExpression, sourceCode: TSESLint.SourceCode): boolean {
  const callee = node.callee;
  if (callee.type === "Identifier") return isStylexImport(callee, sourceCode, "create");
  return (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier" &&
    callee.property.name === "create" &&
    callee.object.type === "Identifier" &&
    isStylexImport(callee.object, sourceCode, "namespace")
  );
}

function isStyleProperty(node: TSESTree.Property, sourceCode: TSESLint.SourceCode): boolean {
  for (let parent: TSESTree.Node | undefined = node.parent; parent; parent = parent.parent) {
    if (parent.type === "JSXAttribute")
      return parent.name.type === "JSXIdentifier" && parent.name.name === "style";
    if (parent.type === "CallExpression") return isStylexCreate(parent, sourceCode);
    if (
      parent.type === "VariableDeclarator" ||
      parent.type === "AssignmentExpression" ||
      parent.type === "FunctionDeclaration" ||
      parent.type === "ClassDeclaration" ||
      parent.type === "ClassExpression"
    )
      return false;
  }
  return false;
}

function literalValues(node: TSESTree.Node): LiteralValue[] {
  if (node.type === "Literal" && (typeof node.value === "string" || typeof node.value === "number"))
    return [{ node, value: node.value }];
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    const value = node.quasis[0].value.cooked;
    return value === null ? [] : [{ node, value }];
  }
  if (
    node.type === "UnaryExpression" &&
    (node.operator === "-" || node.operator === "+") &&
    node.argument.type === "Literal" &&
    typeof node.argument.value === "number"
  )
    return [{ node, value: node.operator === "-" ? -node.argument.value : node.argument.value }];
  if (node.type === "ConditionalExpression")
    return [...literalValues(node.consequent), ...literalValues(node.alternate)];
  if (node.type === "LogicalExpression")
    return [...literalValues(node.left), ...literalValues(node.right)];
  if (node.type === "ArrayExpression")
    return node.elements.flatMap((element) => (element ? literalValues(element) : []));
  if (
    node.type === "TSAsExpression" ||
    node.type === "TSSatisfiesExpression" ||
    node.type === "TSNonNullExpression"
  )
    return literalValues(node.expression);
  return [];
}

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

function createTokenRule(group: Group, policy: Policy): Rule.RuleModule {
  const properties = new Set(policy.properties);
  const keywords = new Set([...globalKeywords, ...policy.keywords]);
  const rule: TSESLint.RuleModule<"token", []> = {
    meta: {
      type: "suggestion",
      docs: {
        description: `Use Foundations ${group} tokens in custom UI`,
        url: `https://github.com/myjeong19/ui/blob/main/docs/src/app/(site)/docs/_content/foundations/${group}/guidelines.md`,
      },
      schema: [],
      messages: {
        token:
          "When setting {{property}}, use {{tokens}} tokens instead of the literal {{value}}. See {{foundation}}.",
      },
    },
    defaultOptions: [],
    create(context) {
      return {
        Property(node) {
          let property = propertyName(node);
          if (property === null || !properties.has(property)) {
            // StyleX conditional values keep the CSS property on an ancestor.
            for (
              let parent = node.parent;
              parent?.type === "ObjectExpression" && parent.parent?.type === "Property";
              parent = parent.parent.parent
            ) {
              property = propertyName(parent.parent);
              if (property !== null && properties.has(property)) break;
            }
          }
          if (
            property === null ||
            !properties.has(property) ||
            !isStyleProperty(node, context.sourceCode)
          )
            return;
          for (const literal of literalValues(node.value)) {
            const value = String(literal.value).trim().toLowerCase();
            if (isRelativeValue(policy, property, value)) continue;
            if (keywords.has(value) || /^var\(--[\w-]+(?:\s*,[\s\S]+)?\)$/.test(value)) continue;
            if (
              group === "spacing" &&
              value
                .split(/\s+/)
                .every(
                  (part) => keywords.has(part) || /^[-+]?0(?:\.0+)?(?:px|rem|em|%)?$/.test(part),
                )
            )
              continue;
            context.report({
              node: literal.node,
              messageId: "token",
              data: {
                tokens: policy.recommendations?.[property] ?? policy.tokens,
                property,
                value: context.sourceCode.getText(literal.node),
                foundation: policy.foundation,
              },
            });
          }
        },
      };
    },
  };
  // The engines share a runtime API; their JS/TS AST context types differ.
  return rule as unknown as Rule.RuleModule;
}

const groups: Group[] = ["color", "typography", "spacing"];
const plugin = {
  meta: { name: "@bolerish/eslint-plugin-ui" },
  rules: Object.fromEntries(
    groups.map((group) => [`${group}-tokens`, createTokenRule(group, policies[group])]),
  ),
  configs: {} as Record<Preset, PresetConfig>,
};
for (const group of ["recommended", ...groups] as const) {
  plugin.configs[group] = {
    name: `bolerish-ui/${group}`,
    plugins: { "bolerish-ui": plugin },
    rules: Object.fromEntries(
      Object.keys(plugin.rules)
        .filter((name) => group === "recommended" || name === `${group}-tokens`)
        .map((name) => [`bolerish-ui/${name}`, "warn"] as const),
    ),
  };
}
export default plugin;
