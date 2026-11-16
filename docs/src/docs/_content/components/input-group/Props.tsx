import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "@bolerish/ui/input-group";

export const propExamples = {
  align: {
    "inline-start": (
      <InputGroup>
        <InputGroupAddon align="inline-start">
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
    "inline-end": (
      <InputGroup>
        <InputGroupAddon align="inline-end">
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
    "block-start": (
      <InputGroup>
        <InputGroupAddon align="block-start">
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
    "block-end": (
      <InputGroup>
        <InputGroupAddon align="block-end">
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
  },
  invalid: {
    false: (
      <InputGroup invalid={false}>
        <InputGroupAddon>
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
    true: (
      <InputGroup invalid={true}>
        <InputGroupAddon>
          {" "}
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Web address" placeholder="example.com" />
      </InputGroup>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["inline-start"]
    /* @example-end */
  );
}
