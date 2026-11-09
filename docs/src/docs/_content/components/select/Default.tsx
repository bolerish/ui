import { Field, FieldDescription, FieldLabel } from "@bolerish/ui/field";
import {
  Select,
  SelectPopup,
  SelectList,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@bolerish/ui/select";

export default function Default() {
  return (
    <Field>
      <FieldLabel>Theme</FieldLabel>
      <Select
        defaultValue="system"
        items={{
          dark: "Dark",
          light: "Light",
          system: "System setting",
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectGroup>
              <SelectLabel>Display mode</SelectLabel>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System setting</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem disabled value="contrast">
              High contrast
            </SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
      <FieldDescription>The selected theme is saved on this device.</FieldDescription>
    </Field>
  );
}
