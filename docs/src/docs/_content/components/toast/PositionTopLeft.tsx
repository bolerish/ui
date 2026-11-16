import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionTopLeft() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show top-left</Button>
      <Toaster position="top-left" />
      {/* @example-end */}
    </>
  );
}
