import { spacingVars, sizeVars } from "@bolerish/tokens/semantic.stylex";
import { Input } from "@bolerish/ui/input";
import { Label } from "@bolerish/ui/label";
import * as stylex from "@stylexjs/stylex";
import { useId } from "react";

const styles = stylex.create({
  stack: { display: "grid", gap: spacingVars.space4, maxWidth: sizeVars.contentSm, width: "100%" },
  field: { display: "grid", gap: spacingVars.space2 },
});

export default function Variants() {
  const id = useId();
  return (
    <div {...stylex.props(styles.stack)}>
      {(["outline", "none", "underline", "inline"] as const).map((variant) => (
        <div key={variant} {...stylex.props(styles.field)}>
          <Label htmlFor={`${id}-${variant}`}>{variant}</Label>
          <Input id={`${id}-${variant}`} variant={variant} placeholder="Enter a name" />
        </div>
      ))}
    </div>
  );
}
