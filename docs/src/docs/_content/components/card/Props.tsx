import { Card, CardHeader, CardTitle, CardContent } from "@bolerish/ui/card";

export const propExamples = {
  variant: {
    default: (
      <Card variant="default">
        <CardHeader>
          <CardTitle>Project</CardTitle>
        </CardHeader>
        <CardContent>Project details</CardContent>
      </Card>
    ),
    translucent: (
      <Card variant="translucent">
        <CardHeader>
          <CardTitle>Project</CardTitle>
        </CardHeader>
        <CardContent>Project details</CardContent>
      </Card>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["default"]
    /* @example-end */
  );
}
