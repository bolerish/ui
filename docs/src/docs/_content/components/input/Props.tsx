import { Input } from "@bolerish/ui/input";

export const propExamples = {
  "aria-invalid": {
    false: <Input aria-label="Name" aria-invalid={false} placeholder="Enter a name" />,
    true: <Input aria-label="Name" aria-invalid={true} placeholder="Enter a name" />,
  },
  disabled: {
    false: <Input aria-label="Name" disabled={false} placeholder="Enter a name" />,
    true: <Input aria-label="Name" disabled={true} placeholder="Enter a name" />,
  },
  type: {
    text: (
      <Input aria-label="Name" type="text" defaultValue="Jordan Lee" placeholder="Enter a name" />
    ),
    email: (
      <Input
        aria-label="Name"
        type="email"
        defaultValue="jordan@example.com"
        placeholder="Enter a name"
      />
    ),
    password: (
      <Input aria-label="Name" type="password" defaultValue="s3cret" placeholder="Enter a name" />
    ),
    number: <Input aria-label="Name" type="number" defaultValue="42" placeholder="Enter a name" />,
    search: (
      <Input aria-label="Name" type="search" defaultValue="Project" placeholder="Enter a name" />
    ),
  },
  variant: {
    outline: <Input aria-label="Name" variant="outline" placeholder="Enter a name" />,
    none: <Input aria-label="Name" variant="none" placeholder="Enter a name" />,
    underline: <Input aria-label="Name" variant="underline" placeholder="Enter a name" />,
    inline: <Input aria-label="Name" variant="inline" placeholder="Enter a name" />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["aria-invalid"]["false"]
    /* @example-end */
  );
}
