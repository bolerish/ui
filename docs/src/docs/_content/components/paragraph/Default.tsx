import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Paragraph } from "@bolerish/ui/paragraph";

export default function Default() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacingVars.space3 }}>
      <Paragraph>Keep every project update in one place.</Paragraph>
      <Paragraph variant="description">
        Choose which notifications you receive. You can change these preferences at any time.
      </Paragraph>
      <Paragraph variant="caption">Last updated today</Paragraph>
    </div>
  );
}
