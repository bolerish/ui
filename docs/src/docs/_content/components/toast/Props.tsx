import { ComponentExample } from "@/docs/_ui/ComponentPreview";

export const propExamples = {
  position: {
    "top-left": <ComponentExample name="toast--PositionTopLeft" isolated />,
    "top-center": <ComponentExample name="toast--PositionTopCenter" isolated />,
    "top-right": <ComponentExample name="toast--PositionTopRight" isolated />,
    "bottom-left": <ComponentExample name="toast--PositionBottomLeft" isolated />,
    "bottom-center": <ComponentExample name="toast--PositionBottomCenter" isolated />,
    "bottom-right": <ComponentExample name="toast--PositionBottomRight" isolated />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["position"]["top-left"]
    /* @example-end */
  );
}
