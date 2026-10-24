import {
  colorVars,
  radiusVars,
  shadowVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import korean from "../../../../config/locales/reference.ko.json";
import { useLocale } from "../../../../model/locale";
const translations: Record<string, string> = korean;
const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space8,
    marginInline: "auto",
    maxWidth: "72rem",
    padding: 0,
  },
  grid: {
    display: "grid",
    gap: spacingVars.space4,
    gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
  },
  example: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
  },
  preview: {
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.lg,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    minHeight: "10rem",
    overflow: "hidden",
    padding: spacingVars.space4,
    position: "relative",
  },
  basement: {
    backgroundColor: colorVars.bgCanvas,
  },
  defaultLayer: {
    backgroundColor: colorVars.bgSurface,
  },
  overlayLayer: {
    backgroundColor: colorVars.bgRaised,
    boxShadow: shadowVars.overlay,
  },
  nestedLayer: {
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    padding: spacingVars.space4,
  },
  localLayer: {
    backgroundColor: colorVars.bgRaised,
    borderRadius: radiusVars.md,
    boxShadow: shadowVars.subtle,
    color: colorVars.fgPrimary,
    marginBlockStart: spacingVars.space4,
    padding: spacingVars.space4,
  },
  label: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  token: {
    color: colorVars.fgSecondary,
    fontFamily: "var(--bolerish-font-code)",
    fontSize: typo.fontSizeXs,
  },
  shadowPreview: (boxShadow: string) => ({
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.lg,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow,
    height: "8rem",
  }),
});
function Example({
  children,
  description,
  name,
  token,
  value,
}: {
  children: ReactNode;
  description: string;
  name: string;
  token: string;
  value?: string;
}) {
  const locale = useLocale();
  return (
    <article {...stylex.props(styles.example)}>
      {children}
      <strong {...stylex.props(styles.label)}>
        {locale === "ko" ? (translations[name] ?? name) : name}
      </strong>
      <p {...stylex.props(styles.description)}>
        {locale === "ko" ? (translations[description] ?? description) : description}
      </p>
      <code {...stylex.props(styles.token)}>{token}</code>
      {value ? <TokenValue token={value} /> : null}
    </article>
  );
}
function TokenValue({ token }: { token: string }) {
  const elementRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(token);
  useLayoutEffect(() => {
    const variableName = token.match(/var\((--[^,)]+)/)?.[1];
    const element = elementRef.current;
    const resolvedValue =
      variableName && element
        ? getComputedStyle(element).getPropertyValue(variableName).trim()
        : "";
    const nextValue = resolvedValue || token;
    setValue((currentValue) => (currentValue === nextValue ? currentValue : nextValue));
  }, [token]);
  return (
    <code ref={elementRef} {...stylex.props(styles.token)}>
      {value}
    </code>
  );
}
export function GlobalLevels() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.grid)}>
        <Example
          name="Basement"
          description="The lowest base for the app shell and screen."
          token="colorVars.bgCanvas"
        >
          <div {...stylex.props(styles.preview, styles.basement)}>
            <div {...stylex.props(styles.nestedLayer, styles.defaultLayer)}>Default content</div>
          </div>
        </Example>
        <Example
          name="Default"
          description="The default level for primary page content."
          token="colorVars.bgSurface"
        >
          <div {...stylex.props(styles.preview, styles.defaultLayer)}>
            <span {...stylex.props(styles.label)}>Main content</span>
          </div>
        </Example>
        <Example
          name="Modal"
          description="Dialogs and overlays that open above the current flow."
          token="colorVars.bgRaised + shadowVars.overlay"
        >
          <div {...stylex.props(styles.preview, styles.basement)}>
            <div {...stylex.props(styles.nestedLayer, styles.overlayLayer)}>Dialog</div>
          </div>
        </Example>
        <Example
          name="Critical modal"
          description="A flow that must be acknowledged first. It uses the same surface as a modal and sits at the top of the stack."
          token="colorVars.bgRaised + shadowVars.overlay"
        >
          <div {...stylex.props(styles.preview, styles.basement)}>
            <div {...stylex.props(styles.nestedLayer, styles.overlayLayer)}>Critical dialog</div>
          </div>
        </Example>
      </div>
    </div>
  );
}
export function LocalLevels() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.grid)}>
        <Example
          name="Main content"
          description="The reference content for the current area."
          token="colorVars.bgSurface"
        >
          <div {...stylex.props(styles.preview, styles.defaultLayer)}>
            <span {...stylex.props(styles.label)}>Content</span>
          </div>
        </Example>
        <Example
          name="Floating action"
          description="An action fixed or floating above content."
          token="colorVars.bgRaised + shadowVars.subtle"
        >
          <div {...stylex.props(styles.preview, styles.defaultLayer)}>
            <div {...stylex.props(styles.localLayer)}>Floating action</div>
          </div>
        </Example>
        <Example
          name="Transient feedback"
          description="Temporary toasts and status messages."
          token="colorVars.bgRaised + shadowVars.overlay"
        >
          <div {...stylex.props(styles.preview, styles.defaultLayer)}>
            <div {...stylex.props(styles.nestedLayer, styles.overlayLayer)}>Changes saved</div>
          </div>
        </Example>
      </div>
    </div>
  );
}
const shadowTokens = [
  [
    "shadowVars.subtle",
    shadowVars.subtle,
    "Supports the boundary of actions or navigation fixed above content.",
  ],
  [
    "shadowVars.floating",
    shadowVars.floating,
    "Separates elements that float above content, such as menus and popovers.",
  ],
  [
    "shadowVars.overlay",
    shadowVars.overlay,
    "Emphasizes elements that need attention, such as dialogs and toasts.",
  ],
] as const;
export function Shadow() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.grid)}>
        {shadowTokens.map(([name, token, description]) => (
          <Example key={name} name={name} description={description} token={name} value={token}>
            <div {...stylex.props(styles.shadowPreview(token))} />
          </Example>
        ))}
      </div>
    </div>
  );
}
