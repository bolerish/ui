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
import { Label } from "@bolerish/ui/label";
import { Textarea } from "@bolerish/ui/textarea";
import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";

const palettes = [
  { name: "Burgundy", color: "#80414b", glow: "#b49058" },
  { name: "Navy", color: "#294c79", glow: "#688e91" },
  { name: "Apricot", color: "#e8c6a6", glow: "#8e8c65" },
] as const;

const styles = stylex.create({
  example: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    width: "100%",
  },
  stage: {
    borderRadius: radiusVars.lg,
    color: colorVars.fgPrimary,
    display: "grid",
    gap: spacingVars.space8,
    gridTemplateRows: "auto 1fr",
    minHeight: "38rem",
    overflow: "hidden",
    padding: {
      default: spacingVars.space8,
      "@media (max-width: 480px)": spacingVars.space4,
    },
    position: "relative",
  },

  toolbar: { justifySelf: "end", maxWidth: "100%", minWidth: 0 },
  controls: {
    alignItems: "center",
    borderWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space2,
    margin: 0,
    minWidth: 0,
    padding: spacingVars.space2,
  },
  selected: { textDecoration: "underline", textUnderlineOffset: "0.3em" },
  colorControl: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderRadius: radiusVars.sm,
    display: "flex",
    gap: spacingVars.space2,
    paddingInlineStart: spacingVars.space2,
  },
  colorInput: { width: sizeVars.controlLg },
  layout: {
    alignItems: "center",
    alignSelf: "center",
    display: "grid",
    gap: spacingVars.space10,
    gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
    marginInline: "auto",
    maxWidth: "62rem",
    paddingBlock: spacingVars.space8,
    width: "100%",
    "@media (max-width: 760px)": {
      gap: spacingVars.space8,
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
  memory: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
    minWidth: 0,
  },
  title: {
    fontSize: typo.fontSizeXl,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
    margin: 0,
    textWrap: "balance",
  },
  meta: {
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  song: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
    marginBlockStart: spacingVars.space10,
    overflowWrap: "anywhere",
  },
  songName: {
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  reading: { maxWidth: "36rem", minWidth: 0 },
  body: {
    fontSize: typo.fontSizeLg,
    lineHeight: 1.8,
    margin: 0,
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  },
  editor: {
    backgroundColor: colorVars.bgSurface,
    borderRadius: radiusVars.md,
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space5,
    minWidth: 0,
    padding: spacingVars.space5,
  },
  field: { display: "flex", flexDirection: "column", gap: spacingVars.space2 },
  caption: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
});

export default function Translucent() {
  const id = useId();
  const [accent, setAccent] = useState<string>(palettes[2].color);
  const [note, setNote] = useState(
    "Nothing extraordinary happened today. But the song I heard on the way home stayed with me.\n\nSome days are worth remembering just as they are.",
  );
  const [song, setSong] = useState("hearts — Jack Zhang");
  const [preview, setPreview] = useState(true);
  const glow = palettes.find((palette) => palette.color === accent)?.glow ?? accent;

  return (
    <section aria-label="Content background example" {...stylex.props(styles.example)}>
      <div {...gradient.props({ colors: [accent, glow] }, styles.stage)}>
        <div {...stylex.props(styles.toolbar)}>
          <Card variant="translucent">
            <fieldset
              aria-label="Background palette and reading controls"
              {...stylex.props(styles.controls)}
            >
              {palettes.map((palette) => (
                <Button
                  key={palette.name}
                  variant="ghost"
                  aria-pressed={accent === palette.color}
                  onClick={() => setAccent(palette.color)}
                >
                  <span {...stylex.props(accent === palette.color && styles.selected)}>
                    {palette.name}
                  </span>
                </Button>
              ))}
              <div {...stylex.props(styles.colorControl)}>
                <Label htmlFor={`${id}-color`}>Color</Label>
                <Input
                  id={`${id}-color`}
                  type="color"
                  value={accent}
                  onInput={(event) => setAccent(event.currentTarget.value)}
                  xstyle={styles.colorInput}
                />
              </div>
              <Button
                variant="ghost"
                disabled={!preview && !note.trim()}
                onClick={() => setPreview((value) => !value)}
              >
                {preview ? "Edit entry" : "Read entry"}
              </Button>
            </fieldset>
          </Card>
        </div>
        <div {...stylex.props(styles.layout)}>
          <div {...stylex.props(styles.memory)}>
            <h3 {...stylex.props(styles.title)}>A quieter afternoon</h3>
            <time dateTime="2026-10-22" {...stylex.props(styles.meta)}>
              October 22, Thursday
            </time>
            <div {...stylex.props(styles.song)}>
              <p {...stylex.props(styles.meta)}>Today’s song</p>
              <p {...stylex.props(styles.songName)}>{song.trim() || "No song selected."}</p>
            </div>
          </div>
          {preview ? (
            <article aria-label="Diary entry" {...stylex.props(styles.reading)}>
              <p {...stylex.props(styles.body)}>{note}</p>
            </article>
          ) : (
            <div {...stylex.props(styles.editor)}>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor={`${id}-note`}>Today’s note</Label>
                <Textarea
                  id={`${id}-note`}
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                  rows={6}
                />
              </div>
              <div {...stylex.props(styles.field)}>
                <Label htmlFor={`${id}-song`}>Today’s song (optional)</Label>
                <Input
                  id={`${id}-song`}
                  value={song}
                  onChange={(event) => setSong(event.currentTarget.value)}
                  placeholder="A song that brings today back"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <p {...stylex.props(styles.caption)}>
        Sample colors, independent of the song. Changes stay in this preview. Read without a card;
        use a solid surface to write and a translucent surface for controls.
      </p>
    </section>
  );
}
