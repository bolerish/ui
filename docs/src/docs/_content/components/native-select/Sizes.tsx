import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";
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
});
export default function Sizes() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <NativeSelect size="sm" defaultValue="ko">
        <NativeSelectOption value="ko">Small select</NativeSelectOption>
      </NativeSelect>
      <NativeSelect defaultValue="ko">
        <NativeSelectOption value="ko">Default select</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
