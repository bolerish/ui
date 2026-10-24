import { Button } from "@bolerish/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bolerish/ui/empty";
import { FolderIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <FolderIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No saved projects</EmptyTitle>
        <EmptyDescription>
          Save projects you visit often to open them here quickly.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Save project</Button>
      </EmptyContent>
    </Empty>
  );
}
