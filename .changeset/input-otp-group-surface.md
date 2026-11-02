---
"@bolerish/ui": patch
---

Apply the OTP input surface to InputOTPGroup instead of the outer InputOTP layout container. Backgrounds now stop at the actual digit group and do not fill unused row space or separators. Slots share the group's background; input behavior, borders and focus indicators are unchanged. Custom compositions should wrap slots in InputOTPGroup to receive the default surface.
