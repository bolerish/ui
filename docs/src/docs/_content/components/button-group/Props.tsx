import { Button } from "@bolerish/ui/button";
import { ButtonGroup } from "@bolerish/ui/button-group";

export const propExamples = {
  orientation: {
    horizontal: (
      <ButtonGroup orientation="horizontal">
        <Button variant="secondary">Archive</Button>
        <Button variant="secondary">Delete</Button>
      </ButtonGroup>
    ),
    vertical: (
      <ButtonGroup orientation="vertical">
        <Button variant="secondary">Archive</Button>
        <Button variant="secondary">Delete</Button>
      </ButtonGroup>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["orientation"]["horizontal"]
    /* @example-end */
  );
}
