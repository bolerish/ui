import { Switch } from "@bolerish/ui/switch";
export default function Default() {
  return (
    <>
      {/* @example-start */}
      <Switch defaultChecked aria-label="Activity visibility" id="activity-visibility" />
      <Switch disabled aria-label="Admin-only setting" id="admin-only" />
      {/* @example-end */}
    </>
  );
}
