import { Checkbox } from "@bolerish/ui/checkbox";

export const propExamples = {
  defaultChecked: {
    false: <Checkbox aria-label="Enable notifications" defaultChecked={false} />,
    true: <Checkbox aria-label="Enable notifications" defaultChecked={true} />,
  },
  disabled: {
    false: <Checkbox aria-label="Enable notifications" disabled={false} />,
    true: <Checkbox aria-label="Enable notifications" disabled={true} />,
  },
  indeterminate: {
    false: <Checkbox aria-label="Enable notifications" indeterminate={false} />,
    true: <Checkbox aria-label="Enable notifications" indeterminate={true} />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["defaultChecked"]["false"]
    /* @example-end */
  );
}
