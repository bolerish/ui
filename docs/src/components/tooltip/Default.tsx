import { Button } from "@bolerish/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@bolerish/ui/tooltip";
export default function Default() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button size="icon" variant="secondary" aria-label="Help">
            ?
          </Button>
        }
      />
      <TooltipContent>View additional information.</TooltipContent>
    </Tooltip>
  );
}
