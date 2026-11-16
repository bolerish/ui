import { radiusVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@bolerish/ui/card";
import { gradient } from "@bolerish/ui/gradient";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const palettes = [
  {
    name: "Burgundy",
    accent: "oklch(45.703878% 0.087141 11.072122)",
    glow: "oklch(67.450066% 0.085527 77.562903)",
  },
  {
    name: "Navy",
    accent: "oklch(41.304303% 0.08612 255.503679)",
    glow: "oklch(61.96175% 0.042278 202.22388)",
  },
  {
    name: "Apricot",
    accent: "oklch(84.76175% 0.057696 65.192901)",
    glow: "oklch(63.164762% 0.055093 105.40134)",
  },
];
const styles = stylex.create({
  root: { display: "grid", gap: spacingVars.space4, width: "100%" },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space2,
    borderWidth: 0,
    margin: 0,
    padding: 0,
    minWidth: 0,
  },
  stage: {
    borderRadius: radiusVars.lg,
    display: "grid",
    gap: spacingVars.space6,
    overflow: "hidden",
    padding: spacingVars.space6,
    position: "relative",
  },
});
export default function GradientExample() {
  const [palette, setPalette] = useState(palettes[0]);
  return (
    <div {...stylex.props(styles.root)}>
      <fieldset aria-label="Background palette" {...stylex.props(styles.controls)}>
        {palettes.map((item) => (
          <Button
            key={item.name}
            variant="secondary"
            aria-pressed={palette.name === item.name}
            onClick={() => setPalette(item)}
          >
            {item.name}
          </Button>
        ))}
      </fieldset>
      <div {...gradient.props({ colors: [palette.accent, palette.glow] }, styles.stage)}>
        <Card>
          <CardHeader>
            <CardTitle>Reading surface</CardTitle>
            <CardDescription>Keep long text and editing on an opaque surface.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
