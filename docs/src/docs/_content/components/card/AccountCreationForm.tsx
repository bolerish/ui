import { sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bolerish/ui/card";
import { Input } from "@bolerish/ui/input";
import * as stylex from "@stylexjs/stylex";

/* @example-start */
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space4,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
  },
  form: { maxWidth: sizeVars.contentSm },
});
/* @example-end */

export default function AccountCreationForm() {
  return (
    <div {...stylex.props(layout.preview)}>
      {/* @example-start */}
      <Card xstyle={layout.form}>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Enter the name and email you’ll use for the service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form {...stylex.props(layout.stack)}>
            <label htmlFor="account-name" {...stylex.props(layout.field)}>
              Name
              <Input id="account-name" placeholder="Jordan Lee" />
            </label>
            <label htmlFor="account-email" {...stylex.props(layout.field)}>
              Email
              <Input id="account-email" type="email" placeholder="hello@example.com" />
            </label>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Create account</Button>
        </CardFooter>
      </Card>
      {/* @example-end */}
    </div>
  );
}
