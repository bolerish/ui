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
});

export default function Alignment() {
  return (
    <div {...stylex.props(styles.root)}>
      {/* @example-start */}
      <Button align="start" style={{ width: "100%" }}>
        Start
      </Button>
      <Button align="center" style={{ width: "100%" }}>
        Center
      </Button>
      <Button align="end" style={{ width: "100%" }}>
        End
      </Button>
      <Button align="space-between" style={{ width: "100%" }}>
        Settings
        <CaretRightIcon aria-hidden />
      </Button>
      {/* @example-end */}
    </div>
  );
}
