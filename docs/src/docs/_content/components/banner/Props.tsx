import { Banner, BannerTitle, BannerDescription } from "@bolerish/ui/banner";

export const propExamples = {
  size: {
    sm: (
      <Banner size="sm">
        <BannerTitle>Connection restored</BannerTitle>
        <BannerDescription>Your changes are saved.</BannerDescription>
      </Banner>
    ),
    md: (
      <Banner size="md">
        <BannerTitle>Connection restored</BannerTitle>
        <BannerDescription>Your changes are saved.</BannerDescription>
      </Banner>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["size"]["sm"]
    /* @example-end */
  );
}
