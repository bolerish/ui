import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionTopRight() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show top-right</Button>
      <Toaster position="top-right" />
      {/* @example-end */}
    </>
  );
}
