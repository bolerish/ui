import { colorVars, sizeVars, typo } from "@bolerish/tokens/semantic.stylex";
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
  fontFamilySample: (fontFamily: string) => ({
    display: "block",
    fontFamily,
  }),
  typeSample: (fontSize: string, fontWeight: string, lineHeight: string) => ({
    display: "block",
    fontSize,
    fontWeight,
    lineHeight,
  }),
});
const fontSizeTokens = [
  ["fontSizeXs", typo.fontSizeXs, "Supporting information and token values"],
  ["fontSizeSm", typo.fontSizeSm, "Body text and form labels"],
  ["fontSizeMd", typo.fontSizeMd, "Emphasized body text"],
  ["fontSizeLg", typo.fontSizeLg, "Section headings"],
  ["fontSizeXl", typo.fontSizeXl, "Page titles"],
] as const;
const lineHeightTokens = [
  ["lineHeightTight", typo.lineHeightTight, "Headings and single-line text"],
  ["lineHeightNormal", typo.lineHeightNormal, "Body text and multi-line text"],
] as const;
const fontWeightTokens = [
  ["fontWeightRegular", typo.fontWeightRegular, "Default body text"],
  ["fontWeightMedium", typo.fontWeightMedium, "Labels and subtle emphasis"],
  ["fontWeightSemibold", typo.fontWeightSemibold, "Headings and strong emphasis"],
] as const;
export function Typography() {
  return (
    <div {...stylex.props(styles.list)}>
      <TokenRow
        name="typo.fontFamilyBody"
        usage="Body text, form controls, and product UI"
        value={typo.fontFamilyBody}
      >
        <span {...stylex.props(styles.fontFamilySample(typo.fontFamilyBody))}>
          @bolerish/ui Aa Bb
        </span>
      </TokenRow>
      <TokenRow
        name="typo.fontFamilyHeading"
        usage="Display, title, and heading text"
        value={typo.fontFamilyHeading}
      >
        <span {...stylex.props(styles.fontFamilySample(typo.fontFamilyHeading))}>
          @bolerish/ui Aa Bb
        </span>
      </TokenRow>
      {fontSizeTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`typo.${name}`} usage={usage} value={value}>
          <span
            {...stylex.props(
              styles.typeSample(value, typo.fontWeightRegular, typo.lineHeightNormal),
            )}
          >
            @bolerish/ui Aa Bb
          </span>
        </TokenRow>
      ))}
      {lineHeightTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`typo.${name}`} usage={usage} value={value}>
          <span
            {...stylex.props(styles.typeSample(typo.fontSizeSm, typo.fontWeightRegular, value))}
          >
            Line height for
            <br />
            two-line text
          </span>
        </TokenRow>
      ))}
      {fontWeightTokens.map(([name, value, usage]) => (
        <TokenRow key={name} name={`typo.${name}`} usage={usage} value={value}>
          <span {...stylex.props(styles.typeSample(typo.fontSizeSm, value, typo.lineHeightNormal))}>
            @bolerish/ui Aa Bb
          </span>
        </TokenRow>
      ))}
    </div>
  );
}
