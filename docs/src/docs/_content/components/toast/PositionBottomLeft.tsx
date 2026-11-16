import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionBottomLeft() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show bottom-left</Button>
      <Toaster position="bottom-left" />
      {/* @example-end */}
    </>
  );
}
