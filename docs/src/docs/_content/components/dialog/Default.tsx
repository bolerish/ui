import { Button } from "@bolerish/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@bolerish/ui/dialog";
import { Input } from "@bolerish/ui/input";
import { useId } from "react";
export default function Default() {
  const nameId = useId();
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">Open profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Change the name shown to project members.</DialogDescription>
        </DialogHeader>
        <label htmlFor={nameId}>
          Display name
          <Input id={nameId} />
        </label>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
