import { Toggle } from "@bolerish/ui/toggle";

export default function States() {
  return (
    <>
      {/* @example-start */}
      <Toggle>Off</Toggle>
      <Toggle defaultPressed>On</Toggle>
      <Toggle disabled>Unavailable</Toggle>
      {/* @example-end */}
    </>
  );
}
