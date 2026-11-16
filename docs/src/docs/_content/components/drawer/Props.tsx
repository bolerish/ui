import { Button } from "@bolerish/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@bolerish/ui/drawer";

export const propExamples = {
  modal: {
    false: (
      <Drawer modal={false}>
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    true: (
      <Drawer modal={true}>
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    "trap-focus": (
      <Drawer modal="trap-focus">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
  },
  overlay: {
    visible: (
      <Drawer overlay="visible">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    transparent: (
      <Drawer overlay="transparent">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    none: (
      <Drawer overlay="none">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
  },
  showSwipeHandle: {
    false: (
      <Drawer showSwipeHandle={false}>
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    true: (
      <Drawer showSwipeHandle={true}>
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
  },
  swipeDirection: {
    up: (
      <Drawer swipeDirection="up">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    down: (
      <Drawer swipeDirection="down">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    left: (
      <Drawer swipeDirection="left">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
    ),
    right: (
      <Drawer swipeDirection="right">
        <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Edit your project.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerContent>
      </Drawer>
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
