import { Button } from "@bolerish/ui/button";
import { Snackbar } from "@bolerish/ui/snackbar";
import { useState } from "react";

export default function Default() {
  /* @example-start */
  const [open, setOpen] = useState(false);
  /* @example-end */

  return (
    <>
      {/* @example-start */}
      <Button onClick={() => setOpen((value) => !value)}>
        {open ? "Hide status" : "Show status"}
      </Button>
      <Snackbar tone="success" open={open} onOpenChange={setOpen}>
        <output>Operational</output>
      </Snackbar>
      {/* @example-end */}
    </>
  );
}
