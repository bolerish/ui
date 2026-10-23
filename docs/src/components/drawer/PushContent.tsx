import { sizeVars } from "@bolerish/tokens/semantic.stylex";
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
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

const styles = stylex.create({
  shifted: {
    // Match the left Drawer's width; keep narrow layouts full-width.
    "@media (min-width: 48rem)": { marginLeft: `min(75vw, ${sizeVars.contentSm})` },
  },
});

export default function PushContent() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <section aria-label="Projects" {...stylex.props(open && styles.shifted)}>
        <h2>Projects</h2>
        <p>Make room for the panel on wide screens.</p>
        <DrawerTrigger render={<Button variant="outline">Open filters</Button>} />
      </section>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Choose which projects to display.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
