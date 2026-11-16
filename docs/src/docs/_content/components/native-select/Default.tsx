import { Field, FieldLabel } from "@bolerish/ui/field";
import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";
import { useId } from "react";
export default function Default() {
  /* @example-start */
  const id = useId();
  /* @example-end */

  return (
    /* @example-start */
    <Field>
      <FieldLabel htmlFor={id}>Language</FieldLabel>
      <NativeSelect id={id} defaultValue="ko">
        <NativeSelectOption value="ko">Korean</NativeSelectOption>
        <NativeSelectOption value="en">English</NativeSelectOption>
        <NativeSelectOption value="ja">Japanese</NativeSelectOption>
      </NativeSelect>
    </Field>
    /* @example-end */
  );
}
