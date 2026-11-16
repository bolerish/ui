import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionBottomRight() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show bottom-right</Button>
      <Toaster position="bottom-right" />
      {/* @example-end */}
    </>
  );
}
