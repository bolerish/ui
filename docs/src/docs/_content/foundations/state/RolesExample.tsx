import { colorVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Banner, BannerContent, BannerTitle } from "@bolerish/ui/banner";
import { Field, FieldLabel, FieldError } from "@bolerish/ui/field";
import { Input } from "@bolerish/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@bolerish/ui/tabs";
import { Toggle } from "@bolerish/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: { display: "grid", gap: spacingVars.space4 },
  row: { display: "flex", flexWrap: "wrap", gap: spacingVars.space3, alignItems: "center" },
  error: { backgroundColor: colorVars.bgFeedbackError, color: colorVars.fgFeedbackError },
});

export default function RolesExample() {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.row)}>
        <Toggle defaultPressed>Flat selection</Toggle>
        <Toggle defaultPressed disabled>
          Selected, unavailable
        </Toggle>
        <ToggleGroup variant="soft" defaultValue={["list"]} aria-label="Layout setting">
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings panels">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Tabs change the panel; the layout setting above changes a value.
        </TabsContent>
        <TabsContent value="appearance">
          Both use a raised selection inside a subtle group.
        </TabsContent>
      </Tabs>
      <Field invalid>
        <FieldLabel htmlFor="role-email">Email</FieldLabel>
        <Input
          id="role-email"
          defaultValue="alex"
          aria-invalid
          aria-describedby="role-email-error"
        />
        <FieldError id="role-email-error" match>
          Include @ and a domain.
        </FieldError>
      </Field>
      <Banner xstyle={styles.error}>
        <BannerContent>
          <BannerTitle>Could not save settings. Your input is preserved; try again.</BannerTitle>
        </BannerContent>
      </Banner>
    </div>
  );
}
