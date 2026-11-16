import { InputOTP, InputOTPGroup, InputOTPSlot } from "@bolerish/ui/input-otp";

export const propExamples = {
  disabled: {
    false: (
      <InputOTP aria-label="Verification code" length={4} disabled={false}>
        <InputOTPGroup>
          <InputOTPSlot aria-label="Digit 1" />
          <InputOTPSlot aria-label="Digit 2" />
          <InputOTPSlot aria-label="Digit 3" />
          <InputOTPSlot aria-label="Digit 4" />
        </InputOTPGroup>
      </InputOTP>
    ),
    true: (
      <InputOTP aria-label="Verification code" length={4} disabled={true}>
        <InputOTPGroup>
          <InputOTPSlot aria-label="Digit 1" />
          <InputOTPSlot aria-label="Digit 2" />
          <InputOTPSlot aria-label="Digit 3" />
          <InputOTPSlot aria-label="Digit 4" />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  length: {
    "4": (
      <InputOTP aria-label="Verification code" length={4}>
        <InputOTPGroup>
          <InputOTPSlot aria-label="Digit 1" />
          <InputOTPSlot aria-label="Digit 2" />
          <InputOTPSlot aria-label="Digit 3" />
          <InputOTPSlot aria-label="Digit 4" />
        </InputOTPGroup>
      </InputOTP>
    ),
    "6": (
      <InputOTP aria-label="Verification code" length={6}>
        <InputOTPGroup>
          <InputOTPSlot aria-label="Digit 1" />
          <InputOTPSlot aria-label="Digit 2" />
          <InputOTPSlot aria-label="Digit 3" />
          <InputOTPSlot aria-label="Digit 4" />
          <InputOTPSlot aria-label="Digit 5" />
          <InputOTPSlot aria-label="Digit 6" />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["disabled"]["false"]
    /* @example-end */
  );
}
