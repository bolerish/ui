import { colorVars, sizeVars, radiusVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

import { TokenRow } from "@/docs/_ui/TokenRow";
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
  ["sm", radiusVars.sm, "Small details"],
  ["md", radiusVars.md, "Small actions and inset items"],
  ["lg", radiusVars.lg, "Controls and popups"],
  ["xl", radiusVars.xl, "Cards and dialogs"],
  ["full", radiusVars.full, "Circles and pills"],
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
