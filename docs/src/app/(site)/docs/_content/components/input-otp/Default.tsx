import { InputOTP, InputOTPGroup, InputOTPSlot } from "@bolerish/ui/input-otp";
export default function Default() {
  return (
    <InputOTP aria-label="6-digit verification code" length={6}>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, index) => (
          <InputOTPSlot key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
