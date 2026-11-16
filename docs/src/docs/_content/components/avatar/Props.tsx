import { Avatar, AvatarFallback } from "@bolerish/ui/avatar";

export const propExamples = {
  size: {
    sm: (
      <Avatar size="sm">
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
    ),
    md: (
      <Avatar size="md">
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
    ),
    lg: (
      <Avatar size="lg">
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["size"]["sm"]
    /* @example-end */
  );
}
