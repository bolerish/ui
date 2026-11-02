import { colorVars } from "@bolerish/tokens/semantic.stylex";
import {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@bolerish/ui/carousel";
import type { CSSProperties } from "react";

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
export default function ArrowOnly() {
  return (
    <Carousel
      orientation="horizontal"
      controlsPlacement="outside"
      style={styles.root}
      aria-label="ArrowOnly carousel"
    >
      <CarouselViewport>
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((value) => (
            <CarouselItem key={value} style={styles.slide}>
              Slide {value}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <CarouselPrevious variant="ghost" />
      <CarouselNext variant="ghost" />
    </Carousel>
  );
}
