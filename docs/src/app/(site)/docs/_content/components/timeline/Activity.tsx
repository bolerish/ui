import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@bolerish/ui/timeline";
import { CheckIcon } from "@phosphor-icons/react";

export default function Activity() {
  return (
    <Timeline aria-label="Project activity">
      <TimelineItem>
        <TimelineIndicator variant="complete">
          <CheckIcon aria-hidden="true" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineTitle>Review completed</TimelineTitle>
          <TimelineDescription>Changes are ready for the next step.</TimelineDescription>
          <TimelineTime dateTime="2026-10-02T09:00:00+09:00">9:00 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Draft updated</TimelineTitle>
          <TimelineDescription>Two sections were revised.</TimelineDescription>
          <TimelineTime dateTime="2026-10-02T08:30:00+09:00">8:30 AM</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
