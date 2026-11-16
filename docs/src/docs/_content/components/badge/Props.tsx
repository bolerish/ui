import { Badge } from "@bolerish/ui/badge";

export const propExamples = {
  variant: {
    primary: <Badge variant="primary">Status</Badge>,
    secondary: <Badge variant="secondary">Status</Badge>,
    outline: <Badge variant="outline">Status</Badge>,
    ghost: <Badge variant="ghost">Status</Badge>,
    destructive: <Badge variant="destructive">Status</Badge>,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["primary"]
    /* @example-end */
  );
}
