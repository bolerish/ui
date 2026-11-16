import { Button } from "@bolerish/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@bolerish/ui/popover";

export const propExamples = {
  align: {
    start: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent align="start">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    center: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent align="center">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    end: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent align="end">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
  },
  side: {
    top: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="top">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    right: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="right">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    bottom: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="bottom">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    left: (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="left">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    "inline-start": (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="inline-start">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
    ),
    "inline-end": (
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Details</Button>} />
        <PopoverContent side="inline-end">
          <PopoverTitle>Project details</PopoverTitle>
          <PopoverDescription>Recently updated.</PopoverDescription>
        </PopoverContent>
      </Popover>
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
