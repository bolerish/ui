import { Toggle } from "@bolerish/ui/toggle";
export default function Default() {
  return (
    <div>
      <Toggle defaultPressed>Bold</Toggle>
      <Toggle variant="outline">Italic</Toggle>
    </div>
  );
}
