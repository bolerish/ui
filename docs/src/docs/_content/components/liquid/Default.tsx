import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Liquid } from "@bolerish/ui/liquid";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  sample: { maxWidth: "100%", width: "22rem" },
  image: { display: "block", height: "100%", objectFit: "cover", width: "100%" },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    padding: spacingVars.space6,
  },
  title: { fontSize: typo.fontSizeLg, fontWeight: typo.fontWeightSemibold, margin: 0 },
  text: { fontSize: typo.fontSizeSm, margin: 0 },
});

export default function Default() {
  return (
    <Liquid
      xstyle={styles.sample}
      background={<img {...stylex.props(styles.image)} src="/images/hangang.webp" alt="" />}
    >
      <div {...stylex.props(styles.content)}>
        <h3 {...stylex.props(styles.title)}>A quiet evening</h3>
        <p {...stylex.props(styles.text)}>One song to remember today.</p>
        <Button variant="outline">Choose a song</Button>
      </div>
    </Liquid>
  );
}
