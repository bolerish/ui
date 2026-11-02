import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { StatusPill } from "@bolerish/ui/status-pill";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacingVars.space4,
    padding: spacingVars.space4,
  },
});
export default function Default() {
  const [visible, setVisible] = useState(true);
  return (
    <div {...stylex.props(styles.root)}>
      <Button variant="outline" onClick={() => setVisible((value) => !value)}>
        Toggle status
      </Button>
      <StatusPill tone="success" visible={visible}>
        Operational
      </StatusPill>
      <StatusPill tone="warning" visible={visible}>
        Degraded
      </StatusPill>
      <StatusPill tone="error" visible={visible}>
        Offline
      </StatusPill>
      <StatusPill tone="info" visible={visible}>
        Syncing
      </StatusPill>
      <StatusPill visible={visible}>Idle</StatusPill>
    </div>
  );
}
