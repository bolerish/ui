import { Field, FieldLabel, FieldDescription, FieldError } from "@bolerish/ui/field";
import { Input } from "@bolerish/ui/input";

export const propExamples = {
  invalid: {
    false: (
      <Field invalid={false}>
        <FieldLabel>Name</FieldLabel>
        <Input defaultValue="Jordan Lee" />
        <FieldDescription>Enter your display name.</FieldDescription>
      </Field>
    ),
    true: (
      <Field invalid={true}>
        <FieldLabel>Name</FieldLabel>
        <Input aria-invalid defaultValue="Jordan Lee" />
        <FieldDescription>Enter your display name.</FieldDescription>
        <FieldError>Name is required.</FieldError>
      </Field>
    ),
  },
  orientation: {
    vertical: (
      <Field orientation="vertical">
        <FieldLabel>Name</FieldLabel>
        <Input defaultValue="Jordan Lee" />
        <FieldDescription>Enter your display name.</FieldDescription>
      </Field>
    ),
    horizontal: (
      <Field orientation="horizontal">
        <FieldLabel>Name</FieldLabel>
        <Input defaultValue="Jordan Lee" />
        <FieldDescription>Enter your display name.</FieldDescription>
      </Field>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["invalid"]["false"]
    /* @example-end */
  );
}
