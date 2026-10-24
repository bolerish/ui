import { sizeVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Label } from "@bolerish/ui/label";
import { RadioGroup, RadioGroupItem } from "@bolerish/ui/radio-group";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  option: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space3,
    minHeight: sizeVars.touchTarget,
  },
});
export default function States() {
  return (
    <RadioGroup defaultValue="daily">
      <Label {...stylex.props(layout.option)}>
        <RadioGroupItem value="daily" />
        Selected
      </Label>
      <Label {...stylex.props(layout.option)}>
        <RadioGroupItem value="weekly" />
        Available
      </Label>
      <Label {...stylex.props(layout.option)}>
        <RadioGroupItem disabled value="never" />
        Unavailable
      </Label>
    </RadioGroup>
  );
}
