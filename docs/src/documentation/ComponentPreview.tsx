import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@bolerish/ui/tabs";
import { DocsContext } from "@storybook/addon-docs/blocks";
import * as stylex from "@stylexjs/stylex";
import { useContext, useEffect, useRef, useState, lazy, Suspense, type ComponentType } from "react";

import { CodeBlock } from "./CodeBlock";
import { ui } from "./locale";
import { useDocumentationGlobals } from "./useDocumentationGlobals";

const modules = import.meta.glob<{ default: ComponentType }>([
  "../components/*/*.tsx",
  "../patterns/*/*.tsx",
  "../foundations/*/*Example.tsx",
]);
const examples = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path.split("/").slice(-2).join("--").replace(".tsx", ""),
    lazy(load),
  ]),
);

const styles = stylex.create({
  content: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    justifyContent: "center",
    lineHeight: typo.lineHeightNormal,
    padding: spacingVars.space6,
  },
  frame: { borderWidth: 0, display: "block", height: "100%", width: "100%" },
  root: { marginBlock: spacingVars.space6, minWidth: 0 },
  preview: {
    backgroundColor: colorVars.bgCanvas,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.lg,
    overflow: "auto",
    resize: "vertical",
    minHeight: sizeVars.controlLg,
  },
  height: (height: number) => ({ height }),
});

export function ComponentPreview({
  name,
  source,
  height,
  isolated = false,
}: {
  name: string;
  source: string;
  height?: number;
  isolated?: boolean;
}) {
  const globals = useDocumentationGlobals(useContext(DocsContext));
  const Example = examples[name];
  const [initialGlobals] = useState(globals);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!isolated) return;
    const syncGlobals = () =>
      frameRef.current?.contentWindow?.postMessage(
        { type: "bolerish-preview-globals", globals },
        window.location.origin,
      );
    const ready = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frameRef.current?.contentWindow &&
        event.data?.type === "bolerish-preview-ready"
      )
        syncGlobals();
    };
    window.addEventListener("message", ready);
    syncGlobals();
    return () => window.removeEventListener("message", ready);
  }, [globals, isolated]);
  const query = new URLSearchParams({
    id: "internal-preview--example",
    viewMode: "story",
    args: `example:${name}`,
    globals: `colorMode:${initialGlobals.colorMode};motionPreference:${initialGlobals.motionPreference};locale:${initialGlobals.locale};unit:${initialGlobals.unit};density:${initialGlobals.density};fontPreset:${initialGlobals.fontPreset}`,
  });

  return (
    <div {...stylex.props(styles.root)}>
      <Tabs defaultValue="preview">
        <TabsList aria-label={ui.viewExample}>
          <TabsTrigger value="preview">{ui.preview}</TabsTrigger>
          <TabsTrigger value="code">{ui.code}</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" keepMounted>
          <div
            {...stylex.props(
              styles.preview,
              height !== undefined ? styles.height(height) : undefined,
            )}
          >
            {isolated ? (
              <iframe
                {...stylex.props(styles.frame)}
                ref={frameRef}
                title={name}
                src={`iframe.html?${query}`}
                loading="lazy"
              />
            ) : (
              <div
                className={`bolerish-example sb-unstyled ${stylex.props(styles.content).className}`}
                lang="en"
              >
                <Suspense fallback={<p>{ui.loading}</p>}>
                  {Example ? <Example /> : <p>{ui.missing}</p>}
                </Suspense>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={source} language="tsx" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
