import { Avatar, AvatarBadge, AvatarFallback } from "@bolerish/ui/avatar";

export default function Sizes() {
  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>MJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MY</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>DS</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </>
  );
}
