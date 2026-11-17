import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Card, CardContent } from "@bolerish/ui/card";
import {
  Carousel,
  type CarouselProps,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@bolerish/ui/carousel";

export const propExamples = {
  controlsPlacement: {
    outside: <CardCarousel controlsPlacement="outside" />,
    inside: <CardCarousel controlsPlacement="inside" />,
  },
  orientation: {
    horizontal: <CardCarousel orientation="horizontal" />,
    vertical: <CardCarousel orientation="vertical" />,
  },
  slideRatio: {
    balanced: <CardCarousel slideRatio={[1, 1]} />,
    peek: <CardCarousel slideRatio={[70, 20]} />,
  },
};

export default function Props() {
  return propExamples.controlsPlacement.outside;
}

function CardCarousel({
  controlsPlacement,
  orientation,
  slideRatio,
}: Pick<CarouselProps, "controlsPlacement" | "orientation" | "slideRatio">) {
  return (
    <div style={{ width: "100%", padding: spacingVars.space12 }}>
      <Carousel
        aria-label="Featured cards"
        controlsPlacement={controlsPlacement}
        orientation={orientation}
        slideRatio={slideRatio}
        style={{ height: "12rem" }}
      >
        <CarouselContent>
          <CarouselItem>
            <Card>
              <CardContent style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}>
                First slide
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}>
                Second slide
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}>
                Third slide
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
