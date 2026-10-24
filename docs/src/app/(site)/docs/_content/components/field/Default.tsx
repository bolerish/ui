import { Checkbox } from "@bolerish/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@bolerish/ui/field";
import { Input } from "@bolerish/ui/input";
export default function Default() {
  return (
    <FieldSet>
      <FieldLegend>Payment details</FieldLegend>
      <p>Payment details are encrypted and handled securely.</p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="cardholder">Cardholder name</FieldLabel>
          <Input id="cardholder" autoComplete="cc-name" defaultValue="Jordan Lee" />
        </Field>
        <Field invalid>
          <FieldLabel htmlFor="card-number">Card number</FieldLabel>
          <Input
            id="card-number"
            aria-invalid
            autoComplete="cc-number"
            defaultValue="1234 5678 9012"
            inputMode="numeric"
          />
          <FieldDescription>Enter all 16 digits.</FieldDescription>
          <FieldError>The card number is incomplete.</FieldError>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="billing-address" aria-labelledby="billing-address-label" defaultChecked />
          <FieldContent>
            <FieldTitle id="billing-address-label">
              Billing address is the same as shipping address.
            </FieldTitle>
            <FieldDescription>
              Clear this option to use a different billing address.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
