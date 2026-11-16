import { Textarea } from "@bolerish/ui/textarea";

export const propExamples = {
  "aria-invalid": {
    false: <Textarea aria-label="Description" aria-invalid={false} defaultValue="Project notes" />,
    true: <Textarea aria-label="Description" aria-invalid={true} defaultValue="Project notes" />,
  },
  disabled: {
    false: <Textarea aria-label="Description" disabled={false} defaultValue="Project notes" />,
    true: <Textarea aria-label="Description" disabled={true} defaultValue="Project notes" />,
  },
  rows: {
    "2": <Textarea aria-label="Description" rows={2} defaultValue="Project notes" />,
    "4": <Textarea aria-label="Description" rows={4} defaultValue="Project notes" />,
    "6": <Textarea aria-label="Description" rows={6} defaultValue="Project notes" />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["aria-invalid"]["false"]
    /* @example-end */
  );
}
