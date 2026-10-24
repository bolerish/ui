import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { AspectRatio } from "@bolerish/ui/aspect-ratio";

export default function Default() {
  return (
    <figure style={{ margin: 0, width: "100%", maxWidth: "36rem" }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="/images/hangang.webp"
          alt="Night view of the Han River with grasses in the foreground and city lights across the water"
          width={5712}
          height={4284}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </AspectRatio>
      <figcaption style={{ marginTop: spacingVars.space2, fontSize: typo.fontSizeXs }}>
        16:9 · Photo by Minyeong Jeong
      </figcaption>
    </figure>
  );
}
