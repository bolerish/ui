import { Paragraph } from "@bolerish/ui/paragraph";
import { ScrollArea, ScrollAreaViewport, ScrollAreaContent } from "@bolerish/ui/scroll-area";
export default function Usage() {
  return (
    /* @example-start */
    <ScrollArea style={{ height: "8rem", width: "100%" }}>
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <Paragraph>First project update.</Paragraph>
          <Paragraph>Second project update.</Paragraph>
          <Paragraph>Third project update.</Paragraph>
          <Paragraph>Fourth project update.</Paragraph>
          <Paragraph>Fifth project update.</Paragraph>
          <Paragraph>Sixth project update.</Paragraph>
          <Paragraph>Seventh project update.</Paragraph>
          <Paragraph>Eighth project update.</Paragraph>
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </ScrollArea>
    /* @example-end */
  );
}
