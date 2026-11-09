import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { BannerDescription, BannerTitle, BannerContent, Banner } from "@bolerish/ui/banner";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  column: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});
export default function Sizes() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <Banner>
        <BannerContent>
          <BannerTitle>Default</BannerTitle>
          <BannerDescription>A standard page-level message.</BannerDescription>
        </BannerContent>
      </Banner>
      <Banner size="sm">
        <BannerContent>
          <BannerTitle>Compact</BannerTitle>
          <BannerDescription>A compact inline message.</BannerDescription>
        </BannerContent>
      </Banner>
    </div>
  );
}
