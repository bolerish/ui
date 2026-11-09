import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Toggle } from "@bolerish/ui/toggle";
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
});
export default function Variants() {
  return (
    <div {...stylex.props(layout.preview)}>
      {(["default", "outline", "soft"] as const).map((variant) => (
        <div key={variant} {...stylex.props(layout.preview)}>
          <Toggle variant={variant}>{variant}</Toggle>
          <Toggle variant={variant} defaultPressed>
            {variant} selected
          </Toggle>
          <Toggle variant={variant} pressed disabled>
            {variant} selected, unavailable
          </Toggle>
        </div>
      ))}
    </div>
  );
}
