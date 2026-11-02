import { colorVars, radiusVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles, type StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    alignItems: "center",
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: 1,
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space2,
    isolation: "isolate",
    lineHeight: typo.lineHeightTight,
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space3,
    position: "relative",
    whiteSpace: "nowrap",
  },
  dot: {
    backgroundColor: "currentColor",
    borderRadius: radiusVars.full,
    flexShrink: 0,
    height: 6,
    width: 6,
  },
});
const tones = stylex.create({
  success: {
    backgroundColor: colorVars.bgFeedbackSuccess,
    color: colorVars.fgFeedbackSuccess,
    borderColor: colorVars.strokeFeedbackSuccess,
  },
  warning: {
    backgroundColor: colorVars.bgFeedbackWarning,
    color: colorVars.fgFeedbackWarning,
    borderColor: colorVars.strokeFeedbackWarning,
  },
  error: {
    backgroundColor: colorVars.bgFeedbackError,
    color: colorVars.fgFeedbackError,
    borderColor: colorVars.strokeFeedbackError,
  },
  info: {
    backgroundColor: colorVars.bgFeedbackInfo,
    color: colorVars.fgFeedbackInfo,
    borderColor: colorVars.strokeFeedbackInfo,
  },
  neutral: {
    backgroundColor: colorVars.bgSubtle,
    color: colorVars.fgSecondary,
    borderColor: colorVars.strokeDefault,
  },
});

export type StatusPillProps = StyledProps<ComponentProps<"span">> & {
  tone?: keyof typeof tones;
  /** Keep mounted and toggle visible to animate both entry and exit. Reserves layout space. */
  visible?: boolean;
  xstyle?: ControlPlacementStyles;
};

/** A non-interactive status label with a decorative color echo on visibility changes. */
export function StatusPill({
  tone = "neutral",
  visible = true,
  children,
  className,
  style,
  xstyle,
  ...props
}: StatusPillProps) {
  return (
    <span
      {...props}
      {...mergeStyles(stylex.props(styles.root, tones[tone], xstyle), className, style)}
      data-bolerish-status-pill=""
      data-visible={visible ? "true" : "false"}
      aria-hidden={visible ? props["aria-hidden"] : true}
    >
      <span aria-hidden="true" {...stylex.props(styles.dot)} />
      {children}
    </span>
  );
}
