import { Badge } from "@bolerish/ui/badge";

function BadgeExample() {
  return (
    <>
      {/* @example-start */}
      <Badge>In progress</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Unread</Badge>
      <Badge variant="ghost">Optional</Badge>
      {/* @example-end */}
    </>
  );
}
export default function Variants() {
  return <BadgeExample />;
}
