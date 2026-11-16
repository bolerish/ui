import { Slider } from "@bolerish/ui/slider";

export const propExamples = {
  defaultValue: {
    "0": <Slider aria-label="Volume" defaultValue={0} />,
    "50": <Slider aria-label="Volume" defaultValue={50} />,
    "100": <Slider aria-label="Volume" defaultValue={100} />,
  },
  disabled: {
    false: <Slider aria-label="Volume" disabled={false} defaultValue={40} />,
    true: <Slider aria-label="Volume" disabled={true} defaultValue={40} />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["defaultValue"]["0"]
    /* @example-end */
  );
}
