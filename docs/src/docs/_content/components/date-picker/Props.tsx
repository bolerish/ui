import { DatePicker } from "@bolerish/ui/date-picker";

export const propExamples = {
  disabled: { false: <DatePicker disabled={false} />, true: <DatePicker disabled={true} /> },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["disabled"]["false"]
    /* @example-end */
  );
}
