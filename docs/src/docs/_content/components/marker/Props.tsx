import { Marker, MarkerContent } from "@bolerish/ui/marker";

export const propExamples = {
  variant: {
    default: (
      <Marker variant="default">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    ),
    border: (
      <Marker variant="border">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    ),
    separator: (
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
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
