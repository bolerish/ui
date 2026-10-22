import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { DocsContext } from "@storybook/addon-docs/blocks";
import * as stylex from "@stylexjs/stylex";
import { type ComponentProps, useEffect, useState, useContext } from "react";
import { SyntaxHighlighter } from "storybook/internal/components";
import { ThemeProvider, convert, themes } from "storybook/theming";

import { ui } from "./locale";
import { useColorMode } from "./useColorMode";
import { useDocumentationGlobals } from "./useDocumentationGlobals";

const styles = stylex.create({
  root: {
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.md,
    marginBlock: spacingVars.space4,
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: spacingVars.space2,
    gap: spacingVars.space2,
  },
  content: {
    paddingInline: spacingVars.space4,
    paddingBottom: spacingVars.space4,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    overflowX: "auto",
  },
  status: { color: colorVars.fgSecondary, fontSize: typo.fontSizeXs },
});

export function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: ComponentProps<typeof SyntaxHighlighter>["language"];
}) {
  const globals = useDocumentationGlobals(useContext(DocsContext));
  const colorMode = useColorMode(globals.colorMode);
  const [status, setStatus] = useState<"copied" | "failed" | null>(null);
  useEffect(() => {
    if (!status) return;
    const timeout = window.setTimeout(() => setStatus(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const statusMessages = { copied: ui.copied, failed: ui.copyFailed };

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.toolbar)}>
        <output {...stylex.props(styles.status)}>{status ? statusMessages[status] : ""}</output>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={ui.copy}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setStatus("copied");
            } catch {
              setStatus("failed");
            }
          }}
        >
          {status === "copied" ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        </Button>
      </div>
      <div {...stylex.props(styles.content)}>
        <ThemeProvider
          theme={convert({
            ...themes[colorMode],
            fontBase: "var(--bolerish-font-body)",
            fontCode: "var(--bolerish-font-code)",
          })}
        >
          <SyntaxHighlighter language={language} copyable={false} format={false}>
            {code}
          </SyntaxHighlighter>
        </ThemeProvider>
      </div>
    </div>
  );
}
