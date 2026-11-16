import { Label } from "@bolerish/ui/label";
import { RadioGroup, RadioGroupItem } from "@bolerish/ui/radio-group";

export const propExamples = {
  disabled: {
    false: (
      <RadioGroup defaultValue="daily" disabled={false}>
        <Label>
          <RadioGroupItem value="daily" />
          Daily
        </Label>
        <Label>
          <RadioGroupItem value="weekly" />
          Weekly
        </Label>
      </RadioGroup>
    ),
    true: (
      <RadioGroup defaultValue="daily" disabled={true}>
        <Label>
          <RadioGroupItem value="daily" />
          Daily
        </Label>
        <Label>
          <RadioGroupItem value="weekly" />
          Weekly
        </Label>
      </RadioGroup>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["disabled"]["false"]
    /* @example-end */
  );
}
