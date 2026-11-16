import { Button } from "@bolerish/ui/button";
import { CaretRightIcon, PlusIcon } from "@phosphor-icons/react";

export const propExamples = {
  align: {
    start: (
      <Button align="start" style={{ width: "100%" }}>
        Continue
        <CaretRightIcon aria-hidden />
      </Button>
    ),
    center: (
      <Button align="center" style={{ width: "100%" }}>
        Continue
        <CaretRightIcon aria-hidden />
      </Button>
    ),
    end: (
      <Button align="end" style={{ width: "100%" }}>
        Continue
        <CaretRightIcon aria-hidden />
      </Button>
    ),
    "space-between": (
      <Button align="space-between" style={{ width: "100%" }}>
        Continue
        <CaretRightIcon aria-hidden />
      </Button>
    ),
  },
  disabled: {
    false: <Button disabled={false}>Save</Button>,
    true: <Button disabled={true}>Save</Button>,
  },
  shape: {
    default: (
      <Button size="icon" shape="default" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
    ),
    square: (
      <Button size="icon" shape="square" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
    ),
    circle: (
      <Button size="icon" shape="circle" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
    ),
  },
  size: {
    sm: <Button size="sm">Save</Button>,
    md: <Button size="md">Save</Button>,
    lg: <Button size="lg">Save</Button>,
    icon: (
      <Button size="icon" shape="default" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
    ),
  },
  variant: {
    primary: <Button variant="primary">Save</Button>,
    secondary: <Button variant="secondary">Save</Button>,
    outline: <Button variant="outline">Save</Button>,
    ghost: <Button variant="ghost">Save</Button>,
    destructive: <Button variant="destructive">Save</Button>,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["start"]
    /* @example-end */
  );
}
