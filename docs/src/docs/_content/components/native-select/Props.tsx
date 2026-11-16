import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";

export const propExamples = {
  disabled: {
    false: (
      <NativeSelect aria-label="Theme" disabled={false}>
        <NativeSelectOption value="light">Light</NativeSelectOption>
        <NativeSelectOption value="dark">Dark</NativeSelectOption>
      </NativeSelect>
    ),
    true: (
      <NativeSelect aria-label="Theme" disabled={true}>
        <NativeSelectOption value="light">Light</NativeSelectOption>
        <NativeSelectOption value="dark">Dark</NativeSelectOption>
      </NativeSelect>
    ),
  },
  size: {
    sm: (
      <NativeSelect aria-label="Theme" size="sm">
        <NativeSelectOption value="light">Light</NativeSelectOption>
        <NativeSelectOption value="dark">Dark</NativeSelectOption>
      </NativeSelect>
    ),
    md: (
      <NativeSelect aria-label="Theme" size="md">
        <NativeSelectOption value="light">Light</NativeSelectOption>
        <NativeSelectOption value="dark">Dark</NativeSelectOption>
      </NativeSelect>
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
