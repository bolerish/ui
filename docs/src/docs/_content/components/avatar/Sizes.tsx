import { Avatar, AvatarBadge, AvatarFallback } from "@bolerish/ui/avatar";

export default function Sizes() {
  return (
    <>
      {/* @example-start */}
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
      {/* @example-end */}
    </>
  );
}
