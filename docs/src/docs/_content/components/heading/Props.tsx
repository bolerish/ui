import { Heading } from "@bolerish/ui/heading";

import { ComponentExample } from "@/docs/_ui/ComponentPreview";

export const propExamples = {
  level: {
    "1": <ComponentExample name="heading--LevelOne" isolated />,
    "2": <Heading level={2}>Project settings</Heading>,
    "3": <Heading level={3}>Project settings</Heading>,
    "4": <Heading level={4}>Project settings</Heading>,
    "5": <Heading level={5}>Project settings</Heading>,
    "6": <Heading level={6}>Project settings</Heading>,
  },
  size: {
    page: (
      <Heading level={3} size="page">
        Project settings
      </Heading>
    ),
    section: (
      <Heading level={3} size="section">
        Project settings
      </Heading>
    ),
    subsection: (
      <Heading level={3} size="subsection">
        Project settings
      </Heading>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["level"]["1"]
    /* @example-end */
  );
}
