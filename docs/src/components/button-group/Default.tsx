import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { ButtonGroup } from "@bolerish/ui/button-group";
import { CaretLeftIcon, DotsThreeIcon } from "@phosphor-icons/react";
export default function Default() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: spacingVars.space3 }}>
      <ButtonGroup aria-label="Navigate back">
        <Button size="icon" variant="secondary" aria-label="Go back">
          <CaretLeftIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Message actions">
        <Button size="md" variant="secondary">
          Archive
        </Button>
        <Button size="md" variant="secondary">
          Report
        </Button>
      </ButtonGroup>

      <ButtonGroup aria-label="More actions">
        <Button size="md" variant="secondary">
          Snooze
        </Button>
        <Button size="icon" variant="secondary" aria-label="More actions">
          <DotsThreeIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
