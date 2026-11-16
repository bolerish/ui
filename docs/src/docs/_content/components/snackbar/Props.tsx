import { Button } from "@bolerish/ui/button";
import { Snackbar, type SnackbarProps } from "@bolerish/ui/snackbar";
import { useState } from "react";
function SnackbarPosition({ position }: Pick<SnackbarProps, "position">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show {position}
      </Button>
      <Snackbar position={position} open={open} onOpenChange={setOpen} duration={3000}>
        {position}
      </Snackbar>
    </>
  );
}
export const propExamples = {
  position: {
    "top-left": <SnackbarPosition position="top-left" />,
    "top-center": <SnackbarPosition position="top-center" />,
    "top-right": <SnackbarPosition position="top-right" />,
    "bottom-left": <SnackbarPosition position="bottom-left" />,
    "bottom-center": <SnackbarPosition position="bottom-center" />,
    "bottom-right": <SnackbarPosition position="bottom-right" />,
  },
  tone: {
    neutral: (
      <Snackbar position={null} duration={0} tone="neutral">
        neutral
      </Snackbar>
    ),
    success: (
      <Snackbar position={null} duration={0} tone="success">
        success
      </Snackbar>
    ),
    warning: (
      <Snackbar position={null} duration={0} tone="warning">
        warning
      </Snackbar>
    ),
    error: (
      <Snackbar position={null} duration={0} tone="error">
        error
      </Snackbar>
    ),
    info: (
      <Snackbar position={null} duration={0} tone="info">
        info
      </Snackbar>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["position"]["top-left"]
    /* @example-end */
  );
}
