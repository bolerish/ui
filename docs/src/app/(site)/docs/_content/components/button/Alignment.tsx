import { sizeVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { CaretRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
    maxWidth: sizeVars.contentSm,
    width: "100%",
  },
  button: { width: "100%" },
});

export default function Alignment() {
  return (
    <div {...stylex.props(styles.root)}>
      <Button align="start" xstyle={styles.button}>
        Start
      </Button>
      <Button align="center" xstyle={styles.button}>
        Center
      </Button>
      <Button align="end" xstyle={styles.button}>
        End
      </Button>
      <Button align="space-between" xstyle={styles.button}>
        Settings
        <CaretRightIcon aria-hidden />
      </Button>
    </div>
  );
}
