import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";

export default function Sizes() {
  return (
    <>
      <ToggleGroup aria-label="Small alignment" defaultValue={["left"]} size="sm">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Default alignment" defaultValue={["left"]} size="md">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Large alignment" defaultValue={["left"]} size="lg">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
