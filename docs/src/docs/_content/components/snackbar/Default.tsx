import { Button } from "@bolerish/ui/button";
import { Snackbar } from "@bolerish/ui/snackbar";
import { useState } from "react";

export default function Default() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen((value) => !value)}>
        {open ? "Hide status" : "Show status"}
      </Button>
      <Snackbar tone="success" open={open} onOpenChange={setOpen}>
        <output>Operational</output>
      </Snackbar>
    </>
  );
}
