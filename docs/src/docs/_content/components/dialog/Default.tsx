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
import { Field, FieldLabel } from "@bolerish/ui/field";
import { Input } from "@bolerish/ui/input";
export default function Default() {
  return (
    /* @example-start */
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">Open profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Change the name shown to project members.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <Input />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
    /* @example-end */
  );
}
