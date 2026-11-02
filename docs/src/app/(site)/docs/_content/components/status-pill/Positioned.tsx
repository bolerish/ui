import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { NativeSelect } from "@bolerish/ui/native-select";
import { StatusPill, type StatusPillPosition } from "@bolerish/ui/status-pill";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const positions: StatusPillPosition[] = [
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

export default function Positioned() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<StatusPillPosition>("bottom-center");
  return (
    <div {...stylex.props(styles.row)}>
      <NativeSelect
        aria-label="Status position"
        value={position}
        onChange={(event) => setPosition(event.target.value as StatusPillPosition)}
      >
        {positions.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </NativeSelect>
      <Button onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide status" : "Show status"}
      </Button>
      <StatusPill tone="success" visible={visible} position={position}>
        <output>Changes saved</output>
      </StatusPill>
    </div>
  );
}
