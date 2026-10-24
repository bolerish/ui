import { Button } from "@bolerish/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@bolerish/ui/popover";
export default function Default() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary">Align left</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Align left</PopoverTitle>
          <PopoverDescription>Align the popover start with the trigger.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
