"use client";

import { Snackbar, type SnackbarProps, type SnackbarPosition } from "./snackbar";

/** @deprecated Use SnackbarPosition. */
export type StatusPillPosition = SnackbarPosition;
/** @deprecated Use SnackbarProps with open/onOpenChange. */
export type StatusPillProps = Omit<SnackbarProps, "open" | "defaultOpen" | "position"> & {
  visible?: boolean;
  position?: StatusPillPosition;
};
/** @deprecated Use Snackbar. This compatibility component retains persistent inline defaults. */
export function StatusPill({ visible = true, position, duration = 0, ...props }: StatusPillProps) {
  return <Snackbar {...props} open={visible} position={position ?? null} duration={duration} />;
}
