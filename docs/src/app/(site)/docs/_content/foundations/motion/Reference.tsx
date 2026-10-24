import {
  colorVars,
  sizeVars,
  spacingVars,
  radiusVars,
  motionVars,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

import { TokenRow } from "@/app/(site)/docs/_components/TokenRow";
const move = stylex.keyframes({
  "0%": {
    transform: "translateX(0)",
  },
  "50%": {
    transform: "translateX(100%)",
  },
  "100%": {
    transform: "translateX(0)",
  },
});
const styles = stylex.create({
  list: {
    borderBlockStartColor: colorVars.strokeDefault,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: sizeVars.stroke,
    display: "flex",
    flexDirection: "column",
  },
  motionTrack: {
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.full,
    maxWidth: sizeVars.contentSm,
    overflow: "hidden",
    padding: spacingVars.space1,
    width: "100%",
  },
  timing: (animationTimingFunction: string) => ({ animationTimingFunction }),
  motionDot: (animationDuration: string) => ({
    animationDuration,
    animationIterationCount: "infinite",
    animationName: move,
    animationTimingFunction: motionVars.easingStandard,
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.full,
    height: sizeVars.iconMd,
    width: sizeVars.iconMd,
  }),
});
const motionTokens = [
  ["durationLoading", motionVars.durationLoading, "Loading animation cycle"],
  ["durationLoadingReduced", motionVars.durationLoadingReduced, "Reduced loading animation cycle"],
  ["durationInstant", motionVars.durationInstant, "Reduced motion fallback"],
  ["durationFast", motionVars.durationFast, "Hover and small state changes"],
  ["durationNormal", motionVars.durationNormal, "Surface and content transitions"],
  ["durationSlow", motionVars.durationSlow, "Large surface transitions, such as Dialog and Toast"],
] as const;
export function Motion() {
  return (
    <div {...stylex.props(styles.list)}>
      {motionTokens.map(([name, duration, usage]) => (
        <TokenRow key={name} name={`motionVars.${name}`} usage={usage} value={duration}>
          <div {...stylex.props(styles.motionTrack)}>
            <div {...stylex.props(styles.motionDot(duration))} />
          </div>
        </TokenRow>
      ))}
      <TokenRow
        name="motionVars.easingStandard"
        usage="Default easing for state changes"
        value={motionVars.easingStandard}
      >
        <div {...stylex.props(styles.motionTrack)}>
          <div {...stylex.props(styles.motionDot(motionVars.durationNormal))} />
        </div>
      </TokenRow>
      <TokenRow
        name="motionVars.easingEnter"
        usage="When a new element appears"
        value={motionVars.easingEnter}
      >
        <div {...stylex.props(styles.motionTrack)}>
          <div
            {...stylex.props(
              styles.motionDot(motionVars.durationNormal),
              styles.timing(motionVars.easingEnter),
            )}
          />
        </div>
      </TokenRow>
      <TokenRow
        name="motionVars.easingExit"
        usage="When an element disappears"
        value={motionVars.easingExit}
      >
        <div {...stylex.props(styles.motionTrack)}>
          <div
            {...stylex.props(
              styles.motionDot(motionVars.durationFast),
              styles.timing(motionVars.easingExit),
            )}
          />
        </div>
      </TokenRow>
    </div>
  );
}
