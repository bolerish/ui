import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionBottomCenter() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show bottom-center</Button>
      <Toaster position="bottom-center" />
      {/* @example-end */}
    </>
  );
}
