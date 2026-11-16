import { typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const typographyStyles = stylex.create({
  body: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeMd,
    fontWeight: typo.fontWeightRegular,
    lineHeight: typo.lineHeightNormal,
  },
  description: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightRegular,
    lineHeight: typo.lineHeightNormal,
  },
  caption: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightRegular,
    lineHeight: typo.lineHeightNormal,
  },
  label: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightNormal,
  },
  title: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightNormal,
  },
  page: {
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeXl,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
  },
  section: {
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
  },
  subsection: {
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeMd,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
  },
});
