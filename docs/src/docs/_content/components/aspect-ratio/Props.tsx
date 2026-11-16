import { AspectRatio } from "@bolerish/ui/aspect-ratio";
export const propExamples = {
  ratio: {
    square: (
      <figure style={{ margin: 0, width: "100%", maxWidth: "18rem" }}>
        <AspectRatio ratio={1}>
          <img
            src="/images/hangang.webp"
            alt="Night view of the Han River"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </AspectRatio>
        <figcaption>Photo by Minyeong Jeong</figcaption>
      </figure>
    ),
    standard: (
      <figure style={{ margin: 0, width: "100%", maxWidth: "18rem" }}>
        <AspectRatio ratio={4 / 3}>
          <img
            src="/images/hangang.webp"
            alt="Night view of the Han River"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </AspectRatio>
        <figcaption>Photo by Minyeong Jeong</figcaption>
      </figure>
    ),
    wide: (
      <figure style={{ margin: 0, width: "100%", maxWidth: "18rem" }}>
        <AspectRatio ratio={16 / 9}>
          <img
            src="/images/hangang.webp"
            alt="Night view of the Han River"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </AspectRatio>
        <figcaption>Photo by Minyeong Jeong</figcaption>
      </figure>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples.ratio.square
    /* @example-end */
  );
}
