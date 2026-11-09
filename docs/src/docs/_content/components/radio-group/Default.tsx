import { Field, FieldLabel } from "@bolerish/ui/field";
import { Label } from "@bolerish/ui/label";
import { RadioGroup, RadioGroupItem } from "@bolerish/ui/radio-group";
export default function Default() {
  return (
    <Field>
      <FieldLabel>Notification frequency</FieldLabel>
      <RadioGroup defaultValue="daily">
        <Label>
          <RadioGroupItem value="daily" />
          Daily
        </Label>
        <Label>
          <RadioGroupItem value="weekly" />
          Weekly
        </Label>
      </RadioGroup>
    </Field>
  );
}
