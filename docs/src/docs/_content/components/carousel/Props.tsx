import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Card, CardContent } from "@bolerish/ui/card";
import {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@bolerish/ui/carousel";

export const propExamples = {
  controlsPlacement: {
    outside: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel
          aria-label="Featured cards"
          controlsPlacement="outside"
          style={{ height: "12rem" }}
        >
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
    inside: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel
          aria-label="Featured cards"
          controlsPlacement="inside"
          style={{ height: "12rem" }}
        >
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
  },
  orientation: {
    horizontal: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel aria-label="Featured cards" orientation="horizontal" style={{ height: "12rem" }}>
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
    vertical: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel aria-label="Featured cards" orientation="vertical" style={{ height: "12rem" }}>
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
  },
  slideRatio: {
    balanced: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel aria-label="Featured cards" slideRatio={[1, 1]} style={{ height: "12rem" }}>
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
    peek: (
      <div style={{ width: "100%", padding: spacingVars.space12 }}>
        <Carousel aria-label="Featured cards" slideRatio={[70, 20]} style={{ height: "12rem" }}>
          <CarouselViewport>
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    First slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Second slide
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent
                    style={{ display: "grid", placeItems: "center", minHeight: "12rem" }}
                  >
                    Third slide
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </CarouselViewport>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["controlsPlacement"]["outside"]
    /* @example-end */
  );
}
