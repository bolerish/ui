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
export default function States() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <NativeSelect defaultValue="ko">
        <NativeSelectOption value="ko">Available select</NativeSelectOption>
      </NativeSelect>
      <NativeSelect defaultValue="ko" disabled>
        <NativeSelectOption value="ko">Unavailable select</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
