import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { toast, Toaster, type ToastPosition } from "@bolerish/ui/toast";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

/* @example-start */
const positions = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;
/* @example-end */

/* @example-start */
const styles = stylex.create({
  row: { display: "flex", flexWrap: "wrap", gap: spacingVars.space2 },
});
/* @example-end */

export default function Positions() {
  /* @example-start */
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  /* @example-end */

  return (
    /* @example-start */
    <div {...stylex.props(styles.row)}>
      {positions.map((value) => (
        <Button
          key={value}
          variant="outline"
          onClick={() => {
            setPosition(value);
            toast.add({ title: `Notification at ${value}` });
          }}
        >
          {value}
        </Button>
      ))}
      <Toaster position={position} />
    </div>
    /* @example-end */
  );
}
