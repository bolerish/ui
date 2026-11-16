import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function PositionTopCenter() {
  return (
    <>
      {/* @example-start */}
      <Button onClick={() => toast.add({ title: "Saved." })}>Show top-center</Button>
      <Toaster position="top-center" />
      {/* @example-end */}
    </>
  );
}
