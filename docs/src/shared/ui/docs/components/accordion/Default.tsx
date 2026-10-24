import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bolerish/ui/accordion";

export default function Default() {
  return (
    <Accordion defaultValue={["shipping"]}>
      <AccordionItem value="shipping">
        <AccordionTrigger>How long does delivery take?</AccordionTrigger>
        <AccordionContent>Standard delivery takes 2–3 business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>How do I request a return?</AccordionTrigger>
        <AccordionContent>Select an item and reason from your order history.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
