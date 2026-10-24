import { sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Input } from "@bolerish/ui/input";
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
  formWidth: {
    maxWidth: sizeVars.contentSm,
    width: "100%",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
  },
});
export default function States() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <div {...stylex.props(layout.stack, layout.formWidth)}>
        <Input aria-label="Invalid email" aria-invalid defaultValue="min@" />
        <Input aria-label="Disabled name" disabled defaultValue="Jordan Lee" />
        <Input
          variant="none"
          aria-label="Invalid borderless email"
          aria-invalid
          defaultValue="min@"
        />
        <Input
          variant="none"
          aria-label="Disabled borderless name"
          disabled
          defaultValue="Jordan Lee"
        />
        <Input
          variant="underline"
          aria-label="Invalid underlined email"
          aria-invalid
          defaultValue="min@"
        />
        <Input
          variant="underline"
          aria-label="Disabled underlined name"
          disabled
          defaultValue="Jordan Lee"
        />
      </div>
    </div>
  );
}
