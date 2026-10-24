import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const styles = stylex.create({
  group: {
    backgroundColor: colorVars.bgSubtle,
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space3,
    padding: spacingVars.space4,
  },
  control: {
    position: "relative",
    isolation: "isolate",
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    minHeight: sizeVars.controlMd,
    paddingInline: spacingVars.space4,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
      outlineOffset: sizeVars.focusRing,
    },
    ":disabled": { color: colorVars.fgDisabled, cursor: "not-allowed" },
    "::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: radiusVars.sm,
      pointerEvents: "none",
      backgroundColor: {
        default: colorVars.interactionDefault,
        ":not(:disabled):hover": colorVars.interactionHover,
        ":not(:disabled):active": colorVars.interactionPressed,
      },
    },
  },
  selected: { backgroundColor: colorVars.bgSelected, borderColor: colorVars.strokeStrong },
  content: { position: "relative" },
});

export default function InteractionExample() {
  const [pinned, setPinned] = useState(false);
  return (
    <div {...stylex.props(styles.group)}>
      <button
        type="button"
        aria-pressed={pinned}
        onClick={() => setPinned(!pinned)}
        {...stylex.props(styles.control, pinned && styles.selected)}
      >
        <span {...stylex.props(styles.content)}>
          <span aria-hidden="true">{pinned ? "✓ " : ""}</span>Pin project
        </span>
      </button>
      <button type="button" disabled {...stylex.props(styles.control)}>
        <span {...stylex.props(styles.content)}>Unavailable</span>
      </button>
    </div>
  );
}
