import {
  colorVars,
  sizeVars,
  radiusVars,
  spacingVars,
  opacityVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
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
  samples: { display: "flex", flexWrap: "wrap", gap: spacingVars.space6 },
  sample: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacingVars.space2,
  },
  label: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
  },
  swatch: {
    backgroundColor: colorVars.fgPrimary,
    borderRadius: radiusVars.sm,
    opacity: opacityVars.disabled,
    height: sizeVars.controlMd,
    width: sizeVars.controlMd,
  },
});

export function Opacity() {
  return (
    <div {...stylex.props(styles.list)}>
      <TokenRow
        name="opacityVars.disabled"
        usage="Opacity of a layer; not a complete disabled state"
        value={opacityVars.disabled}
      >
        <div {...stylex.props(styles.samples)}>
          <div {...stylex.props(styles.sample)}>
            <span {...stylex.props(styles.label)}>Opacity only</span>
            <span aria-hidden="true" {...stylex.props(styles.swatch)} />
          </div>
          <div {...stylex.props(styles.sample)}>
            <span {...stylex.props(styles.label)}>Disabled control</span>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </TokenRow>
    </div>
  );
}
