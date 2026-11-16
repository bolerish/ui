import { HoverCard, HoverCardTrigger, HoverCardContent } from "@bolerish/ui/hover-card";

export const propExamples = {
  align: {
    start: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent align="start">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    center: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent align="center">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    end: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent align="end">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
  },
  side: {
    top: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="top">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    right: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="right">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    bottom: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="bottom">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    left: (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="left">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    "inline-start": (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="inline-start">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
    "inline-end": (
      <HoverCard>
        <HoverCardTrigger href="#">@jordan</HoverCardTrigger>
        <HoverCardContent side="inline-end">Jordan Lee</HoverCardContent>
      </HoverCard>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["start"]
    /* @example-end */
  );
}
