import { Field, FieldLabel } from "@bolerish/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@bolerish/ui/input-otp";
export default function Default() {
  return (
    <Field>
      <FieldLabel>6-digit verification code</FieldLabel>
      <InputOTP length={6}>
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot
              key={index}
              aria-label={index === 0 ? undefined : `Verification digit ${index + 1} of 6`}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </Field>
  );
}
