import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@bolerish/ui/tabs";
import * as stylex from "@stylexjs/stylex";
import { Suspense, useEffect, useRef, useState } from "react";

import { CodeBlock } from "./CodeBlock";
import { loadedExamples, examples } from "./examples";
import { ui } from "./locale";
import { useColorMode } from "./useColorMode";
import { useDocumentationGlobals } from "./useDocumentationGlobals";

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
    minHeight: "100%",
  },
  frame: { borderWidth: 0, display: "block", height: "100%", width: "100%" },
  root: { marginBlock: spacingVars.space6, minWidth: 0 },
  lightCanvas: { backgroundColor: "var(--docs-preview-light-canvas)" },
  preview: {
    backgroundColor: colorVars.bgCanvas,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.lg,
    overflow: "auto",
    scrollbarGutter: "stable",
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
  const globals = useDocumentationGlobals();
  const colorMode = useColorMode(globals.colorMode);
  const Example = loadedExamples[name] ?? examples[name];
  const [initialGlobals] = useState(globals);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!isolated) return;
    const sync = () =>
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
        sync();
    };
    window.addEventListener("message", ready);
    sync();
    return () => window.removeEventListener("message", ready);
  }, [globals, isolated]);
  const query = new URLSearchParams(Object.entries(initialGlobals));

  const canvas = stylex.props(
    styles.preview,
    colorMode === "light" && styles.lightCanvas,
    height !== undefined ? styles.height(height) : undefined,
  );
  return (
    <div {...stylex.props(styles.root)}>
      <Tabs defaultValue="preview">
        <TabsList aria-label={ui.viewExample}>
          <TabsTrigger value="preview">{ui.preview}</TabsTrigger>
          <TabsTrigger value="code">{ui.code}</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" keepMounted>
          <div {...canvas} className={`preview-canvas ${canvas.className}`}>
            {isolated ? (
              <iframe
                {...stylex.props(styles.frame)}
                ref={frameRef}
                title={name}
                src={`/preview/${encodeURIComponent(name)}?${query}`}
                loading="eager"
              />
            ) : (
              <div
                className={`bolerish-example sb-unstyled ${stylex.props(styles.content).className}`}
                lang="en"
              >
                <Suspense fallback={null}>{Example ? <Example /> : <p>{ui.missing}</p>}</Suspense>
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
