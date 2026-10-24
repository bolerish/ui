import { Button } from "@bolerish/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@bolerish/ui/dialog";
export default function Default() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">Open profile</Button>} />
      <DialogContent>
        <DialogTitle>Profile</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
