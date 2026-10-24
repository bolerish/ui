import { Switch } from "@bolerish/ui/switch";

export default function States() {
  return (
    <>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Unavailable" disabled />
    </>
  );
}
