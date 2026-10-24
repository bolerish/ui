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

function DrawerExample({ swipeDirection = "down" }: { swipeDirection?: DrawerDirection }) {
  return (
    <Drawer showSwipeHandle swipeDirection={swipeDirection}>
      <DrawerTrigger render={<Button>Open {swipeDirection} drawer</Button>} />
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
  );
}
type DrawerDirection = "down" | "up" | "left" | "right";
export default function Default() {
  return <DrawerExample />;
}
