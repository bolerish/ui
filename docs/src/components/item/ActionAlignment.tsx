import { Button } from "@bolerish/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@bolerish/ui/item";
export default function ActionAlignment() {
  return (
    <ItemGroup>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Item key={size} variant="outline">
          <ItemContent>
            <ItemTitle>Project settings</ItemTitle>
            <ItemDescription>
              Review project access and notification preferences.
              <br />
              Changes apply to everyone in the workspace.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size={size} variant="secondary">
              Edit
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
