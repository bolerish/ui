import { Button } from "@bolerish/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@bolerish/ui/dialog";

export const propExamples = {
  modal: {
    false: (
      <Dialog modal={false}>
        <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Edit your project.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogContent>
      </Dialog>
    ),
    true: (
      <Dialog modal={true}>
        <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Edit your project.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogContent>
      </Dialog>
    ),
    "trap-focus": (
      <Dialog modal="trap-focus">
        <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Edit your project.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogContent>
      </Dialog>
    ),
  },
  showCloseButton: {
    false: (
      <Dialog>
        <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
        <DialogContent showCloseButton={false}>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Edit your project.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogContent>
      </Dialog>
    ),
    true: (
      <Dialog>
        <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
        <DialogContent showCloseButton={true}>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Edit your project.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogContent>
      </Dialog>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["modal"]["false"]
    /* @example-end */
  );
}
