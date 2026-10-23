import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";

export default function Default() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingVars.space3 }}>
      <Heading level={1} size="page">
        Project settings
      </Heading>
      <Heading level={2} size="section">
        Notifications
      </Heading>
      <Heading level={3} size="subsection">
        Email updates
      </Heading>
      <Heading level={4} size="subsection">
        Delivery schedule
      </Heading>
      <Heading level={5} size="subsection">
        Weekly digest
      </Heading>
      <Heading level={6} size="subsection">
        Included projects
      </Heading>
    </div>
  );
}
