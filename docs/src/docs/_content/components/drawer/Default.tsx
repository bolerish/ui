import { Button } from "@bolerish/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@bolerish/ui/drawer";

export default function Default() {
  return (
    /* @example-start */
    <Drawer showSwipeHandle swipeDirection="right">
      <DrawerTrigger render={<Button>Open right drawer</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move to folder</DrawerTitle>
          <DrawerDescription>Choose where to keep this project.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="secondary">Cancel</Button>} />
          <DrawerClose render={<Button>Move project</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    /* @example-end */
  );
}
