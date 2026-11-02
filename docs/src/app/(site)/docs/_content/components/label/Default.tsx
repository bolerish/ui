import { spacingRoleVars } from "@bolerish/tokens/semantic.stylex";
import { Input } from "@bolerish/ui/input";
import { Label } from "@bolerish/ui/label";
import * as stylex from "@stylexjs/stylex";
const styles = stylex.create({
  field: { display: "flex", flexDirection: "column", gap: spacingRoleVars.labelGap },
});
export default function Default() {
  return (
    <div {...stylex.props(styles.field)}>
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" placeholder="Jordan Lee" />
    </div>
  );
}
