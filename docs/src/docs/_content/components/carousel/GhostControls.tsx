import { colorVars } from "@bolerish/tokens/semantic.stylex";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@bolerish/ui/carousel";
import type { CSSProperties } from "react";

/* @example-start */
const styles = {
  root: { marginInline: "auto", maxWidth: "25rem", width: "calc(100% - 6rem)" },
  slide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "12rem",
    backgroundColor: colorVars.bgSubtle,
    color: colorVars.fgPrimary,
    fontSize: "1.5rem",
  },
} satisfies Record<string, CSSProperties>;
/* @example-end */

export default function GhostControls() {
  return (
    /* @example-start */
    <Carousel
      orientation="horizontal"
      controlsPlacement="outside"
      style={styles.root}
      aria-label="ArrowOnly carousel"
    >
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((value) => (
          <CarouselItem key={value} style={styles.slide}>
            Slide {value}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="ghost" />
      <CarouselNext variant="ghost" />
    </Carousel>
    /* @example-end */
  );
}
