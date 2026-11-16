import { Paragraph } from "@bolerish/ui/paragraph";

export const propExamples = {
  variant: {
    body: <Paragraph variant="body">Project updates appear here.</Paragraph>,
    description: <Paragraph variant="description">Project updates appear here.</Paragraph>,
    caption: <Paragraph variant="caption">Project updates appear here.</Paragraph>,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["body"]
    /* @example-end */
  );
}
