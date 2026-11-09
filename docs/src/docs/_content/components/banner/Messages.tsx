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
export default function Messages() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <Banner>
        <BannerContent>
          <BannerTitle>Information</BannerTitle>
          <BannerDescription>An update is ready.</BannerDescription>
        </BannerContent>
      </Banner>
      <Banner>
        <BannerContent>
          <BannerTitle>Review needed</BannerTitle>
          <BannerDescription>Review this before continuing.</BannerDescription>
        </BannerContent>
      </Banner>
      <Banner>
        <BannerContent>
          <BannerTitle>Couldn’t save changes</BannerTitle>
          <BannerDescription>Your changes could not be saved.</BannerDescription>
        </BannerContent>
      </Banner>
      <Banner>
        <BannerContent>
          <BannerTitle>All caught up</BannerTitle>
          <BannerDescription>No action is required.</BannerDescription>
        </BannerContent>
      </Banner>
    </div>
  );
}
