import { Button } from "@bolerish/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@bolerish/ui/collapsible";

export default function Default() {
  return (
    <Collapsible>
      <CollapsibleTrigger render={<Button variant="secondary">Order details</Button>} />
      <CollapsiblePanel>
        <CollapsibleContent>2 studio headphones · Delivered</CollapsibleContent>
      </CollapsiblePanel>
    </Collapsible>
  );
}
