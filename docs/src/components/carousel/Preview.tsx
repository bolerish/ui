import { colorVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@bolerish/ui/carousel";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  carousel: {
    maxWidth: "25rem",
  },
  slide: {
    flexBasis: {
      default: "var(--bolerish-carousel-basis, 100%)",
      "@media (max-width: 30rem)": "100%",
    },
    alignItems: "center",
    backgroundColor: colorVars.bgSubtle,
    display: "flex",
    fontSize: typo.fontSizeXl,
    fontWeight: typo.fontWeightSemibold,
    height: "12rem",
    justifyContent: "center",
    padding: spacingVars.space6,
  },
});
export default function Preview() {
  return (
    <Carousel
      aria-label="Featured cards with neighboring preview"
      slideRatio={[70, 20]}
      xstyle={styles.carousel}
    >
      <CarouselViewport>
        <CarouselContent>
          {["1", "2", "3", "4", "5"].map((item) => (
            <CarouselItem key={item} xstyle={styles.slide}>
              Slide {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
