import { Switch } from "@bolerish/ui/switch";
export default function Default() {
  return (
    <>
      <Switch defaultChecked id="activity-visibility" />
      <Switch disabled id="admin-only" />
    </>
  );
}
