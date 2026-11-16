import { Switch } from "@bolerish/ui/switch";

export default function States() {
  return (
    <>
      {/* @example-start */}
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Unavailable" disabled />
      {/* @example-end */}
    </>
  );
}
