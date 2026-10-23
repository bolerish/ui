import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";

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
    position: "relative",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    top: spacingVars.space2,
    right: spacingVars.space2,
    gap: spacingVars.space2,
  },
  content: {
    padding: spacingVars.space4,
    paddingRight: spacingVars.space12,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    overflowX: "auto",
  },
  status: { color: colorVars.fgSecondary, fontSize: typo.fontSizeXs },
});

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const globals = useDocumentationGlobals();
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
          size="icon"
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
        <Highlight
          code={code}
          language={language}
          theme={colorMode === "dark" ? themes.vsDark : themes.vsLight}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre>
              <code>
                {tokens.map((line, index) => (
                  <div key={index} {...getLineProps({ line })}>
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
