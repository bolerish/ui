import { Button } from "@bolerish/ui/button";
import { PlusIcon } from "@phosphor-icons/react/ssr";

export default function Shapes() {
  return (
    <>
      {/* @example-start */}
      <Button size="icon" shape="default" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
      <Button size="icon" shape="square" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
      <Button size="icon" shape="circle" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
      {/* @example-end */}
    </>
  );
}
