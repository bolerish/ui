import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Toggle } from "@bolerish/ui/toggle";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space3,
  },
});

export default function Default() {
  return (
    <div {...stylex.props(styles.row)}>
      <Toggle defaultPressed>Bold</Toggle>
      <Toggle variant="outline">Italic</Toggle>
    </div>
  );
}
