import { Separator } from "@bolerish/ui/separator";
export default function Default() {
  return (
    <>
      <span>Account information</span>
      {/* @example-start */}
      <Separator />
      {/* @example-end */}
      <div>
        Profile
        {/* @example-start */}
        <Separator orientation="vertical" />
        {/* @example-end */}
        Security
      </div>
    </>
  );
}
