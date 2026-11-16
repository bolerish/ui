import { ComponentExample } from "@/docs/_ui/ComponentPreview";

export const propExamples = {
  position: {
    "top-left": (
      <ComponentExample name="toast--PositionTopLeft" isolated height={240} width={720} />
    ),
    "top-center": (
      <ComponentExample name="toast--PositionTopCenter" isolated height={240} width={720} />
    ),
    "top-right": (
      <ComponentExample name="toast--PositionTopRight" isolated height={240} width={720} />
    ),
    "bottom-left": (
      <ComponentExample name="toast--PositionBottomLeft" isolated height={240} width={720} />
    ),
    "bottom-center": (
      <ComponentExample name="toast--PositionBottomCenter" isolated height={240} width={720} />
    ),
    "bottom-right": (
      <ComponentExample name="toast--PositionBottomRight" isolated height={240} width={720} />
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["position"]["top-left"]
    /* @example-end */
  );
}
