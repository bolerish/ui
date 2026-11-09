import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@bolerish/ui/timeline";
import { CheckIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineIndicator variant="complete">
          <CheckIcon aria-hidden="true" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineTitle>Order confirmed</TimelineTitle>
          <TimelineDescription>Your payment was approved.</TimelineDescription>
          <TimelineTime dateTime="2026-09-05T09:20:00Z">9:20 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
