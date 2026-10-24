import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { AspectRatio } from "@bolerish/ui/aspect-ratio";

export default function Default() {
  return (
    <figure style={{ margin: 0, width: "100%", maxWidth: "36rem" }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="/images/hangang.webp"
          srcSet="/images/hangang.webp 576w, /images/hangang-1152.webp 1152w"
          sizes="auto, 576px"
          alt="Night view of the Han River with grasses in the foreground and city lights across the water"
          width={576}
          height={432}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </AspectRatio>
      <figcaption style={{ marginTop: spacingVars.space2, fontSize: typo.fontSizeXs }}>
        16:9 · Photo by Minyeong Jeong
      </figcaption>
    </figure>
  );
}
