import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { NativeSelect } from "@bolerish/ui/native-select";
import { Snackbar, type SnackbarPosition } from "@bolerish/ui/snackbar";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const statuses = {
  Operational: "success",
  Degraded: "warning",
  Offline: "error",
  Syncing: "info",
  Idle: "neutral",
} as const;

const positions: SnackbarPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const styles = stylex.create({
  row: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: spacingVars.space3 },
});

export default function Default() {
  const [status, setStatus] = useState<keyof typeof statuses>("Operational");
  const [duration, setDuration] = useState(3000);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<SnackbarPosition>("bottom-center");
  return (
    <div {...stylex.props(styles.row)}>
      <NativeSelect
        aria-label="Status"
        value={status}
        onChange={(event) => setStatus(event.target.value as keyof typeof statuses)}
      >
        {Object.keys(statuses).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label="Status position"
        value={position}
        onChange={(event) => setPosition(event.target.value as SnackbarPosition)}
      >
        {positions.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label="Duration"
        value={duration}
        onChange={(event) => setDuration(Number(event.target.value))}
      >
        <option value={3000}>3 seconds</option>
        <option value={5000}>5 seconds</option>
        <option value={0}>Until dismissed</option>
      </NativeSelect>
      <Button onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide status" : "Show status"}
      </Button>
      <Snackbar
        tone={statuses[status]}
        open={visible}
        onOpenChange={setVisible}
        duration={duration}
        position={position}
      >
        <output>{status}</output>
      </Snackbar>
    </div>
  );
}
