import { Field, FieldLabel } from "@bolerish/ui/field";
import { NativeSelect, NativeSelectOption } from "@bolerish/ui/native-select";
export default function Default() {
  return (
    <Field>
      <FieldLabel>Language</FieldLabel>
      <NativeSelect defaultValue="ko">
        <NativeSelectOption value="ko">Korean</NativeSelectOption>
        <NativeSelectOption value="en">English</NativeSelectOption>
        <NativeSelectOption value="ja">Japanese</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}
