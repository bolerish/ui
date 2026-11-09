import { Button } from "@bolerish/ui/button";
import { PlusIcon, DotsThreeIcon, XIcon } from "@phosphor-icons/react";

export default function IconButtons() {
  return (
    <>
      <Button aria-label="Add item" size="icon">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button aria-label="More actions" size="icon" variant="secondary">
        <DotsThreeIcon aria-hidden="true" />
      </Button>
      <Button aria-label="Close" size="icon" variant="ghost">
        <XIcon aria-hidden="true" />
      </Button>
    </>
  );
}
