import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { BannerActions, BannerDescription, BannerContent, Banner } from "@bolerish/ui/banner";
import { Link } from "@bolerish/ui/link";
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
export default function CompactGuidance() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <Banner size="sm">
        <BannerContent>
          <BannerDescription>A DNS record with this name already exists.</BannerDescription>
        </BannerContent>
        <BannerActions>
          {
            <Link href="#" variant="current">
              Manage DNS
            </Link>
          }
        </BannerActions>
      </Banner>
    </div>
  );
}
