import { InputOTP, InputOTPGroup, InputOTPSlot } from "@bolerish/ui/input-otp";

export default function Usage() {
  return (
    /* @example-start */
    <InputOTP length={6} aria-label="Verification code">
      <InputOTPGroup>
        <InputOTPSlot aria-label="Digit 1" />
        <InputOTPSlot aria-label="Digit 2" />
        <InputOTPSlot aria-label="Digit 3" />
        <InputOTPSlot aria-label="Digit 4" />
        <InputOTPSlot aria-label="Digit 5" />
        <InputOTPSlot aria-label="Digit 6" />
      </InputOTPGroup>
    </InputOTP>
    /* @example-end */
  );
}
