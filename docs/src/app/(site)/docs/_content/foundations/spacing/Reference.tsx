import {
  colorVars,
  sizeVars,
  spacingRoleVars,
  spacingVars,
  radiusVars,
} from "@bolerish/tokens/semantic.stylex";
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
  measure: (width: string) => ({
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.full,
    height: sizeVars.stroke,
    width,
  }),
});
const spacingTokens = [
  ["space0_5", spacingVars.space0_5, "Fine boundary adjustment"],
  ["space0", spacingVars.space0, "No spacing"],
  ["space1", spacingVars.space1, "Inside icons and fine adjustments"],
  ["space2", spacingVars.space2, "Between nearby elements"],
  ["space3", spacingVars.space3, "Inside controls and small groups"],
  ["space4", spacingVars.space4, "Between default elements"],
  ["space5", spacingVars.space5, "Inside spacious controls"],
  ["space6", spacingVars.space6, "Inside cards and section groups"],
  ["space8", spacingVars.space8, "Independent sections"],
  ["space10", spacingVars.space10, "Between large sections"],
  ["space12", spacingVars.space12, "Screen-level separation"],
] as const;
const spacingRoles = [
  ["pageGutter", spacingRoleVars.pageGutter, "Page inline padding"],
  ["panelPadding", spacingRoleVars.panelPadding, "Card or panel padding"],
  ["sectionGap", spacingRoleVars.sectionGap, "Independent sections"],
  ["fieldGap", spacingRoleVars.fieldGap, "Related fields"],
  ["labelGap", spacingRoleVars.labelGap, "Label, control and help text"],
  ["inlineGap", spacingRoleVars.inlineGap, "Related elements in one row"],
  ["textGap", spacingRoleVars.textGap, "Title and description"],
] as const;
export function Spacing() {
  return (
    <div {...stylex.props(styles.list)}>
      {spacingRoles.map(([name, value, usage]) => (
        <TokenRow key={name} name={`spacingRoleVars.${name}`} usage={usage} value={value}>
          <div {...stylex.props(styles.measure(value))} />
        </TokenRow>
      ))}
      {spacingTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`spacingVars.${name}`} usage={usage} value={value}>
          <div {...stylex.props(styles.measure(value))} />
        </TokenRow>
      ))}
    </div>
  );
}
