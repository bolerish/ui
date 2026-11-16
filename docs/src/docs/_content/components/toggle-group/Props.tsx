import { ToggleGroup, ToggleGroupItem } from "@bolerish/ui/toggle-group";

export const propExamples = {
  disabled: {
    false: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} disabled={false}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    true: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} disabled={true}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  multiple: {
    false: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} multiple={false}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    true: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} multiple={true}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  size: {
    sm: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} size="sm">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    md: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} size="md">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    lg: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} size="lg">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  variant: {
    default: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} variant="default">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    outline: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} variant="outline">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
    soft: (
      <ToggleGroup aria-label="Text style" defaultValue={["bold"]} variant="soft">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
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
