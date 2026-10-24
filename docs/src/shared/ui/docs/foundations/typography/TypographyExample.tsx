import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Heading } from "@bolerish/ui/heading";
import { P } from "@bolerish/ui/p";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  section: { display: "flex", flexDirection: "column", gap: spacingVars.space3 },
});

export default function TypographyExample() {
  return (
    <section {...stylex.props(styles.section)}>
      <Heading level={2} size="section">
        Notifications
      </Heading>
      <P>Choose which project updates you receive.</P>
      <P variant="description">You can change these preferences at any time.</P>
      <P variant="caption">Last updated today</P>
    </section>
  );
}
