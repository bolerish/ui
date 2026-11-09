import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bolerish/ui/card";
import { gradient } from "@bolerish/ui/gradient";
import { Input } from "@bolerish/ui/input";

export default function SurfaceModes() {
  return (
    <>
      {(["solid", "liquid"] as const).map((surface) => (
        <section
          key={surface}
          data-bolerish-surface={surface}
          {...gradient.props({ colors: ["#80414b", "#46566c"] })}
        >
          <Card>
            <CardHeader>
              <CardTitle>{surface === "solid" ? "Solid" : "Liquid"}</CardTitle>
              <CardDescription>The same components and variants.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input aria-label={`${surface} example`} placeholder="Write something…" />
            </CardContent>
          </Card>
        </section>
      ))}
    </>
  );
}
