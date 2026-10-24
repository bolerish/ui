import {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@bolerish/ui/carousel";
import type { CSSProperties } from "react";

const styles = {
  carousel: {
    maxWidth: "25rem",
    width: "calc(100% - 6rem)",
  },
  slide: {
    alignItems: "center",
    display: "flex",
    fontSize: "1.5rem",
    fontWeight: 600,
    height: "12rem",
    justifyContent: "center",
    padding: "1.5rem",
  },
} satisfies Record<string, CSSProperties>;
export default function Default() {
  return (
    <Carousel style={styles.carousel}>
      <CarouselViewport>
        <CarouselContent>
          {["1", "2", "3", "4", "5"].map((item) => (
            <CarouselItem key={item} style={styles.slide}>
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
