import { Button } from "@bolerish/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@bolerish/ui/card";
import { Checkbox } from "@bolerish/ui/checkbox";
import { Input } from "@bolerish/ui/input";
import { Label } from "@bolerish/ui/label";
import { themeClassNames } from "@bolerish/ui/theme";
import { useId } from "react";

export default function BrandThemeExample() {
  const id = useId();
  return (
    <div className={themeClassNames.ocean}>
      <Card>
        <CardHeader>
          <CardTitle>Ocean workspace</CardTitle>
          <CardDescription>Primary actions and focus use the brand palette.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor={id}>Workspace name</Label>
          <Input id={id} defaultValue="Ocean studio" />
          <Label>
            <Checkbox aria-label="Receive project updates" defaultChecked /> Receive project updates
          </Label>
        </CardContent>
        <CardFooter>
          <Button>Save workspace</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
