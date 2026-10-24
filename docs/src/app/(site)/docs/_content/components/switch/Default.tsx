import { Switch } from "@bolerish/ui/switch";
export default function Default() {
  return (
    <>
      <Switch defaultChecked aria-label="Activity visibility" id="activity-visibility" />
      <Switch disabled aria-label="Admin-only setting" id="admin-only" />
    </>
  );
}
