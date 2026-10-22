import { colorVars, sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useLocale } from "./locale";
import korean from "./locales/reference.ko.json";
const translations: Record<string, string> = korean;
const styles = stylex.create({
  row: {
    alignItems: "center",
    borderBlockEndColor: colorVars.strokeDefault,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: sizeVars.stroke,
    display: "grid",
    gap: spacingVars.space4,
    gridTemplateColumns: "minmax(11rem, 1fr) minmax(11rem, 2fr)",
    minHeight: sizeVars.touchTarget,
    paddingBlock: spacingVars.space3,
    "@media (max-width: 40rem)": {
      alignItems: "stretch",
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
  metadata: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space1,
  },
  tokenName: {
    color: colorVars.fgPrimary,
    fontFamily: "var(--bolerish-font-code)",
    fontSize: typo.fontSizeSm,
  },
  usage: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
  },
  value: {
    color: colorVars.fgTertiary,
    fontFamily: "var(--bolerish-font-code)",
    fontSize: typo.fontSizeXs,
  },
  preview: {
    color: colorVars.fgPrimary,
    minWidth: 0,
  },
});
export function TokenRow({
  children,
  name,
  usage,
  value,
}: {
  children: ReactNode;
  name: string;
  usage: string;
  value: string;
}) {
  const locale = useLocale();
  return (
    <div {...stylex.props(styles.row)}>
      <div {...stylex.props(styles.metadata)}>
        <code {...stylex.props(styles.tokenName)}>{name}</code>
        <span {...stylex.props(styles.usage)}>
          {locale === "ko" ? (translations[usage] ?? usage) : usage}
        </span>
        <TokenValue token={value} />
      </div>
      <div {...stylex.props(styles.preview)}>{children}</div>
    </div>
  );
}
function TokenValue({ token }: { token: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
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
    <span ref={elementRef} {...stylex.props(styles.value)}>
      {value}
    </span>
  );
}
