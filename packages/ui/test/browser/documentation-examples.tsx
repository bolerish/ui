import type { ComponentType } from "react";

const examples = import.meta.glob<{ default: ComponentType }>(
  "../../../../docs/src/docs/_content/components/*/Default.tsx",
  { eager: true },
);

export function DocumentationExample({ name }: { name: string }) {
  const module = Object.entries(examples).find(([path]) =>
    path.endsWith("/" + name + "/Default.tsx"),
  )?.[1];
  if (!module) throw new Error("Unknown Default example: " + name);
  const Example = module.default;
  const keyboardBoundary = name === "tabs" || new URLSearchParams(location.search).has("keyboard");
  const Container = name === "sidebar" ? "div" : "main";
  return (
    <Container>
      <header>
        <h1>{name} example</h1>
      </header>
      {keyboardBoundary ? <button data-testid="before-example">Before example</button> : null}
      <section
        data-testid="documentation-example"
        aria-label={name}
        style={{ marginBlock: 24, ...(name === "sidebar" ? { height: 400 } : {}) }}
      >
        <Example />
      </section>
      {keyboardBoundary ? <button data-testid="after-example">After example</button> : null}
    </Container>
  );
}
