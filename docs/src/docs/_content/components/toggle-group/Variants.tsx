import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";

export default function Variants() {
  return (
    <>
      {/* @example-start */}
      <ToggleGroup aria-label="Default alignment" defaultValue={["left"]}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Outlined alignment" defaultValue={["left"]} variant="outline">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Soft alignment" defaultValue={["left"]} variant="soft">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      {/* @example-end */}
    </>
  );
}
