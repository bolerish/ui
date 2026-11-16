import { Paragraph } from "@bolerish/ui/paragraph";
import { ScrollArea, ScrollAreaViewport, ScrollAreaContent } from "@bolerish/ui/scroll-area";

export const propExamples = {
  scrollbars: {
    vertical: (
      <ScrollArea scrollbars="vertical" style={{ height: "8rem", width: "100%" }}>
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <Paragraph>
              First project update with a long description that extends beyond the viewport.
            </Paragraph>
            <Paragraph>Second project update.</Paragraph>
            <Paragraph>Third project update.</Paragraph>
            <Paragraph>Fourth project update.</Paragraph>
            <Paragraph>Fifth project update.</Paragraph>
            <Paragraph>Sixth project update.</Paragraph>
          </ScrollAreaContent>
        </ScrollAreaViewport>
      </ScrollArea>
    ),
    horizontal: (
      <ScrollArea scrollbars="horizontal" style={{ height: "8rem", width: "100%" }}>
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <Paragraph>
              First project update with a long description that extends beyond the viewport.
            </Paragraph>
            <Paragraph>Second project update.</Paragraph>
            <Paragraph>Third project update.</Paragraph>
            <Paragraph>Fourth project update.</Paragraph>
            <Paragraph>Fifth project update.</Paragraph>
            <Paragraph>Sixth project update.</Paragraph>
          </ScrollAreaContent>
        </ScrollAreaViewport>
      </ScrollArea>
    ),
    both: (
      <ScrollArea scrollbars="both" style={{ height: "8rem", width: "100%" }}>
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <Paragraph>
              First project update with a long description that extends beyond the viewport.
            </Paragraph>
            <Paragraph>Second project update.</Paragraph>
            <Paragraph>Third project update.</Paragraph>
            <Paragraph>Fourth project update.</Paragraph>
            <Paragraph>Fifth project update.</Paragraph>
            <Paragraph>Sixth project update.</Paragraph>
          </ScrollAreaContent>
        </ScrollAreaViewport>
      </ScrollArea>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["scrollbars"]["vertical"]
    /* @example-end */
  );
}
