import { Toggle } from "@bolerish/ui/toggle";

export const propExamples = {
  defaultPressed: {
    false: <Toggle defaultPressed={false}>Bold</Toggle>,
    true: <Toggle defaultPressed={true}>Bold</Toggle>,
  },
  disabled: {
    false: <Toggle disabled={false}>Bold</Toggle>,
    true: <Toggle disabled={true}>Bold</Toggle>,
  },
  size: {
    sm: <Toggle size="sm">Bold</Toggle>,
    md: <Toggle size="md">Bold</Toggle>,
    lg: <Toggle size="lg">Bold</Toggle>,
  },
  variant: {
    default: <Toggle variant="default">Bold</Toggle>,
    outline: <Toggle variant="outline">Bold</Toggle>,
    soft: <Toggle variant="soft">Bold</Toggle>,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["defaultPressed"]["false"]
    /* @example-end */
  );
}
