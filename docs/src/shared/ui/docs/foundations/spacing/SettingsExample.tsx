import { layoutVars, spacingRoleVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Card } from "@bolerish/ui/card";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@bolerish/ui/field";
import { Heading } from "@bolerish/ui/heading";
import { Input } from "@bolerish/ui/input";
import { Spinner } from "@bolerish/ui/spinner";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacingRoleVars.sectionGap,
    maxWidth: layoutVars.contentMaxWidth,
    paddingInline: spacingRoleVars.pageGutter,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: spacingRoleVars.fieldGap,
    padding: spacingRoleVars.panelPadding,
  },
  text: {
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeMd,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  row: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: spacingRoleVars.inlineGap },
});

export default function SettingsExample() {
  return (
    <section {...stylex.props(styles.page)}>
      <Heading level={2} size="section">
        Preferences
      </Heading>
      <p {...stylex.props(styles.text)}>
        Use the unit, density, heading font and motion toolbar controls to compare shared tokens.
      </p>
      <Card xstyle={styles.panel}>
        <FieldGroup>
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <Input placeholder="Minyeong" />
            <FieldDescription>Related fields use fieldGap.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Project</FieldLabel>
            <Input placeholder="@bolerish/ui" />
          </Field>
        </FieldGroup>
        <div {...stylex.props(styles.row)}>
          <Button>Save preferences</Button>
          <Spinner />
          <span {...stylex.props(styles.text)}>
            Saving status stays visible when motion is reduced.
          </span>
        </div>
      </Card>
    </section>
  );
}
