import { Avatar, AvatarFallback } from "@bolerish/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@bolerish/ui/hover-card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@bolerish/ui/item";
export default function Default() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#">@bolerish</HoverCardTrigger>
      <HoverCardContent align="start">
        <Item size="sm">
          <ItemMedia variant="avatar">
            <Avatar>
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>@bolerish/ui</ItemTitle>
            <ItemDescription>
              A calm, consistent design system for product experiences
            </ItemDescription>
          </ItemContent>
        </Item>
      </HoverCardContent>
    </HoverCard>
  );
}
