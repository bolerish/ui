import { Button } from "@bolerish/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@bolerish/ui/item";
import { DotsThreeIcon, FolderIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemMedia>
          <FolderIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Design system</ItemTitle>
          <ItemDescription>Last edited today at 2:18 PM</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button aria-label="More actions" size="icon" variant="ghost">
            <DotsThreeIcon aria-hidden="true" size="1rem" />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
