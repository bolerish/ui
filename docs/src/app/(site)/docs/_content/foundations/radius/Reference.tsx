import { colorVars, sizeVars, radiusVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

import { TokenRow } from "@/app/(site)/docs/_components/TokenRow";
const styles = stylex.create({
  list: {
    borderBlockStartColor: colorVars.strokeDefault,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: sizeVars.stroke,
    display: "flex",
    flexDirection: "column",
  },
  radiusBox: (borderRadius: string) => ({
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeStrong,
    borderRadius,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    height: sizeVars.touchTarget,
    width: sizeVars.touchTarget,
  }),
});
const radiusTokens = [
  ["xl", radiusVars.xl, "Large rounded panels"],
  ["sm", radiusVars.sm, "Small controls"],
  ["md", radiusVars.md, "Default controls"],
  ["lg", radiusVars.lg, "Cards and large surfaces"],
  ["full", radiusVars.full, "Circular icons and badges"],
] as const;
export function Radius() {
  return (
    <div {...stylex.props(styles.list)}>
      {radiusTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`radiusVars.${name}`} usage={usage} value={value}>
          <div {...stylex.props(styles.radiusBox(value))} />
        </TokenRow>
      ))}
    </div>
  );
}
