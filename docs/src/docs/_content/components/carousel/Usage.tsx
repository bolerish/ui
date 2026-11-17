import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Card, CardContent } from "@bolerish/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@bolerish/ui/carousel";
export default function Usage() {
  return (
    <div style={{ width: "100%", maxWidth: "28rem", padding: spacingVars.space12 }}>
      {/* @example-start */}
      <Carousel aria-label="Featured cards">
        <CarouselContent>
          <CarouselItem>
            <Card>
              <CardContent>First slide</CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent>Second slide</CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent>Third slide</CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* @example-end */}
    </div>
  );
}
