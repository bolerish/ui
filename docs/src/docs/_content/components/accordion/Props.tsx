import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@bolerish/ui/accordion";

export const propExamples = {
  disabled: {
    false: (
      <Accordion disabled={false}>
        <AccordionItem value="one">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First item details.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second item details.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    true: (
      <Accordion disabled={true}>
        <AccordionItem value="one">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First item details.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second item details.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  multiple: {
    false: (
      <Accordion multiple={false}>
        <AccordionItem value="one">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First item details.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second item details.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    true: (
      <Accordion multiple={true}>
        <AccordionItem value="one">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>First item details.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Second item details.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["disabled"]["false"]
    /* @example-end */
  );
}
