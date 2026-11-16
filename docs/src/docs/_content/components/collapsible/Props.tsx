import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  CollapsibleContent,
} from "@bolerish/ui/collapsible";

export const propExamples = {
  defaultOpen: {
    false: (
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>
          <CollapsibleContent>Order details.</CollapsibleContent>
        </CollapsiblePanel>
      </Collapsible>
    ),
    true: (
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>
          <CollapsibleContent>Order details.</CollapsibleContent>
        </CollapsiblePanel>
      </Collapsible>
    ),
  },
  disabled: {
    false: (
      <Collapsible disabled={false}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>
          <CollapsibleContent>Order details.</CollapsibleContent>
        </CollapsiblePanel>
      </Collapsible>
    ),
    true: (
      <Collapsible disabled={true}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>
          <CollapsibleContent>Order details.</CollapsibleContent>
        </CollapsiblePanel>
      </Collapsible>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["defaultOpen"]["false"]
    /* @example-end */
  );
}
