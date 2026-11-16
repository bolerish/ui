import { Separator } from "@bolerish/ui/separator";

export const propExamples = {
  orientation: {
    horizontal: (
      <div style={{ width: "100%", height: "3rem" }}>
        <Separator orientation="horizontal" />
      </div>
    ),
    vertical: (
      <div style={{ width: "100%", height: "3rem" }}>
        <Separator orientation="vertical" />
      </div>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["orientation"]["horizontal"]
    /* @example-end */
  );
}
