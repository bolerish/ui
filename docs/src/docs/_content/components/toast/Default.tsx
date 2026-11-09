import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";
export default function Default() {
  return (
    <>
      <Button onClick={() => toast.add({ title: "Saved." })}>Save</Button>
      <Toaster clearAllProps={{ children: "Dismiss all" }} />
    </>
  );
}
