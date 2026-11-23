import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bolerish/ui/card";
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
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>CardContent</p>
              </CardContent>
              <CardFooter>
                <p>CardFooter</p>
              </CardFooter>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>CardContent</p>
              </CardContent>
              <CardFooter>
                <p>CardFooter</p>
              </CardFooter>
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
