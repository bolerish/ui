import { Banner, BannerContent, BannerDescription, BannerTitle } from "@bolerish/ui/banner";

export default function Default() {
  return (
    <Banner>
      <BannerContent>
        <BannerTitle>Update available</BannerTitle>
        <BannerDescription>A new version is ready to install.</BannerDescription>
      </BannerContent>
    </Banner>
  );
}
