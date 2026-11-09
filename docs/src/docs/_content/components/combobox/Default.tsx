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

const frameworks = ["React", "Vue", "Svelte", "Solid", "Angular"];
export default function Default() {
  return (
    <Field>
      <FieldLabel>Framework</FieldLabel>
      <Combobox items={frameworks}>
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
  );
}
