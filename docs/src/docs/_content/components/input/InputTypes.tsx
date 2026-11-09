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
  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
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
export default function InputTypes() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <div {...stylex.props(layout.stack, layout.formWidth)}>
        <label htmlFor="input-email" {...stylex.props(layout.field)}>
          Email
          <Input id="input-email" type="email" placeholder="hello@example.com" />
        </label>
        <label htmlFor="input-password" {...stylex.props(layout.field)}>
          Password
          <Input id="input-password" type="password" defaultValue="password" />
        </label>
      </div>
    </div>
  );
}
