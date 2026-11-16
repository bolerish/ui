import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@bolerish/ui/context-menu";

export const propExamples = {
  disabled: {
    false: (
      <ContextMenu>
        <ContextMenuTrigger>Right-click project</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled={false}>Rename</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
    true: (
      <ContextMenu>
        <ContextMenuTrigger>Right-click project</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled={true}>Rename</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["disabled"]["false"]
    /* @example-end */
  );
}
