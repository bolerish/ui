import { Input } from "@bolerish/ui/input";
import { Label } from "@bolerish/ui/label";
export default function Default() {
  return (
    <div>
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" placeholder="Jordan Lee" />
    </div>
  );
}
