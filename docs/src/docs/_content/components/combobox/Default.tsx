import {
  Combobox,
  ComboboxCollection,
  ComboboxPopup,
  ComboboxList,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
} from "@bolerish/ui/combobox";
import { Field, FieldDescription, FieldLabel } from "@bolerish/ui/field";

export default function Default() {
  return (
    /* @example-start */
    <Field>
      <FieldLabel>Framework</FieldLabel>
      <Combobox items={["React", "Vue"]}>
        <ComboboxInput placeholder="Search frameworks" />
        <ComboboxPopup>
          <ComboboxEmpty>No matching frameworks.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(framework: string) => (
                <ComboboxItem key={framework} value={framework}>
                  {framework}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      <FieldDescription>Select the framework used in your project.</FieldDescription>
    </Field>
    /* @example-end */
  );
}
