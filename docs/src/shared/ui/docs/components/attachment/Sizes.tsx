import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Attachment } from "@bolerish/ui/attachment";
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
      <Attachment size="xs">Extra small attachment</Attachment>
      <Attachment size="sm">Small attachment</Attachment>
      <Attachment>Default attachment</Attachment>
    </div>
  );
}
