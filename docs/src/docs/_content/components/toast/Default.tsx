import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function Default() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Save</Button>
      <Toaster clearAllProps={{ children: "Dismiss all" }} />
      {/* @example-end */}
    </>
  );
}
