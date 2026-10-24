import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Item } from "@bolerish/ui/item";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  column: {
    alignItems: "stretch",
    flexDirection: "column",
  },
  componentWidth: {
    maxWidth: "28rem",
    width: "100%",
  },
});
export default function Sizes() {
  return (
    <div {...stylex.props(layout.preview, [layout.column, layout.componentWidth])}>
      <Item size="xs">Extra small row</Item>
      <Item size="sm">Small row</Item>
      <Item>Default row</Item>
    </div>
  );
}
