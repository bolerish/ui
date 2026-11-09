import { Button } from "@bolerish/ui/button";
import { Spinner } from "@bolerish/ui/spinner";

export default function States() {
  return (
    <>
      <Button>Save</Button>
      <Button disabled>Save unavailable</Button>
      <Button disabled variant="secondary">
        Preview unavailable
      </Button>
      <Button disabled variant="outline">
        Outline unavailable
      </Button>
      <Button disabled variant="ghost">
        Close unavailable
      </Button>
      <Button disabled>
        <Spinner aria-hidden="true" label="" />
        Saving
      </Button>
    </>
  );
}
