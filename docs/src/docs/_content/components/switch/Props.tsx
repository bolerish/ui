import { Switch } from "@bolerish/ui/switch";

export const propExamples = {
  defaultChecked: {
    false: <Switch aria-label="Enable notifications" defaultChecked={false} />,
    true: <Switch aria-label="Enable notifications" defaultChecked={true} />,
  },
  disabled: {
    false: <Switch aria-label="Enable notifications" disabled={false} />,
    true: <Switch aria-label="Enable notifications" disabled={true} />,
  },
  size: {
    sm: <Switch aria-label="Enable notifications" size="sm" />,
    md: <Switch aria-label="Enable notifications" size="md" />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["defaultChecked"]["false"]
    /* @example-end */
  );
}
