import { Button } from "@bolerish/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@bolerish/ui/tooltip";

export const propExamples = {
  align: {
    start: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent align="start">Additional information.</TooltipContent>
      </Tooltip>
    ),
    center: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent align="center">Additional information.</TooltipContent>
      </Tooltip>
    ),
    end: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent align="end">Additional information.</TooltipContent>
      </Tooltip>
    ),
  },
  side: {
    top: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="top">Additional information.</TooltipContent>
      </Tooltip>
    ),
    right: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="right">Additional information.</TooltipContent>
      </Tooltip>
    ),
    bottom: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="bottom">Additional information.</TooltipContent>
      </Tooltip>
    ),
    left: (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="left">Additional information.</TooltipContent>
      </Tooltip>
    ),
    "inline-start": (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="inline-start">Additional information.</TooltipContent>
      </Tooltip>
    ),
    "inline-end": (
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Help</Button>} />
        <TooltipContent side="inline-end">Additional information.</TooltipContent>
      </Tooltip>
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
