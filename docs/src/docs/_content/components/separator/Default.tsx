import { Separator } from "@bolerish/ui/separator";
export default function Default() {
  return (
    <>
      <span>Account information</span>
      <Separator />
      <div>
        Profile <Separator orientation="vertical" /> Security
      </div>
    </>
  );
}
