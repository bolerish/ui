import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bolerish/ui/accordion";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  componentWidth: {
    maxWidth: "28rem",
    width: "100%",
  },
});
export default function OpenMultipleItems() {
  return (
    <div {...stylex.props(layout.preview, layout.componentWidth)}>
      <Accordion defaultValue={["email", "push"]} multiple>
        <AccordionItem value="email">
          <AccordionTrigger>Email notifications</AccordionTrigger>
          <AccordionContent>
            Receive activity updates and weekly summaries by email.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="push">
          <AccordionTrigger>Push notifications</AccordionTrigger>
          <AccordionContent>
            Receive deadline and comment notifications right away.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
