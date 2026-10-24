import { radiusVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@bolerish/ui/card";
import { gradient } from "@bolerish/ui/gradient";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const palettes = [
  { name: "Burgundy", accent: "#80414b", glow: "#b49058" },
  { name: "Navy", accent: "#294c79", glow: "#688e91" },
  { name: "Apricot", accent: "#e8c6a6", glow: "#8e8c65" },
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
        <Card variant="translucent">
          <CardHeader>
            <CardTitle>Floating surface</CardTitle>
            <CardDescription>A translucent layer shares the background colors.</CardDescription>
          </CardHeader>
        </Card>
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
