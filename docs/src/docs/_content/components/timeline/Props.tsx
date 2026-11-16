import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
} from "@bolerish/ui/timeline";

export const propExamples = {
  variant: {
    default: (
      <Timeline>
        <TimelineItem>
          <TimelineIndicator variant="default" />
          <TimelineContent>
            <TimelineTitle>default</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    ),
    active: (
      <Timeline>
        <TimelineItem>
          <TimelineIndicator variant="active" />
          <TimelineContent>
            <TimelineTitle>active</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    ),
    complete: (
      <Timeline>
        <TimelineItem>
          <TimelineIndicator variant="complete" />
          <TimelineContent>
            <TimelineTitle>complete</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    ),
    error: (
      <Timeline>
        <TimelineItem>
          <TimelineIndicator variant="error" />
          <TimelineContent>
            <TimelineTitle>error</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["default"]
    /* @example-end */
  );
}
