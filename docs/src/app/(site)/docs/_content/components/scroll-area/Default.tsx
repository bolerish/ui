import { ScrollArea, ScrollAreaViewport, ScrollAreaContent } from "@bolerish/ui/scroll-area";
import { Separator } from "@bolerish/ui/separator";
import type { CSSProperties } from "react";

const styles = {
  viewport: {
    height: "14rem",
    width: "20rem",
  },
  item: {
    paddingBlock: "0.75rem",
  },
} satisfies Record<string, CSSProperties>;
const activities = [
  "Completed the deployment checklist.",
  "Sent a design review request.",
  "Updated the sign-in screen.",
  "Invited a new member to the project.",
  "Added a user interview to the calendar.",
  "Shared the development environment setup.",
  "Reviewed the error report.",
  "Updated the prototype link.",
  "Reviewed this week’s goals.",
  "Recorded decisions in the meeting notes.",
  "Updated the brand guidelines.",
  "Confirmed the next release date.",
];
export default function Default() {
  return (
    <ScrollArea style={styles.viewport}>
      <ScrollAreaViewport>
        <ScrollAreaContent>
          {activities.map((activity, index) => (
            <div key={index}>
              <div style={styles.item}>{activity}</div>
              {index < 11 ? <Separator /> : null}
            </div>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </ScrollArea>
  );
}
