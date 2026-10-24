import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";
export default function States() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]} variant="outline">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem disabled value="center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}
