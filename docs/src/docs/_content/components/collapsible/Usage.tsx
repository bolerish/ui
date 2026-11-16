import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  CollapsibleContent,
} from "@bolerish/ui/collapsible";

export default function Usage() {
  return (
    /* @example-start */
    <Collapsible>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsiblePanel>
        <CollapsibleContent>Order details.</CollapsibleContent>
      </CollapsiblePanel>
    </Collapsible>
    /* @example-end */
  );
}
