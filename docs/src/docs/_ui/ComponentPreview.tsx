import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";
import * as stylex from "@stylexjs/stylex";
import { Suspense, useEffect, useId, useRef, useState } from "react";

import { loadedExamples, examples } from "@/_shared/examples";
import { usePreviewTab } from "@/shared/lib/preview-tab";
import { ui } from "@/shared/model/locale";
import { useDocumentationGlobals } from "@/shared/model/useDocumentationGlobals";

import { CodeBlock } from "./CodeBlock";
import { getExampleSource } from "./example-source";

const styles = stylex.create({
  content: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    justifyContent: "center",
    lineHeight: typo.lineHeightNormal,
    padding: { default: spacingVars.space6, "@media (max-width: 760px)": spacingVars.space3 },
    minHeight: "100%",
  },
  layout: { height: "100%", minHeight: 0, overflow: "hidden" },
  panel: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    marginTop: spacingVars.space3,
    minWidth: 0,
  },
  frame: { borderWidth: 0, display: "block", height: "100%", width: "100%" },
  root: {
    "--docs-preview-tab-selected": colorVars.interactionSelected,
    marginBlock: spacingVars.space6,
    minWidth: 0,
  },
  preview: {
    backgroundColor: "var(--docs-background)",
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.lg,
    overflow: "auto",
    height: 400,
    maxHeight: 400,
  },
});

export function ComponentExample({
  name,
  isolated = false,
  layout = false,
}: {
  name: string;
  isolated?: boolean;
  layout?: boolean;
  width?: number;
}) {
  const Example = loadedExamples[name] ?? examples[name];
  if (isolated) return <ComponentPreview name={name} source="" isolated previewOnly />;
  return (
    <div
      {...stylex.props(layout ? styles.layout : styles.content)}
      data-example-name={name}
      lang="en"
    >
      <Suspense fallback={null}>{Example ? <Example /> : <p>{ui.missing}</p>}</Suspense>
    </div>
  );
}

export function ComponentPreview({
  name,
  source,
  isolated = false,
  layout = false,
  previewOnly = false,
}: {
  name: string;
  source: string;
  width?: number;
  isolated?: boolean;
  layout?: boolean;
  previewOnly?: boolean;
}) {
  const id = useId();
  const tab = usePreviewTab(name);
  const globals = useDocumentationGlobals();
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

  const canvas = stylex.props(styles.preview);
  return (
    <div
      {...stylex.props(styles.root)}
      data-preview-name={previewOnly ? undefined : name}
      data-example-name={previewOnly ? name : undefined}
    >
      {!previewOnly && (
        <ToggleGroup
          variant="soft"
          size="sm"
          value={[tab.value]}
          onValueChange={(values) => {
            if (values[0]) tab.select(values[0]);
          }}
          aria-label={ui.viewExample}
        >
          <ToggleGroupItem
            value="preview"
            data-preview-trigger="preview"
            aria-controls={`${id}-preview`}
          >
            {ui.preview}
          </ToggleGroupItem>
          <ToggleGroupItem value="code" data-preview-trigger="code" aria-controls={`${id}-code`}>
            {ui.code}
          </ToggleGroupItem>
        </ToggleGroup>
      )}
      <section
        {...stylex.props(styles.panel)}
        id={`${id}-preview`}
        aria-label={ui.preview}
        hidden={!previewOnly && tab.value !== "preview"}
        data-preview-panel="preview"
      >
        <div {...canvas} data-docs="preview-canvas">
          {isolated ? (
            <iframe
              {...stylex.props(styles.frame)}
              ref={frameRef}
              title={name}
              src={`/preview/${encodeURIComponent(name)}?${query}`}
              loading="eager"
            />
          ) : (
            <ComponentExample name={name} layout={layout} />
          )}
        </div>
      </section>
      {!previewOnly && (
        <section
          {...stylex.props(styles.panel)}
          id={`${id}-code`}
          aria-label={ui.code}
          hidden={tab.value !== "code"}
          data-preview-panel="code"
        >
          <CodeBlock code={getExampleSource(source)} language="tsx" />
        </section>
      )}
    </div>
  );
}
