import { Item, ItemContent, ItemTitle, ItemDescription } from "@bolerish/ui/item";

export const propExamples = {
  size: {
    xs: (
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
    sm: (
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
    default: (
      <Item size="default">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
  },
  variant: {
    default: (
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
    muted: (
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
    outline: (
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Project</ItemTitle>
          <ItemDescription>Project details.</ItemDescription>
        </ItemContent>
      </Item>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["size"]["xs"]
    /* @example-end */
  );
}
