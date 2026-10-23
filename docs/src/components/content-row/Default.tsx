import { Button } from "@bolerish/ui/button";
import {
  ContentRow,
  ContentRowActions,
  ContentRowContent,
  ContentRowDescription,
  ContentRowGroup,
  ContentRowMedia,
  ContentRowTitle,
} from "@bolerish/ui/content-row";
import { DotsThreeIcon, FolderIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <ContentRowGroup>
      <ContentRow variant="outline">
        <ContentRowMedia>
          <FolderIcon aria-hidden="true" />
        </ContentRowMedia>
        <ContentRowContent>
          <ContentRowTitle>Design system</ContentRowTitle>
          <ContentRowDescription>Last edited today at 2:18 PM</ContentRowDescription>
        </ContentRowContent>
        <ContentRowActions>
          <Button aria-label="More actions" size="icon" variant="ghost">
            <DotsThreeIcon aria-hidden="true" size="1rem" />
          </Button>
        </ContentRowActions>
      </ContentRow>
    </ContentRowGroup>
  );
}
