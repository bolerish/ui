import { Progress } from "@bolerish/ui/progress";

export const propExamples = {
  value: {
    "0": <Progress aria-label="Upload progress" value={0} />,
    "50": <Progress aria-label="Upload progress" value={50} />,
    "100": <Progress aria-label="Upload progress" value={100} />,
    null: <Progress aria-label="Upload progress" value={null} />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["value"]["0"]
    /* @example-end */
  );
}
