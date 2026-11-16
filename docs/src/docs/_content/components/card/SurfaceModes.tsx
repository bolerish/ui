import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Card } from "@bolerish/ui/card";
import { gradient } from "@bolerish/ui/gradient";
import { Input } from "@bolerish/ui/input";
import { surface } from "@bolerish/ui/surface";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const backgrounds = ["Photo", "Gradient", "Flat"] as const;
type Background = (typeof backgrounds)[number];

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: spacingVars.space5, width: "100%" },
  controls: {
    borderWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space2,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  grid: {
    display: "grid",
    gap: spacingVars.space4,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media (max-width: 760px)": { gridTemplateColumns: "minmax(0, 1fr)" },
  },
  column: { display: "flex", flexDirection: "column", gap: spacingVars.space2, minWidth: 0 },
  label: { fontSize: typo.fontSizeSm, fontWeight: typo.fontWeightMedium, margin: 0 },
  stage: { borderRadius: radiusVars.md, overflow: "hidden", position: "relative" },
  background: { inset: sizeVars.stroke, pointerEvents: "none", position: "absolute" },
  scene: { display: "block", height: "100%", objectFit: "cover", width: "100%" },
  flat: { backgroundColor: colorVars.bgCanvas },
  surface: {
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    position: "relative",
  },
  content: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
    minHeight: "18rem",
    padding: spacingVars.space4,
  },
  title: { fontSize: typo.fontSizeLg, fontWeight: typo.fontWeightSemibold, margin: 0 },
  text: { color: colorVars.fgPrimary, fontSize: typo.fontSizeSm, margin: 0 },
  action: { alignSelf: "start", marginBlockStart: "auto" },
  caption: { color: colorVars.fgSecondary, fontSize: typo.fontSizeSm, margin: 0 },
});

function Scene({ background }: { background: Background }) {
  if (background === "Photo")
    return <img {...stylex.props(styles.scene)} src="/images/hangang.webp" alt="" />;
  if (background === "Gradient")
    return (
      <div
        {...gradient.props(
          {
            colors: [
              "oklch(45.703878% 0.087141 11.072122)",
              "oklch(67.450066% 0.085527 77.562903)",
            ],
          },
          styles.scene,
        )}
      />
    );
  return <div {...stylex.props(styles.scene, styles.flat)} />;
}

function Foreground() {
  const [saved, setSaved] = useState(false);
  return (
    <div {...stylex.props(styles.content)}>
      <h3 {...stylex.props(styles.title)}>A quiet evening</h3>
      <p {...stylex.props(styles.text)}>One song to remember today.</p>
      <Input aria-label="Song note" placeholder="Add a note" />
      <Button xstyle={styles.action} aria-pressed={saved} onClick={() => setSaved(!saved)}>
        {saved ? "Saved" : "Save song"}
      </Button>
    </div>
  );
}

export default function SurfaceModes() {
  const [background, setBackground] = useState<Background>("Photo");
  return (
    <section aria-label="Surface material comparison" {...stylex.props(styles.root)}>
      <fieldset aria-label="Comparison background" {...stylex.props(styles.controls)}>
        {backgrounds.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={background === value ? "secondary" : "ghost"}
            aria-pressed={background === value}
            onClick={() => setBackground(value)}
          >
            {value}
          </Button>
        ))}
      </fieldset>
      <div {...stylex.props(styles.grid)}>
        {(["Solid", "Glass"] as const).map((material) => (
          <section
            key={material}
            aria-label={`${material} sample`}
            {...stylex.props(styles.column)}
          >
            <p {...stylex.props(styles.label)}>{material}</p>
            <div
              {...surface.props({ mode: material === "Solid" ? "solid" : "glass" })}
              {...stylex.props(styles.stage)}
            >
              <div aria-hidden="true" {...stylex.props(styles.background)}>
                <Scene background={background} />
              </div>
              <Card variant="translucent" xstyle={styles.surface}>
                <Foreground />
              </Card>
            </div>
          </section>
        ))}
      </div>
      <p {...stylex.props(styles.caption)}>
        Same content and background. Glass affects the translucent card; fields stay opaque. Changes
        stay in this preview.
      </p>
    </section>
  );
}
