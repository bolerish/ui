import { Field, FieldLabel } from "@bolerish/ui/field";
import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";
import { useId } from "react";
export default function Default() {
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>Language</FieldLabel>
      <NativeSelect id={id} defaultValue="ko">
        <NativeSelectOption value="ko">Korean</NativeSelectOption>
        <NativeSelectOption value="en">English</NativeSelectOption>
        <NativeSelectOption value="ja">Japanese</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}
