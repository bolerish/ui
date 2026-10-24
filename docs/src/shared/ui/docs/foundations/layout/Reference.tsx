import {
  colorVars,
  layoutVars,
  sizeVars,
  spacingVars,
  typo,
  radiusVars,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Input } from "@bolerish/ui/input";
import { InfoIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";

import { TokenRow } from "../../../tokens/TokenRow";
const styles = stylex.create({
  list: {
    borderBlockStartColor: colorVars.strokeDefault,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: sizeVars.stroke,
    display: "flex",
    flexDirection: "column",
  },
  trackSample: (height: string) => ({
    height,
    width: "100%",
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.full,
  }),
  contentSample: (width: string) => ({
    alignItems: "center",
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    display: "flex",
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    height: sizeVars.controlLg,
    justifyContent: "center",
    maxWidth: "100%",
    width,
  }),
  iconSample: (size: string) => ({
    height: size,
    width: size,
  }),
  touchTarget: {
    alignItems: "center",
    borderColor: colorVars.strokeStrong,
    borderRadius: radiusVars.md,
    borderStyle: "dashed",
    borderWidth: sizeVars.stroke,
    display: "inline-flex",
    height: sizeVars.touchTarget,
    justifyContent: "center",
    width: sizeVars.touchTarget,
  },
  strokeSample: (borderWidth: string) => ({
    alignItems: "center",
    borderColor: colorVars.strokeStrong,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth,
    display: "inline-flex",
    fontSize: typo.fontSizeXs,
    height: sizeVars.controlLg,
    paddingInline: spacingVars.space4,
  }),
  focusSample: (outlineWidth: string) => ({
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    display: "inline-flex",
    fontSize: typo.fontSizeXs,
    height: sizeVars.controlMd,
    outlineColor: colorVars.strokeFocus,
    outlineOffset: sizeVars.stroke,
    outlineStyle: "solid",
    outlineWidth,
    paddingInline: spacingVars.space4,
  }),
});
const contentSizeTokens = [
  ["contentXs", sizeVars.contentXs, "Compact content width"],
  ["contentSm", sizeVars.contentSm, "Popovers and narrow panels"],
  ["contentMd", sizeVars.contentMd, "Dialogs and default panels"],
] as const;
export function Size() {
  return (
    <div {...stylex.props(styles.list)}>
      <TokenRow
        name="sizeVars.controlXs"
        usage="Extra-small icon controls"
        value={sizeVars.controlXs}
      >
        <Button
          size="icon"
          variant="secondary"
          aria-label="Information"
          style={{ width: sizeVars.controlXs, height: sizeVars.controlXs }}
        >
          <InfoIcon aria-hidden="true" />
        </Button>
      </TokenRow>
      <TokenRow name="sizeVars.iconXs" usage="Extra-small icons" value={sizeVars.iconXs}>
        <InfoIcon aria-hidden="true" {...stylex.props(styles.iconSample(sizeVars.iconXs))} />
      </TokenRow>
      <TokenRow name="sizeVars.iconLg" usage="Large icons" value={sizeVars.iconLg}>
        <InfoIcon aria-hidden="true" {...stylex.props(styles.iconSample(sizeVars.iconLg))} />
      </TokenRow>
      <TokenRow
        name="sizeVars.trackSm"
        usage="Small progress and slider tracks"
        value={sizeVars.trackSm}
      >
        <div {...stylex.props(styles.trackSample(sizeVars.trackSm))} />
      </TokenRow>
      <TokenRow
        name="sizeVars.trackMd"
        usage="Default progress and slider tracks"
        value={sizeVars.trackMd}
      >
        <div {...stylex.props(styles.trackSample(sizeVars.trackMd))} />
      </TokenRow>

      <TokenRow
        name="sizeVars.controlSm"
        usage="Controls in toolbars and dense screens"
        value={sizeVars.controlSm}
      >
        <Button size="sm" variant="secondary">
          Small button
        </Button>
      </TokenRow>
      <TokenRow
        name="sizeVars.controlMd"
        usage="Default controls in forms and standard screens"
        value={sizeVars.controlMd}
      >
        <Input aria-label="Default input example" placeholder="Default input" />
      </TokenRow>
      <TokenRow
        name="sizeVars.controlLg"
        usage="Standalone controls that need more space"
        value={sizeVars.controlLg}
      >
        <Button size="lg" variant="secondary">
          Large button
        </Button>
      </TokenRow>
      <TokenRow
        name="sizeVars.iconSm"
        usage="Supporting icon in a small control"
        value={sizeVars.iconSm}
      >
        <InfoIcon
          aria-label="Small information icon"

          {...stylex.props(styles.iconSample(sizeVars.iconSm))}
        />
      </TokenRow>
      <TokenRow name="sizeVars.iconMd" usage="Icon in a default control" value={sizeVars.iconMd}>
        <InfoIcon
          aria-label="Default information icon"

          {...stylex.props(styles.iconSample(sizeVars.iconMd))}
        />
      </TokenRow>
      <TokenRow
        name="sizeVars.touchTarget"
        usage="Minimum target area for icon buttons"
        value={sizeVars.touchTarget}
      >
        <span {...stylex.props(styles.touchTarget)}>
          <InfoIcon
            aria-hidden="true"

            {...stylex.props(styles.iconSample(sizeVars.iconMd))}
          />
        </span>
      </TokenRow>
      {contentSizeTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`sizeVars.${name}`} usage={usage} value={value}>
          <div {...stylex.props(styles.contentSample(value))}>{usage}</div>
        </TokenRow>
      ))}
      <TokenRow
        name="layoutVars.contentMaxWidth"
        usage="Maximum width for centered page content"
        value={layoutVars.contentMaxWidth}
      >
        <div {...stylex.props(styles.contentSample(layoutVars.contentMaxWidth))}>Page content</div>
      </TokenRow>
      <TokenRow
        name="sizeVars.stroke"
        usage="Default border for controls and surfaces"
        value={sizeVars.stroke}
      >
        <span {...stylex.props(styles.strokeSample(sizeVars.stroke))}>Default border</span>
      </TokenRow>
      <TokenRow
        name="sizeVars.focusRing"
        usage="Ring that indicates keyboard focus"
        value={sizeVars.focusRing}
      >
        <span {...stylex.props(styles.focusSample(sizeVars.focusRing))}>Keyboard focus</span>
      </TokenRow>
    </div>
  );
}
